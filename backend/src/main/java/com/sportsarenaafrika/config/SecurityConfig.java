package com.sportsarenaafrika.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration @EnableWebSecurity @EnableMethodSecurity @RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthFilter;
    @Value("${app.cors.allowed-origins}") private String allowedOrigins;

    @Bean PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health", "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/settings/appearance").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/media/files/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/settings/appearance").hasAuthority("ROLE_SUPER_ADMIN")
                .requestMatchers("/api/auth/register").denyAll()
                .requestMatchers("/api/users/**").hasAuthority("ROLE_SUPER_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/articles/manage").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_EDITOR")
                .requestMatchers(HttpMethod.GET, "/api/articles/mine").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_EDITOR", "ROLE_JOURNALIST")
                .requestMatchers(HttpMethod.GET, "/api/articles/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/discussions/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/discussions/*/comments").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/discussions/*/like").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/polls/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/polls/*/vote").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/articles").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_EDITOR", "ROLE_JOURNALIST")
                .requestMatchers(HttpMethod.PUT, "/api/articles/*/submit-review").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_EDITOR", "ROLE_JOURNALIST")
                .requestMatchers(HttpMethod.PUT, "/api/articles/*/approve").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_EDITOR")
                .requestMatchers(HttpMethod.PUT, "/api/articles/*/publish").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_EDITOR")
                .requestMatchers(HttpMethod.PUT, "/api/articles/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_EDITOR", "ROLE_JOURNALIST")
                .requestMatchers(HttpMethod.DELETE, "/api/articles/**").hasAnyAuthority("ROLE_SUPER_ADMIN", "ROLE_EDITOR")
                .anyRequest().authenticated())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration c = new CorsConfiguration();
        c.setAllowedOrigins(Arrays.stream(allowedOrigins.split(",")).map(String::trim).filter(s -> !s.isBlank()).toList());
        c.setAllowedMethods(Arrays.asList("GET","POST","PUT","DELETE","OPTIONS","PATCH"));
        c.setAllowedHeaders(Arrays.asList("Authorization","Content-Type","X-Requested-With","Accept","X-CSRF-Token"));
        c.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", c);
        return source;
    }
}
