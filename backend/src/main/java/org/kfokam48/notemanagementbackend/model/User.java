package org.kfokam48.notemanagementbackend.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.kfokam48.notemanagementbackend.enums.Roles;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "user_type")
@Table(name = "users")
public abstract class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   private String firstName;
   private String lastName;
   private String password;
    @Column(unique = true, nullable = false)
   private String email;

    @Enumerated(EnumType.STRING)
    private Roles role; // Définition des rôles (Student, Teacher, Admin)


}