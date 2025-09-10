package org.kfokam48.stagemanagementbackend.service.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;

import org.kfokam48.stagemanagementbackend.dto.auth.LoginRequest;
import org.kfokam48.stagemanagementbackend.enums.Roles;
import org.kfokam48.stagemanagementbackend.exception.AuthenticationFailedException;
import org.kfokam48.stagemanagementbackend.exception.InvalidTokenException;
import org.kfokam48.stagemanagementbackend.exception.RessourceNotFoundException;
import org.kfokam48.stagemanagementbackend.model.Utilisateur;
import org.kfokam48.stagemanagementbackend.repository.UtilisateurRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.security.SecureRandom;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Value("${jwt.secret}")
    private String jwtSecretString; // La clé secrète lue depuis la configuration
    // Dans AuthService
    @Value("${jwt.expiration.milliseconds}")
    private long jwtExpirationMs;
    private SecretKey signingKey; // Pour stocker la clé décodée une fois



    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UtilisateurRepository utilisateurRepository;



    public AuthService(AuthenticationManager authenticationManager, UserDetailsService userDetailsService, UtilisateurRepository utilisateurRepository) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.utilisateurRepository = utilisateurRepository;
    }

    // Initialisation de la clé au démarrage du service
    // @PostConstruct est une bonne pratique pour l'initialisation après l'injection de dépendances
    @jakarta.annotation.PostConstruct // Utilisez jakarta.annotation.PostConstruct si Spring Boot 3+
    private void init() {
        // Décoder la chaîne Base64 en bytes, puis créer la SecretKey
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecretString);
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        // Vous pouvez vérifier la longueur ici pour vous assurer qu'elle est correcte
        System.out.println("Clé JWT chargée. Longueur (octets) : " + this.signingKey.getEncoded().length);
    }


    public Map<String, Object> authenticateUserWithTokens(@Valid LoginRequest authRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
            );
            UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
            Utilisateur user = utilisateurRepository.findByEmail(authRequest.getEmail())
                    .orElseThrow(() -> new RessourceNotFoundException("user not found"));

            String accessToken = Jwts.builder()
                    .issuer("STAGE-MANAGEMENT")
                    .subject(userDetails.getUsername())
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000)) // 15 min
                    .signWith(signingKey)
                    .compact();

            String refreshToken = Jwts.builder()
                    .issuer("STAGE-MANAGEMENT")
                    .subject(userDetails.getUsername())
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000L)) // 7 jours
                    .signWith(signingKey)
                    .compact();

            Map<String, Object> userProfile = new HashMap<>();
            // Remplir userProfile selon ton modèle Utilisateur

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("email", user.getEmail());
            userMap.put("name", user.getFullName());
            userMap.put("role", user.getRole().name().toLowerCase());
            userMap.put("avatar", user.getAvatar()); // ou user.getAvatar()
            userMap.put("telephone", user.getTelephone());
            userMap.put("createAt", user.getCreateAt());
            userMap.put("updateAt", user.getUpdateAt());
            userMap.put("profile", userProfile);

            Map<String, Object> data = new HashMap<>();
            data.put("user", userMap);
            data.put("token", accessToken);
            data.put("refreshToken", refreshToken);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", data);

            return response;
        } catch (Exception e) {
            throw new AuthenticationFailedException("Identifiants invalides");
        }
    }


    // Raffraichir le token d'acces
    public String refreshAccessToken(String refreshToken) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(refreshToken)
                    .getPayload();

            String username = claims.getSubject();
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            return Jwts.builder()
                    .issuer("STAGE-MANAGEMENT")
                    .subject(userDetails.getUsername())
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000)) // 15 min
                    .signWith(signingKey)
                    .compact();
        } catch (Exception e) {
            throw new InvalidTokenException("Refresh token invalide ou expiré");
        }
    }
// ...existing code...

    public String authenticateUser(@Valid LoginRequest authRequest) {
        try {
            // Authentification
            System.out.println("Authentification en cours...");
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
            );
            // Récupération des détails de l'utilisateur
            UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
            System.out.println("Authentification réussie pour l'utilisateur : " + userDetails.getUsername());
//            // Génération du token JWT
            return Jwts.builder()
                    .issuer("STAGE-MANAGEMENT")
                    .subject(userDetails.getUsername())
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + 86400000)) // Expire dans 1 jour
                    .signWith(signingKey)
                    .compact();

        } catch (Exception e) {
            // Gestion des erreurs avec un message explicite
            System.out.println("Erreur d'authentification : " + e.getMessage());
            throw new AuthenticationFailedException("Identifiants invalides : vérifiez l'e-mail ou le mot de passe.");
        }

    }
    public Roles getUserRole(LoginRequest loginRequest){
        Utilisateur user = utilisateurRepository.findByEmail(loginRequest.getEmail()).orElseThrow(()-> new RessourceNotFoundException("user not found"));
        return user.getRole();
    }



}