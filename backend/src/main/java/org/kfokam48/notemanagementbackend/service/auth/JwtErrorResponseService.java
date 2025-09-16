package org.kfokam48.notemanagementbackend.service.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.kfokam48.notemanagementbackend.dto.ErrorResponseDTO;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
public class JwtErrorResponseService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public void sendErrorResponse(HttpServletResponse response, String errorCode, String message, String path, int status) throws IOException {
        if (!response.isCommitted()) {
            response.resetBuffer();
            response.setStatus(status);
            response.setContentType("application/json; charset=UTF-8");
            
            ErrorResponseDTO errorResponse = new ErrorResponseDTO(
                LocalDateTime.now(),
                status,
                getErrorName(status),
                message,
                path,
                errorCode
            );
            
            String jsonResponse = objectMapper.writeValueAsString(errorResponse);
            response.getWriter().write(jsonResponse);
            response.getWriter().flush();
        }
    }

    private String getErrorName(int status) {
        return switch (status) {
            case 401 -> "Unauthorized";
            case 403 -> "Forbidden";
            case 400 -> "Bad Request";
            case 500 -> "Internal Server Error";
            default -> "Error";
        };
    }

    public static class ErrorCodes {
        public static final String TOKEN_EXPIRED = "TOKEN_EXPIRED";
        public static final String INVALID_SIGNATURE = "INVALID_SIGNATURE";
        public static final String MALFORMED_TOKEN = "MALFORMED_TOKEN";
        public static final String UNSUPPORTED_TOKEN = "UNSUPPORTED_TOKEN";
        public static final String EMPTY_TOKEN = "EMPTY_TOKEN";
        public static final String NO_TOKEN = "NO_TOKEN";
        public static final String INTERNAL_ERROR = "INTERNAL_ERROR";
        public static final String ACCESS_DENIED = "ACCESS_DENIED";
    }
}