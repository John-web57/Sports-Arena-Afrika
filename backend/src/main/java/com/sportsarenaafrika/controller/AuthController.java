package com.sportsarenaafrika.controller;

import com.sportsarenaafrika.dto.AuthDto;
import com.sportsarenaafrika.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    @Value("${app.auth.cookie-secure:true}") private boolean cookieSecure;

    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> login(@RequestBody AuthDto.LoginRequest request, HttpServletResponse response) {
        AuthDto.AuthResponse result = authService.login(request);
        ResponseCookie cookie = ResponseCookie.from("arena_access", result.getToken())
                .httpOnly(true).secure(cookieSecure).sameSite("Strict").path("/").maxAge(900).build();
        response.addHeader("Set-Cookie", cookie.toString());
        result.setToken(null);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("arena_access", "")
                .httpOnly(true).secure(cookieSecure).sameSite("Strict").path("/").maxAge(0).build();
        response.addHeader("Set-Cookie", cookie.toString());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody AuthDto.RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(403).build();
    }
}
