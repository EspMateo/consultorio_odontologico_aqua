package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.dto.PeriodonciaDTO;
import com.consultorio.odontologia.service.PeriodonciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/periodoncia")
@CrossOrigin(origins = "*")
public class PeriodonciaController {
    
    @Autowired
    private PeriodonciaService periodonciaService;
    
    // Guardar nueva periodoncia
    @PostMapping
    public ResponseEntity<?> guardarPeriodoncia(@RequestBody PeriodonciaDTO dto) {
        try {
            PeriodonciaDTO saved = periodonciaService.guardarPeriodoncia(dto);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Datos guardados exitosamente");
            response.put("data", saved);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al guardar: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Actualizar periodoncia existente
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarPeriodoncia(@PathVariable Long id, @RequestBody PeriodonciaDTO dto) {
        try {
            PeriodonciaDTO updated = periodonciaService.actualizarPeriodoncia(id, dto);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Datos modificados exitosamente");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al modificar: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Obtener periodoncia por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            PeriodonciaDTO dto = periodonciaService.obtenerPorId(id);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener periodoncia: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Obtener periodoncia por paciente y fecha
    @GetMapping("/paciente/{pacienteId}/fecha/{fecha}")
    public ResponseEntity<?> obtenerPorPacienteYFecha(
            @PathVariable Long pacienteId, 
            @PathVariable String fecha) {
        try {
            LocalDate fechaLocal = LocalDate.parse(fecha);
            PeriodonciaDTO dto = periodonciaService.obtenerPorPacienteYFecha(pacienteId, fechaLocal);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener periodoncia: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Obtener periodoncia más reciente de un paciente
    @GetMapping("/paciente/{pacienteId}/reciente")
    public ResponseEntity<?> obtenerMasReciente(@PathVariable Long pacienteId) {
        try {
            PeriodonciaDTO dto = periodonciaService.obtenerMasReciente(pacienteId);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener periodoncia más reciente: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Obtener todas las fechas disponibles para un paciente
    @GetMapping("/paciente/{pacienteId}/fechas")
    public ResponseEntity<?> obtenerFechasDisponibles(@PathVariable Long pacienteId) {
        try {
            List<LocalDate> fechas = periodonciaService.obtenerFechasDisponibles(pacienteId);
            return ResponseEntity.ok(fechas);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener fechas: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Verificar si existe periodoncia para paciente y fecha
    @GetMapping("/paciente/{pacienteId}/existe/{fecha}")
    public ResponseEntity<?> existePeriodoncia(
            @PathVariable Long pacienteId, 
            @PathVariable String fecha) {
        try {
            LocalDate fechaLocal = LocalDate.parse(fecha);
            boolean existe = periodonciaService.existePeriodoncia(pacienteId, fechaLocal);
            Map<String, Boolean> response = new HashMap<>();
            response.put("existe", existe);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al verificar existencia: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Obtener todas las periodoncias de un paciente
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<?> obtenerTodasPorPaciente(@PathVariable Long pacienteId) {
        try {
            List<PeriodonciaDTO> periodoncias = periodonciaService.obtenerTodasPorPaciente(pacienteId);
            return ResponseEntity.ok(periodoncias);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener periodoncias: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 