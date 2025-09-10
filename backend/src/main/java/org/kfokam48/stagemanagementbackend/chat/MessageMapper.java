package org.kfokam48.stagemanagementbackend.chat;


import org.kfokam48.stagemanagementbackend.chat.message.MessageDTO;
import org.kfokam48.stagemanagementbackend.chat.message.MessageResponseDTO;
import org.kfokam48.stagemanagementbackend.repository.UtilisateurRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MessageMapper {
    private final UtilisateurRepository utilisateurRepository;

    public MessageMapper(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    public MessageResponseDTO messageToMessageResponseDTO (Message message){
        MessageResponseDTO messageResponseDTO = new MessageResponseDTO();
        messageResponseDTO.setExpediteurId(message.getExpediteur().getId());
        messageResponseDTO.setExpediteurFullName(message.getExpediteur().getFullName());
        messageResponseDTO.setDestinataireId(message.getDestinataire().getId());
        messageResponseDTO.setDestinataireFullName(message.getDestinataire().getFullName());
        messageResponseDTO.setStatus(message.getMessageStatus());
        messageResponseDTO.setId(message.getId());
        messageResponseDTO.setLu(message.getLu());
        messageResponseDTO.setContent(message.getContenu());
        messageResponseDTO.setDateEnvoi(message.getDateEnvoi());
        return messageResponseDTO;
    }

   public Message messageDToToMessage(MessageDTO messageDTO){
        Message message = new Message();
        message.setExpediteur(utilisateurRepository.findById(messageDTO.getExpediteurId()).orElseThrow(() -> new RuntimeException("Sender not found")));
        message.setDestinataire(utilisateurRepository.findById(messageDTO.getDestinataireId()).orElseThrow(() -> new RuntimeException("Receiver not found")));
        message.setContenu(messageDTO.getContenu());
        return message;
   }

   public List<MessageResponseDTO> messageListToMessageResponseDTOList(List<Message> messages) {
        return messages.stream()
                .map(this::messageToMessageResponseDTO)
                .toList();
    }

    public List<Message> messageDTOListToMessageList(List<MessageDTO> messageDTOs) {
        return messageDTOs.stream()
                .map(this::messageDToToMessage)
                .toList();
    }
}
