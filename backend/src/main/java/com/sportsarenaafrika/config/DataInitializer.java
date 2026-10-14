package com.sportsarenaafrika.config;

import com.sportsarenaafrika.model.Category;
import com.sportsarenaafrika.model.Role;
import com.sportsarenaafrika.model.User;
import com.sportsarenaafrika.repository.CategoryRepository;
import com.sportsarenaafrika.repository.RoleRepository;
import com.sportsarenaafrika.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component @RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final RoleRepository roleRepository; private final CategoryRepository categoryRepository;
    private final UserRepository userRepository; private final PasswordEncoder passwordEncoder;
    @Value("${BOOTSTRAP_ADMIN_USERNAME:}") private String adminUsername;
    @Value("${BOOTSTRAP_ADMIN_EMAIL:}") private String adminEmail;
    @Value("${BOOTSTRAP_ADMIN_PASSWORD:}") private String adminPassword;
    @Value("${BOOTSTRAP_ADMIN_NAME:Sports Arena Administrator}") private String adminName;

    @Override @Transactional
    public void run(String... args) {
        Role admin = roleRepository.findByName("ROLE_SUPER_ADMIN").orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_SUPER_ADMIN").build()));
        roleRepository.findByName("ROLE_EDITOR").orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_EDITOR").build()));
        roleRepository.findByName("ROLE_JOURNALIST").orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_JOURNALIST").build()));

        String[][] categories = {
            {"Latest News","latest-news"},{"Kenya Sports","kenya-sports"},{"African Football","african-football"},
            {"International Football","international-football"},{"Transfers","transfers"},{"Women's Sports","womens-sports"},
            {"Basketball","basketball"},{"Opinion","opinion"},{"Videos","videos"},{"Podcasts","podcasts"}
        };
        for (String[] c : categories) categoryRepository.findBySlug(c[1]).orElseGet(() -> categoryRepository.save(Category.builder().name(c[0]).slug(c[1]).description(c[0] + " coverage").build()));

        if (!adminUsername.isBlank() && !adminEmail.isBlank() && !adminPassword.isBlank() && !userRepository.existsByUsername(adminUsername)) {
            userRepository.save(User.builder().username(adminUsername).email(adminEmail).password(passwordEncoder.encode(adminPassword)).fullName(adminName).role(admin).build());
        }
    }
}
