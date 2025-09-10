package org.kfokam48.notemanagementbackend.repository;

import org.kfokam48.notemanagementbackend.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    boolean existsByEmail(String email);


}
