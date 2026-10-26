package com.santiago.demo.dto.response;

import java.math.BigDecimal;

import com.santiago.demo.entity.enums.AccountType;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AccountResponse {
    private Long id;
    private String accountNumber;
    private BigDecimal balance;
    private AccountType accountType;
}