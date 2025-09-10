package org.kfokam48.stagemanagementbackend.controlleur.notification;

import lombok.RequiredArgsConstructor;

import org.kfokam48.stagemanagementbackend.dto.notification.NotificationResponseDTO;
import org.kfokam48.stagemanagementbackend.model.Notification;
import org.kfokam48.stagemanagementbackend.service.notification.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;


    @GetMapping("/utilisateur/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ETUDIANT') or hasRole('ENTREPRISE') or hasRole('ENSEIGNANT')")
    public ResponseEntity<List<NotificationResponseDTO>> getNotificationsByUserId(@PathVariable Long userId) {
        List<NotificationResponseDTO> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{notificationId}/lire")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ETUDIANT') or hasRole('ENTREPRISE') or hasRole('ENSEIGNANT')")
    public ResponseEntity<String> markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok("Notification marquée comme lue");
    }

    public void sendNotification(Long recepteurId, String title, String message, boolean sendMail) {
        Notification notif = notificationService.createnotifcation(recepteurId, title, message, sendMail);
        NotificationResponseDTO responseDTO = notificationService.convertToNotificationResponseDTO(notif);

        // envoi temps réel via STOMP
        messagingTemplate.convertAndSendToUser(
                recepteurId.toString(),
                "/notifications",
                responseDTO
        );
    }
}
