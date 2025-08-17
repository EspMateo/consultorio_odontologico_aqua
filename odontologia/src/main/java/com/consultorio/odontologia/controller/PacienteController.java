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
@CrossOrigin(origins = "*")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @PostMapping
    public ResponseEntity<Paciente> registrarPaciente(@RequestBody PacienteDTO pacienteDTO) {
        try {
            Paciente paciente = pacienteService.registrarPaciente(pacienteDTO);
            return ResponseEntity.ok(paciente);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Paciente>> obtenerTodosLosPacientes() {
        try {
            List<Paciente> pacientes = pacienteService.obtenerTodosLosPacientes();
            return ResponseEntity.ok(pacientes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> obtenerPacientePorId(@PathVariable Long id) {
        try {
            Paciente paciente = pacienteService.obtenerPacientePorId(id);
            return ResponseEntity.ok(paciente);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Paciente>> buscarPacientes(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String apellido,
            @RequestParam(required = false) String cedula) {
        try {
            List<Paciente> pacientes = pacienteService.buscarPacientes(nombre, apellido, cedula);
            return ResponseEntity.ok(pacientes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarPaciente(@PathVariable Long id) {
        try {
            pacienteService.eliminarPaciente(id);
            return ResponseEntity.ok("Paciente eliminado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> actualizarPaciente(@PathVariable Long id, @RequestBody PacienteDTO pacienteDTO) {
        try {
            Paciente paciente = pacienteService.actualizarPaciente(id, pacienteDTO);
            return ResponseEntity.ok(paciente);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}