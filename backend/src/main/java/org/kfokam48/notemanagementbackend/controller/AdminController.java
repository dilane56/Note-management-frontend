package org.kfokam48.notemanagementbackend.controller;

import jakarta.validation.Valid;
import org.kfokam48.notemanagementbackend.dto.admin.AdminDTO;
import org.kfokam48.notemanagementbackend.dto.admin.AdminResponseDTO;
import org.kfokam48.notemanagementbackend.service.impl.AdminServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admins") // Définition du point d'accès
public class AdminController {

    private final AdminServiceImpl adminService;

    public AdminController(AdminServiceImpl adminService) {
        this.adminService = adminService;
    }


    // 🔍 Récupérer tous les admins
    @GetMapping
    public ResponseEntity<List<AdminResponseDTO>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    // 🔍 Récupérer un admin par ID
    @GetMapping("/{id}")
    public ResponseEntity<AdminResponseDTO> getAdminById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getAdminById(id));
    }

    // ➕ Ajouter un nouvel admin
    @PostMapping
    public ResponseEntity<AdminResponseDTO> createAdmin( @Valid @RequestBody AdminDTO adminDTO) {
        return ResponseEntity.ok(adminService.createAdmin(adminDTO));
    }

    // ✏️ Modifier un admin existant
    @PutMapping("/{id}")
    public ResponseEntity<AdminResponseDTO> updateAdmin(@RequestBody  @Valid AdminDTO adminDTO, @PathVariable Long id) {
        return ResponseEntity.ok(adminService.updateAdmin(adminDTO, id));
    }

    // ❌ Supprimer un admin
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.deleteAdmin(id));
    }
}
