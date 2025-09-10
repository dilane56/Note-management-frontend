package org.kfokam48.stagemanagementbackend.controlleur.notification;

import lombok.RequiredArgsConstructor;
import org.kfokam48.stagemanagementbackend.dto.MailDTO;
import org.kfokam48.stagemanagementbackend.dto.notification.NotificationResponseDTO;
import org.kfokam48.stagemanagementbackend.service.mail.EmailService;
import org.kfokam48.stagemanagementbackend.service.notification.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationRestController {

    private final NotificationService notificationService;
    private final EmailService emailService;

    @GetMapping("/{userId}")
    public List<NotificationResponseDTO> getUserNotifications(@PathVariable Long userId) {
        return notificationService.getUserNotifications(userId);
    }

    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(MailDTO mailDTO) {
       emailService.sendMail(mailDTO);
        return ResponseEntity.ok("mail envoyer avec succes");
    }
    @PutMapping("utilisateur/{userId}/lire-tout")
    public void markAllAsReadByUserId(@PathVariable Long userId) {
        notificationService.markAllAsReadByUserId(userId);
    }
    @GetMapping("utilisateur/{userId}/non-lues/count")
    public int getNumberOfNotReadNotificationByUserId(@PathVariable Long userId){
        return notificationService.getNumberOfNotReadNotificationByUserId(userId);
    }
}
