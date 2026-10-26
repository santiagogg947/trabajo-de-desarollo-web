package com.santiago.demo.service;

import java.util.List;

import com.santiago.demo.dto.request.TransferRequest;
import com.santiago.demo.dto.response.TransactionResponse;

public interface TransactionService {
    TransactionResponse transfer(TransferRequest request, String currentUserEmail);
    List<TransactionResponse> getAccountHistory(String accountNumber, String currentUserEmail);
}
