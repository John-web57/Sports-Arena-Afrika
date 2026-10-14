package com.sportsarenaafrika.controller;

import com.sportsarenaafrika.model.Role;
import com.sportsarenaafrika.model.User;
import com.sportsarenaafrika.repository.ArticleRepository;
import com.sportsarenaafrika.repository.RoleRepository;
import com.sportsarenaafrika.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
public class UserController {
    private final UserRepository users;
    private final RoleRepository roles;
    private final ArticleRepository articles;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public List<UserView> list() {
        return users.findAllByOrderByFullNameAsc().stream().map(this::view).toList();
    }

    @GetMapping("/{id}")
    public UserView get(@PathVariable Long id) { return view(find(id)); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserView create(@RequestBody UserRequest request) {
        validate(request, true);
        String username = request.username().trim().toLowerCase();
        String email = request.email().trim().toLowerCase();
        if (users.existsByUsername(username) || users.existsByEmail(email))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username or email is already in use");
        User user = User.builder().username(username).email(email).fullName(request.fullName().trim())
                .password(passwordEncoder.encode(request.password())).role(findRole(request.role()))
                .status(normalizeStatus(request.status())).avatarUrl(request.avatarUrl())
                .department(request.department()).phone(request.phone()).bio(request.bio())
                .socialProfiles(request.socialProfiles()).build();
        return view(users.save(user));
    }

    @PutMapping("/{id}")
    public UserView update(@PathVariable Long id, @RequestBody UserRequest request) {
        validate(request, false);
        User user = find(id);
        String email = request.email().trim().toLowerCase();
        String username = request.username().trim().toLowerCase();
        users.findByUsername(username).filter(existing -> !existing.getId().equals(id)).ifPresent(existing -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username is already in use");
        });
        users.findByEmail(email).filter(existing -> !existing.getId().equals(id)).ifPresent(existing -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already in use");
        });
        user.setFullName(request.fullName().trim());
        user.setUsername(username);
        user.setEmail(email);
        user.setRole(findRole(request.role()));
        user.setStatus(normalizeStatus(request.status()));
        user.setAvatarUrl(request.avatarUrl());
        user.setDepartment(request.department());
        user.setPhone(request.phone());
        user.setBio(request.bio());
        user.setSocialProfiles(request.socialProfiles());
        if (request.password() != null && !request.password().isBlank())
            user.setPassword(passwordEncoder.encode(request.password()));
        return view(users.save(user));
    }

    private User find(Long id) {
        return users.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Role findRole(String name) {
        if (name == null || !List.of("ROLE_SUPER_ADMIN", "ROLE_EDITOR", "ROLE_JOURNALIST").contains(name))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported newsroom role");
        return roles.findByName(name).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role not found"));
    }

    private String normalizeStatus(String status) {
        String normalized = status == null ? "ACTIVE" : status.trim().toUpperCase();
        if (!List.of("ACTIVE", "INACTIVE", "SUSPENDED").contains(normalized))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported account status");
        return normalized;
    }

    private void validate(UserRequest request, boolean creating) {
        if (request.fullName() == null || request.fullName().isBlank() || request.username() == null || request.username().isBlank()
                || request.email() == null || request.email().isBlank() || (creating && (request.password() == null || request.password().isBlank())))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name, username, email and an initial password are required");
    }

    private UserView view(User user) {
        return new UserView(user.getId(), user.getFullName(), user.getUsername(), user.getEmail(), user.getRole().getName(),
                user.getStatus(), user.getAvatarUrl(), user.getDepartment(), user.getPhone(), user.getBio(), user.getSocialProfiles(),
                user.getCreatedAt(), user.getLastLoginAt(), articles.countByAuthor_Id(user.getId()));
    }

    public record UserRequest(String fullName, String username, String email, String password, String role, String status,
                              String avatarUrl, String department, String phone, String bio, String socialProfiles) {}
    public record UserView(Long id, String fullName, String username, String email, String role, String status,
                           String avatarUrl, String department, String phone, String bio, String socialProfiles,
                           LocalDateTime createdAt, LocalDateTime lastLoginAt, long articlesCount) {}
}
