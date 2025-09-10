package org.kfokam48.stagemanagementbackend.chat;

import lombok.RequiredArgsConstructor;

import org.kfokam48.stagemanagementbackend.chat.message.MessageDTO;
import org.kfokam48.stagemanagementbackend.chat.message.MessageResponseDTO;
import org.kfokam48.stagemanagementbackend.controlleur.notification.NotificationController;
import org.kfokam48.stagemanagementbackend.enums.UserStatus;
import org.kfokam48.stagemanagementbackend.model.Utilisateur;
import org.kfokam48.stagemanagementbackend.repository.UtilisateurRepository;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.Instant;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;
    private final UtilisateurRepository utilisateurRepository;
    private final NotificationController notificationController;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload MessageDTO chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        try {
            Message savedMessage = chatService.sendMessages(chatMessage);
            MessageResponseDTO messageResponse = chatService.convertToResponseDTO(savedMessage);

            // Envoi au destinataire
            messagingTemplate.convertAndSendToUser(
                    chatMessage.getDestinataireId().toString(),
                    "/queue/messages",
                    messageResponse
            );
            notificationController.sendNotification(savedMessage.getDestinataire().getId(), "Nouveau message", "Vous avez un nouveau message de " + savedMessage.getExpediteur().getFullName(),false);

            // Envoi à l'expéditeur pour confirmation
            messagingTemplate.convertAndSendToUser(
                    chatMessage.getExpediteurId().toString(),
                    "/queue/messages",
                    messageResponse
            );

        } catch (Exception e) {
            messagingTemplate.convertAndSendToUser(
                    chatMessage.getExpediteurId().toString(),
                    "/queue/errors",
                    "Erreur lors de l'envoi du message: " + e.getMessage()
            );
        }
    }

    @MessageMapping("/chat.join")
    public void addUser(@Payload String userId, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("user_id", userId);

        try {
            Long userIdLong = Long.parseLong(userId);
            Utilisateur user = utilisateurRepository.findById(userIdLong).orElse(null);

            if (user != null) {
                user.setStatus(UserStatus.EN_LIGNE);
                user.setDerniereConnexion(Instant.now());
                utilisateurRepository.save(user);

                // Notifier tous les utilisateurs du changement de statut
               notificationController.sendNotification(user.getId(), "Statut mis à jour", "Votre statut a été mis à jour à EN_LIGNE", false);
                // Utilisation de DTO pour un formatage plus propre et plus sûr
                messagingTemplate.convertAndSend("/topic/status",
                        String.format("{\"userId\": %d, \"status\": \"EN_LIGNE\"}", user.getId()));
            }
        } catch (Exception e) {
            System.err.println("Erreur lors de la mise à jour du statut utilisateur: " + e.getMessage());
        }
    }
}