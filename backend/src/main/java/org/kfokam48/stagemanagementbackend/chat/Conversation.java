package org.kfokam48.stagemanagementbackend.chat;

import jakarta.persistence.*;
import lombok.Data;
import org.kfokam48.stagemanagementbackend.model.Utilisateur;

import java.time.Instant;
import java.util.List;

@Data
@Entity
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToMany
    @JoinTable(
            name = "conversation_users",
            joinColumns = @JoinColumn(name = "conversation_id"),
            inverseJoinColumns = @JoinColumn(name = "utilisateur_id")
    )
    private List<Utilisateur> participants;

    private Instant createdAt;



}

