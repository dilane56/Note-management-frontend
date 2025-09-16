package org.kfokam48.notemanagementbackend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json; charset=UTF-8");
        
        String jsonResponse = String.format(
            "{"
            + "\"timestamp\":\"%s\","
            + "\"status\":401,"
            + "\"error\":\"Unauthorized\","
            + "\"message\":\"Accès non autorisé. Token d'authentification requis.\","
            + "\"path\":\"%s\","
            + "\"errorCode\":\"NO_TOKEN\""
            + "}",
            LocalDateTime.now().toString(),
            request.getRequestURI()
        );
        
        response.getWriter().write(jsonResponse);
        response.getWriter().flush();
    }
}