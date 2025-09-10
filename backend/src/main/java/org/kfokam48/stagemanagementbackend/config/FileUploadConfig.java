package org.kfokam48.stagemanagementbackend.config;
import jakarta.servlet.MultipartConfigElement;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.util.unit.DataSize;

@Configuration
public class FileUploadConfig {

    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setMaxFileSize(DataSize.ofMegabytes(10)); // Taille max du fichier : 10 Mo
        factory.setMaxRequestSize(DataSize.ofMegabytes(10)); // Taille max de la requête : 10 Mo
        return factory.createMultipartConfig();
    }
}