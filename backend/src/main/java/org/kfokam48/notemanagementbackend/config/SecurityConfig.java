package org.kfokam48.notemanagementbackend.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfig {



    private final JwtRequestFillter jwtRequestFilter;
    private final AuthenticationEntryPointImpl authenticationEntryPoint;

    public SecurityConfig(JwtRequestFillter jwtRequestFilter, AuthenticationEntryPointImpl authenticationEntryPoint) {
        this.jwtRequestFilter = jwtRequestFilter;
        this.authenticationEntryPoint = authenticationEntryPoint;
    }


    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors
                        .configurationSource(request -> {
                            var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                            corsConfig.setAllowedOrigins(java.util.List.of("http://localhost:3000", "http://localhost:3001")); // Remplace par l’URL de ton frontend
                            corsConfig.setAllowedMethods(java.util.List.of("GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS"));
                            corsConfig.setAllowedHeaders(java.util.List.of("*"));
                            corsConfig.setAllowCredentials(true);
                            return corsConfig;
                        })
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-resources/**",
                                "/webjars/**",
                                "/api/auth/login",
                                "/api/patient",
                                "/api/administrateurs/create",
                                "/api/medecins",
                                "/api/utilisateurs",
                                "/ws-chat/**"
                        ).permitAll()
                        .anyRequest().authenticated())
                .exceptionHandling(exceptionHandling ->
                        exceptionHandling
                                .authenticationEntryPoint(authenticationEntryPoint)
                                .accessDeniedHandler((request, response, accessDeniedException) -> {
                                    response.setStatus(HttpStatus.FORBIDDEN.value());
                                    response.setContentType("application/json; charset=UTF-8");
                                    String jsonResponse = String.format(
                                        "{"
                                        + "\"timestamp\":\"%s\","
                                        + "\"status\":403,"
                                        + "\"error\":\"Forbidden\","
                                        + "\"message\":\"Accès refusé : %s\","
                                        + "\"path\":\"%s\","
                                        + "\"errorCode\":\"ACCESS_DENIED\""
                                        + "}",
                                        java.time.LocalDateTime.now().toString(),
                                        accessDeniedException.getMessage(),
                                        request.getRequestURI()
                                    );
                                    response.getWriter().write(jsonResponse);
                                    response.getWriter().flush();
                                })
                )

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }




    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }


}