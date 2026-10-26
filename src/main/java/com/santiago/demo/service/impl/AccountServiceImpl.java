package com.santiago.demo.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.santiago.demo.dto.response.AccountResponse;
import com.santiago.demo.entity.Account;
import com.santiago.demo.entity.User;
import com.santiago.demo.exception.ResourceNotFoundException;
import com.santiago.demo.repository.AccountRepository;
import com.santiago.demo.repository.UserRepository;
import com.santiago.demo.service.AccountService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @Override
    public List<AccountResponse> getUserAccounts(String email){
        User user = userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("Usuario no encontrado con el email: "+email));

        return accountRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AccountResponse getAccountByNumber(String accountNumber, String email) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Cuenta no encontrada: " + accountNumber));

        if (!account.getUser().getEmail().equals(email)) {
            throw new ResourceNotFoundException("No tiene permisos para ver esta cuenta");
        }

        return mapToResponse(account);
    }

    private AccountResponse mapToResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .balance(account.getBalance())
                .accountType(account.getAccountType())
                .build();
    }

}