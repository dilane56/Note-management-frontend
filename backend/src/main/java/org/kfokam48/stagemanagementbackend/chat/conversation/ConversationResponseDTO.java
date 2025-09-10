package org.kfokam48.stagemanagementbackend.chat.conversation;

import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class ConversationResponseDTO {
    private Long conversationId;
    private List<ParticipantDTO> participants;
    private Instant createdAt;
    private int unreadCount;
    private String lastMessage;
    private Instant lastMessageTime;

    @Data
    public static class ParticipantDTO {
        private Long id;
        private String email;
        private String fullName;
    }
}