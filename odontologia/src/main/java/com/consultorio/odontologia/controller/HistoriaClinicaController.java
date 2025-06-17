package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.entity.HistoriaClinica;
import com.consultorio.odontologia.service.HistoriaClinicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historia-clinica")
@CrossOrigin(origins = {"http://localhost:5173"}, 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
             allowedHeaders = "*",
             allowCredentials = "true")
public class HistoriaClinicaController {

    @Autowired
    private HistoriaClinicaService historiaClinicaService;

    @GetMapping
    public List<HistoriaClinica> findAll() {
        return historiaClinicaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistoriaClinica> findById(@PathVariable Long id) {
        return historiaClinicaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<HistoriaClinica> findByPacienteId(@PathVariable Long pacienteId) {
        HistoriaClinica historiaClinica = historiaClinicaService.findByPacienteId(pacienteId);
        return historiaClinica != null ? ResponseEntity.ok(historiaClinica) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public HistoriaClinica save(@RequestBody HistoriaClinica historiaClinica) {
        return historiaClinicaService.save(historiaClinica);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HistoriaClinica> update(@PathVariable Long id, @RequestBody HistoriaClinica historiaClinica) {
        return historiaClinicaService.findById(id)
                .map(existingHistoria -> {
                    historiaClinica.setId(id);
                    return ResponseEntity.ok(historiaClinicaService.save(historiaClinica));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return historiaClinicaService.findById(id)
                .map(historiaClinica -> {
                    historiaClinicaService.deleteById(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 