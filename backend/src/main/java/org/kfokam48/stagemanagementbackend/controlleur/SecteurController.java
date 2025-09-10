package org.kfokam48.stagemanagementbackend.controlleur;

import jakarta.validation.Valid;
import org.kfokam48.stagemanagementbackend.dto.secteur.SecteurRequestDTO;
import org.kfokam48.stagemanagementbackend.model.Secteur;
import org.kfokam48.stagemanagementbackend.service.SecteurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/secteurs")
public class  SecteurController {
    private final SecteurService secteurService;

    public SecteurController(SecteurService secteurService) {
        this.secteurService = secteurService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Secteur> getSecteurById(@PathVariable Long id) {
        return ResponseEntity.ok(secteurService.getSecteurById(id));
    }
    @GetMapping
    public ResponseEntity<List<Secteur>> getAllSecteurs() {
        return ResponseEntity.ok(secteurService.getAllSecteurs());
    }
    @PostMapping
    public ResponseEntity<Secteur> createSecteur(@RequestBody @Valid SecteurRequestDTO secteurRequestDTO) {
        return ResponseEntity.ok(secteurService.saveSecteur(secteurRequestDTO));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Secteur> updateSecteur(@PathVariable Long id, @RequestBody @Valid SecteurRequestDTO secteurRequestDTO) {
        return ResponseEntity.ok(secteurService.updateSecteur(id, secteurRequestDTO));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSecteur(@PathVariable Long id) {
        return ResponseEntity.ok(secteurService.deleteSecteur(id));
    }
}
