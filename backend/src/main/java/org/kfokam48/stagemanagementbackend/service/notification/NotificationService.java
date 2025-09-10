package org.kfokam48.stagemanagementbackend.service.notification;

import lombok.RequiredArgsConstructor;

import org.kfokam48.stagemanagementbackend.dto.notification.NotificationResponseDTO;
import org.kfokam48.stagemanagementbackend.mapper.NotificationMapper;
import org.kfokam48.stagemanagementbackend.model.Notification;
import org.kfokam48.stagemanagementbackend.model.Utilisateur;
import org.kfokam48.stagemanagementbackend.repository.NotificationRepository;
import org.kfokam48.stagemanagementbackend.repository.UtilisateurRepository;
import org.kfokam48.stagemanagementbackend.service.mail.EmailService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final UtilisateurRepository utilisateurRepository;
    private final EmailService emailService;


    public Notification createnotifcation(Long recepteurId, String titre, String message, boolean sendMail ){
        Notification notif = Notification.builder()
                .destinataireId(recepteurId)
                .titre(titre)
                .dateEnvoi(LocalDateTime.now())
                .message(message)
                .lu(false)
                .build();

            notificationRepository.save(notif);

        // Envoi d'email
        if (sendMail) {
            Utilisateur user = utilisateurRepository.findById(recepteurId).orElse(null);
            String email = user != null ? user.getEmail() : null;
            if (email != null && !email.isEmpty()) {
                emailService.sendEmail(email, titre, message);
            }
        }

            return notif;


    }

    public NotificationResponseDTO convertToNotificationResponseDTO(Notification notification){
        return notificationMapper.notficationToNotificationResponseDTO(notification);
    }
    public List<NotificationResponseDTO> getUserNotifications(Long recepteurId) {
        return  notificationMapper.notificationListToNotificationResponseDTOList(notificationRepository.findByDestinataireIdOrderByDateEnvoiDesc(recepteurId));
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setLu(true);
            notificationRepository.save(n);
        });
    }

    public void markAllAsReadByUserId(Long userId) {
        List<Notification> notifications = notificationRepository.findByDestinataireIdOrderByDateEnvoiDesc(userId);
        notifications.forEach(n -> n.setLu(true));
        notificationRepository.saveAll(notifications);
    }

    public int getNumberOfNotReadNotificationByUserId(Long userId){
        List<Notification> notifications = notificationRepository.findByDestinataireIdOrderByDateEnvoiDesc(userId);
        int number =0;
        for( Notification notification : notifications){
            if(!notification.getLu()){
                number++;
            }

        }
        return number;
    }
}
