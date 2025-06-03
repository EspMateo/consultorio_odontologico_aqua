package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.dto.PacienteDTO;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @PostMapping("/registro")
    public ResponseEntity<Paciente> registrarPaciente(@RequestBody PacienteDTO pacienteDTO) {
        Paciente pacienteRegistrado = pacienteService.registrarPaciente(pacienteDTO);
        return ResponseEntity.ok(pacienteRegistrado);
    }

    @GetMapping
    public ResponseEntity<List<Paciente>> getAllPacientes() {
        List<Paciente> pacientes = pacienteService.getAllPacientes();
        return ResponseEntity.ok(pacientes);
    }
} 