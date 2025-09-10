package org.kfokam48.notemanagementbackend.config;

import org.kfokam48.notemanagementbackend.enums.Roles;
import org.kfokam48.notemanagementbackend.model.Admin;
import org.kfokam48.notemanagementbackend.repository.AdminRepository;
import org.kfokam48.notemanagementbackend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DefaultUserInitializer implements CommandLineRunner {

    private final AdminRepository userRepository;
    private final UserRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public DefaultUserInitializer(AdminRepository userRepository, UserRepository utilisateurRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public void run(String... args) throws Exception {
        // Vérifiez si l'utilisateur par défaut existe déjà
        if (utilisateurRepository.findByEmail("admin@gmail.com").isEmpty()) {
            Admin user = new Admin();
            user.setFirstName("admin");
            user.setLastName("admin");
            user.setEmail("admin@gmail.com");
            user.setPassword(passwordEncoder.encode("password")); // Encodez le mot de passe
            user.setRole(Roles.valueOf("ADMIN")); // Définissez le rôle

            userRepository.save(user); // Enregistrez l'utilisateur
        }
    }
}

