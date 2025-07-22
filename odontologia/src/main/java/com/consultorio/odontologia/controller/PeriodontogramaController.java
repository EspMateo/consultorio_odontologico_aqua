package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.dto.PeriodontogramaDTO;
import com.consultorio.odontologia.service.PeriodontogramaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/periodontograma")
@CrossOrigin(origins = "*")
public class PeriodontogramaController {
    
    @Autowired
    private PeriodontogramaService periodontogramaService;
    
    // Guardar nuevo periodontograma
    @PostMapping
    public ResponseEntity<?> guardarPeriodontograma(@RequestBody PeriodontogramaDTO dto) {
        try {
            PeriodontogramaDTO saved = periodontogramaService.guardarPeriodontograma(dto);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Periodontograma guardado exitosamente");
            response.put("data", saved);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al guardar: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Actualizar periodontograma existente
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarPeriodontograma(@PathVariable Long id, @RequestBody PeriodontogramaDTO dto) {
        try {
            PeriodontogramaDTO updated = periodontogramaService.actualizarPeriodontograma(id, dto);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Periodontograma actualizado exitosamente");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al actualizar: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Obtener periodontograma por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            PeriodontogramaDTO dto = periodontogramaService.obtenerPorId(id);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener periodontograma: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Obtener periodontograma por paciente y fecha
    @GetMapping("/paciente/{pacienteId}/fecha/{fecha}")
    public ResponseEntity<?> obtenerPorPacienteYFecha(
            @PathVariable Long pacienteId, 
            @PathVariable String fecha) {
        try {
            PeriodontogramaDTO dto = periodontogramaService.obtenerPorPacienteYFecha(pacienteId, fecha);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener periodontograma: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Obtener periodontograma más reciente de un paciente
    @GetMapping("/paciente/{pacienteId}/reciente")
    public ResponseEntity<?> obtenerMasReciente(@PathVariable Long pacienteId) {
        try {
            PeriodontogramaDTO dto = periodontogramaService.obtenerMasReciente(pacienteId);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener periodontograma más reciente: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Obtener todas las fechas disponibles para un paciente
    @GetMapping("/paciente/{pacienteId}/fechas")
    public ResponseEntity<?> obtenerFechasDisponibles(@PathVariable Long pacienteId) {
        try {
            List<String> fechas = periodontogramaService.obtenerFechasDisponibles(pacienteId);
            return ResponseEntity.ok(fechas);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener fechas: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Verificar si existe periodontograma para paciente y fecha
    @GetMapping("/paciente/{pacienteId}/existe/{fecha}")
    public ResponseEntity<?> existePeriodontograma(
            @PathVariable Long pacienteId, 
            @PathVariable String fecha) {
        try {
            boolean existe = periodontogramaService.existePeriodontograma(pacienteId, fecha);
            Map<String, Boolean> response = new HashMap<>();
            response.put("existe", existe);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al verificar existencia: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Obtener todos los periodontogramas de un paciente
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<?> obtenerTodasPorPaciente(@PathVariable Long pacienteId) {
        try {
            List<PeriodontogramaDTO> periodontogramas = periodontogramaService.obtenerTodasPorPaciente(pacienteId);
            return ResponseEntity.ok(periodontogramas);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener periodontogramas: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Eliminar periodontograma
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPeriodontograma(@PathVariable Long id) {
        try {
            periodontogramaService.eliminarPeriodontograma(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Periodontograma eliminado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al eliminar: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 