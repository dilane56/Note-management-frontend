package org.kfokam48.stagemanagementbackend.chat;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/sendMessage") // 🔥 Reçoit un message
    @SendTo("/topic/messages") // ✅ Diffuse le message à tous les clients
    public String sendMessage(String message) {
        return message; // Renvoie le message reçu à tous les abonnés
    }
}
