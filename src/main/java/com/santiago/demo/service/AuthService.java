package com.santiago.demo.service;

import com.santiago.demo.dto.request.LoginRequest;
import com.santiago.demo.dto.request.RegisterRequest;
import com.santiago.demo.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
