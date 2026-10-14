package com.sportsarenaafrika.config;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String,Object>> validation(MethodArgumentNotValidException ex) {
        Map<String,Object> body=new LinkedHashMap<>(); body.put("error","Validation failed");
        body.put("fields",ex.getBindingResult().getFieldErrors().stream().collect(java.util.stream.Collectors.toMap(e->e.getField(), e->e.getDefaultMessage(), (a,b)->a, LinkedHashMap::new)));
        return ResponseEntity.badRequest().body(body);
    }
    @ExceptionHandler(BadCredentialsException.class)
    ResponseEntity<Map<String,Object>> unauthorized(BadCredentialsException ex) { return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","Invalid username or password")); }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<Map<String,Object>> badRequest(IllegalArgumentException ex) { return ResponseEntity.badRequest().body(Map.of("error",ex.getMessage())); }
    @ExceptionHandler(IllegalStateException.class)
    ResponseEntity<Map<String,Object>> conflict(IllegalStateException ex) { return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error",ex.getMessage())); }
}
