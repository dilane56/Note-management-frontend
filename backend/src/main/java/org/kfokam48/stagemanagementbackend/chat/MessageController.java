package org.kfokam48.stagemanagementbackend.chat;

import lombok.RequiredArgsConstructor;

import org.kfokam48.stagemanagementbackend.chat.conversation.ConversationResponseDTO;
import org.kfokam48.stagemanagementbackend.chat.message.MessageResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final ChatService chatService;

    @GetMapping("/conversation/{user1Id}/{user2Id}")
    public ResponseEntity<List<MessageResponseDTO>> getConversation(
            @PathVariable String user1Id,
            @PathVariable String user2Id) {
        try {
            if ("undefined".equals(user1Id) || "undefined".equals(user2Id)) {
                return ResponseEntity.badRequest().build();
            }
            Long userId1 = Long.parseLong(user1Id);
            Long userId2 = Long.parseLong(user2Id);
            List<MessageResponseDTO> messages = chatService.getConversation(userId1, userId2);
            return ResponseEntity.ok(messages);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/mark-as-read/{senderId}/{recipientId}")
    public ResponseEntity<Void> markMessagesAsRead(
            @PathVariable Long senderId,
            @PathVariable Long recipientId) {
        try {
            chatService.markMessagesAsRead(senderId, recipientId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/send")
    public ResponseEntity<MessageResponseDTO> sendMessage(@RequestBody org.kfokam48.stagemanagementbackend.chat.message.MessageDTO messageDTO) {
        try {
            Message message = chatService.sendMessages(messageDTO);
            MessageResponseDTO response = chatService.convertToResponseDTO(message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/conversations/{userId}")
    public ResponseEntity<List<ConversationResponseDTO>> getUserConversations(@PathVariable Long userId) {
        try {
            List<ConversationResponseDTO> conversations = chatService.getUserConversations(userId);
            return ResponseEntity.ok(conversations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}