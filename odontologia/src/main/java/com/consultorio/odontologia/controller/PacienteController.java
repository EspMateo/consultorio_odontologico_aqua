package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @PostMapping("/registro-rapido")
    public ResponseEntity<?> registroRapido(@RequestBody Paciente paciente) {
        try {
            Paciente savedPaciente = pacienteService.save(paciente);
            return ResponseEntity.ok(savedPaciente);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al registrar paciente: " + e.getMessage());
        }
    }
} 