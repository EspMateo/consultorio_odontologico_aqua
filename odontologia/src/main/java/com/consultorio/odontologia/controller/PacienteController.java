package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.dto.PacienteDTO;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "http://localhost:5173", 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
             allowedHeaders = "*",
             allowCredentials = "true")
public class PacienteController {
    private static final Logger logger = LoggerFactory.getLogger(PacienteController.class);

    @Autowired
    private PacienteService pacienteService;

    @PostMapping("/registro")
    public ResponseEntity<Paciente> registrarPaciente(@RequestBody PacienteDTO pacienteDTO) {
        logger.info("Recibida solicitud para registrar paciente: {}", pacienteDTO);
        Paciente pacienteRegistrado = pacienteService.registrarPaciente(pacienteDTO);
        return ResponseEntity.ok(pacienteRegistrado);
    }

    @GetMapping
    public ResponseEntity<List<Paciente>> obtenerTodosLosPacientes() {
        logger.info("Recibida solicitud para obtener todos los pacientes");
        List<Paciente> pacientes = pacienteService.obtenerTodosLosPacientes();
        return ResponseEntity.ok(pacientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> obtenerPacientePorId(@PathVariable Long id) {
        logger.info("Recibida solicitud para obtener paciente con ID: {}", id);
        Paciente paciente = pacienteService.obtenerPacientePorId(id);
        return ResponseEntity.ok(paciente);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Paciente>> buscarPacientes(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) String apellido,
            @RequestParam(required = false) String cedula) {
        List<Paciente> pacientes = pacienteService.buscarPacientes(nombre, apellido, cedula);
        return ResponseEntity.ok(pacientes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPaciente(@PathVariable Long id) {
        logger.info("Recibida solicitud para eliminar paciente con ID: {}", id);
        try {
            pacienteService.eliminarPaciente(id);
            logger.info("Paciente eliminado exitosamente con ID: {}", id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error al eliminar paciente con ID: {} - Error: {}", id, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> actualizarPaciente(
            @PathVariable Long id,
            @RequestBody PacienteDTO pacienteDTO) {
        logger.info("Recibida solicitud para actualizar paciente con ID: {}", id);
        Paciente pacienteActualizado = pacienteService.actualizarPaciente(id, pacienteDTO);
        return ResponseEntity.ok(pacienteActualizado);
    }
}