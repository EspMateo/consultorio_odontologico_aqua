package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.dto.DiagnosticoDTO;
import com.consultorio.odontologia.entity.Diagnostico;
import com.consultorio.odontologia.service.DiagnosticoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/diagnosticos")
@CrossOrigin(origins = "*")
public class DiagnosticoController {

    @Autowired
    private DiagnosticoService diagnosticoService;

    // Crear nuevo diagnóstico
    @PostMapping
    public ResponseEntity<?> crearDiagnostico(@RequestBody DiagnosticoDTO diagnosticoDTO) {
        try {
            Diagnostico diagnosticoCreado = diagnosticoService.crearDiagnostico(diagnosticoDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Diagnóstico creado exitosamente");
            response.put("diagnostico", diagnosticoCreado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Obtener diagnóstico más reciente de un paciente
    @GetMapping("/paciente/{pacienteId}/reciente")
    public ResponseEntity<?> obtenerDiagnosticoReciente(@PathVariable Long pacienteId) {
        try {
            var diagnostico = diagnosticoService.obtenerDiagnosticoMasReciente(pacienteId);
            
            if (diagnostico.isPresent()) {
                return ResponseEntity.ok(diagnostico.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Obtener todos los diagnósticos de un paciente
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<?> obtenerDiagnosticosPorPaciente(@PathVariable Long pacienteId) {
        try {
            List<Diagnostico> diagnosticos = diagnosticoService.obtenerDiagnosticosPorPaciente(pacienteId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("diagnosticos", diagnosticos);
            response.put("total", diagnosticos.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Obtener diagnóstico por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerDiagnosticoPorId(@PathVariable Long id) {
        try {
            Diagnostico diagnostico = diagnosticoService.obtenerDiagnosticoPorId(id);
            return ResponseEntity.ok(diagnostico);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Actualizar diagnóstico
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarDiagnostico(@PathVariable Long id, @RequestBody DiagnosticoDTO diagnosticoDTO) {
        try {
            Diagnostico diagnosticoActualizado = diagnosticoService.actualizarDiagnostico(id, diagnosticoDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Diagnóstico actualizado exitosamente");
            response.put("diagnostico", diagnosticoActualizado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Eliminar diagnóstico
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarDiagnostico(@PathVariable Long id) {
        try {
            diagnosticoService.eliminarDiagnostico(id);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Diagnóstico eliminado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Buscar diagnósticos por contenido
    @GetMapping("/paciente/{pacienteId}/buscar-diagnostico")
    public ResponseEntity<?> buscarPorContenidoDiagnostico(
            @PathVariable Long pacienteId,
            @RequestParam String contenido) {
        try {
            List<Diagnostico> diagnosticos = diagnosticoService.buscarDiagnosticosPorContenido(pacienteId, contenido);
            
            Map<String, Object> response = new HashMap<>();
            response.put("diagnosticos", diagnosticos);
            response.put("total", diagnosticos.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Buscar diagnósticos por contenido de pronóstico
    @GetMapping("/paciente/{pacienteId}/buscar-pronostico")
    public ResponseEntity<?> buscarPorContenidoPronostico(
            @PathVariable Long pacienteId,
            @RequestParam String contenido) {
        try {
            List<Diagnostico> diagnosticos = diagnosticoService.buscarDiagnosticosPorPronostico(pacienteId, contenido);
            
            Map<String, Object> response = new HashMap<>();
            response.put("diagnosticos", diagnosticos);
            response.put("total", diagnosticos.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Obtener estadísticas de diagnósticos
    @GetMapping("/paciente/{pacienteId}/estadisticas")
    public ResponseEntity<?> obtenerEstadisticas(@PathVariable Long pacienteId) {
        try {
            long totalDiagnosticos = diagnosticoService.contarDiagnosticosPorPaciente(pacienteId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalDiagnosticos", totalDiagnosticos);
            response.put("pacienteId", pacienteId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 