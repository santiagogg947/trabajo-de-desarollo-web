package com.santiago.demo.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.santiago.demo.dto.request.TransferRequest;
import com.santiago.demo.dto.response.TransactionResponse;
import com.santiago.demo.entity.Account;
import com.santiago.demo.entity.Transaction;
import com.santiago.demo.entity.enums.TransactionType;
import com.santiago.demo.exception.BadRequestException;
import com.santiago.demo.exception.InsufficientBalanceException;
import com.santiago.demo.exception.ResourceNotFoundException;
import com.santiago.demo.repository.AccountRepository;
import com.santiago.demo.repository.TransactionRepository;
import com.santiago.demo.service.TransactionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Override
    @Transactional
    public TransactionResponse transfer(TransferRequest request, String currentUserEmail) {
        String origen = request.getSourceAccountNumber();
        String destino = request.getDestinationAccountNumber();

        if (origen.equals(destino)) {
            throw new BadRequestException("La cuenta de origen y la de destino no pueden ser la misma");
        }

        // Se bloquean siempre en el mismo orden (por número de cuenta) para evitar
        // que dos transferencias cruzadas se queden esperando una a la otra.
        boolean origenPrimero = origen.compareTo(destino) < 0;
        String primero = origenPrimero ? origen : destino;
        String segundo = origenPrimero ? destino : origen;

        Account cuentaPrimero = accountRepository.findByAccountNumberForUpdate(primero)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada: " + primero));
        Account cuentaSegundo = accountRepository.findByAccountNumberForUpdate(segundo)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada: " + segundo));

        Account sourceAccount = origenPrimero ? cuentaPrimero : cuentaSegundo;
        Account destinationAccount = origenPrimero ? cuentaSegundo : cuentaPrimero;

        if (!sourceAccount.getUser().getEmail().equals(currentUserEmail)) {
            throw new BadRequestException("La cuenta de origen no pertenece al usuario autenticado");
        }

        if (sourceAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException("Saldo insuficiente para realizar la transferencia");
        }

        sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getAmount()));
        destinationAccount.setBalance(destinationAccount.getBalance().add(request.getAmount()));

        accountRepository.save(sourceAccount);
        accountRepository.save(destinationAccount);

        Transaction transaction = Transaction.builder()
                .sourceAccount(sourceAccount)
                .destinationAccount(destinationAccount)
                .amount(request.getAmount())
                .transactionType(TransactionType.TRANSFER)
                .description(request.getDescription() == null || request.getDescription().isBlank()
                        ? "Transferencia entre cuentas" : request.getDescription())
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToResponse(savedTransaction);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> getAccountHistory(String accountNumber, String currentUserEmail) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada: " + accountNumber));

        if (!account.getUser().getEmail().equals(currentUserEmail)) {
            throw new BadRequestException("No tiene permisos para consultar el historial de esta cuenta");
        }

        return transactionRepository.findAllByAccountId(account.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .sourceAccountNumber(transaction.getSourceAccount() != null ? transaction.getSourceAccount().getAccountNumber() : null)
                .destinationAccount(transaction.getDestinationAccount() != null ? transaction.getDestinationAccount().getAccountNumber() : null)
                .amount(transaction.getAmount())
                .transactionType(transaction.getTransactionType())
                .description(transaction.getDescription())
                .timestamp(transaction.getTimestamp())
                .build();
    }
}