package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.dto.DiagnosticoDTO;
import com.consultorio.odontologia.entity.Diagnostico;
import com.consultorio.odontologia.service.DiagnosticoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/diagnostico")
@CrossOrigin(origins = "*")
public class DiagnosticoController {
    
    private static final Logger logger = LoggerFactory.getLogger(DiagnosticoController.class);
    
    @Autowired
    private DiagnosticoService diagnosticoService;
    
    /**
     * Crea un nuevo diagnóstico
     */
    @PostMapping
    public ResponseEntity<?> crearDiagnostico(@RequestBody DiagnosticoDTO diagnosticoDTO) {
        logger.info("Recibida solicitud para crear diagnóstico: {}", diagnosticoDTO);
        
        try {
            Diagnostico diagnosticoCreado = diagnosticoService.crearDiagnostico(diagnosticoDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Diagnóstico creado exitosamente");
            response.put("diagnostico", diagnosticoCreado);
            
            logger.info("Diagnóstico creado exitosamente con ID: {}", diagnosticoCreado.getId());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al crear diagnóstico: {}", e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al crear diagnóstico: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Obtiene el diagnóstico más reciente de un paciente
     */
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<?> obtenerDiagnosticoPorPaciente(@PathVariable Long pacienteId) {
        logger.info("Recibida solicitud para obtener diagnóstico del paciente ID: {}", pacienteId);
        
        try {
            Optional<Diagnostico> diagnostico = diagnosticoService.obtenerDiagnosticoReciente(pacienteId);
            
            if (diagnostico.isPresent()) {
                logger.info("Diagnóstico encontrado con ID: {}", diagnostico.get().getId());
                return ResponseEntity.ok(diagnostico.get());
            } else {
                logger.info("No se encontró diagnóstico para paciente ID: {}", pacienteId);
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            logger.error("Error al obtener diagnóstico del paciente ID {}: {}", pacienteId, e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al obtener diagnóstico: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Obtiene todos los diagnósticos de un paciente
     */
    @GetMapping("/paciente/{pacienteId}/todos")
    public ResponseEntity<?> obtenerTodosLosDiagnosticosPorPaciente(@PathVariable Long pacienteId) {
        logger.info("Recibida solicitud para obtener todos los diagnósticos del paciente ID: {}", pacienteId);
        
        try {
            List<Diagnostico> diagnosticos = diagnosticoService.obtenerDiagnosticosPorPaciente(pacienteId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("diagnosticos", diagnosticos);
            response.put("total", diagnosticos.size());
            
            logger.info("Encontrados {} diagnósticos para paciente ID: {}", diagnosticos.size(), pacienteId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al obtener diagnósticos del paciente ID {}: {}", pacienteId, e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al obtener diagnósticos: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Obtiene un diagnóstico por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerDiagnosticoPorId(@PathVariable Long id) {
        logger.info("Recibida solicitud para obtener diagnóstico con ID: {}", id);
        
        try {
            Diagnostico diagnostico = diagnosticoService.obtenerDiagnosticoPorId(id);
            
            logger.info("Diagnóstico encontrado con ID: {}", diagnostico.getId());
            return ResponseEntity.ok(diagnostico);
            
        } catch (Exception e) {
            logger.error("Error al obtener diagnóstico con ID {}: {}", id, e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al obtener diagnóstico: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Actualiza un diagnóstico existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarDiagnostico(@PathVariable Long id, @RequestBody DiagnosticoDTO diagnosticoDTO) {
        logger.info("Recibida solicitud para actualizar diagnóstico con ID: {}", id);
        
        try {
            Diagnostico diagnosticoActualizado = diagnosticoService.actualizarDiagnostico(id, diagnosticoDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Diagnóstico actualizado exitosamente");
            response.put("diagnostico", diagnosticoActualizado);
            
            logger.info("Diagnóstico actualizado exitosamente con ID: {}", diagnosticoActualizado.getId());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al actualizar diagnóstico con ID {}: {}", id, e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al actualizar diagnóstico: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Elimina un diagnóstico
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarDiagnostico(@PathVariable Long id) {
        logger.info("Recibida solicitud para eliminar diagnóstico con ID: {}", id);
        
        try {
            diagnosticoService.eliminarDiagnostico(id);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Diagnóstico eliminado exitosamente");
            
            logger.info("Diagnóstico eliminado exitosamente con ID: {}", id);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al eliminar diagnóstico con ID {}: {}", id, e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al eliminar diagnóstico: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Busca diagnósticos por contenido del diagnóstico
     */
    @GetMapping("/paciente/{pacienteId}/buscar-diagnostico")
    public ResponseEntity<?> buscarPorContenidoDiagnostico(
            @PathVariable Long pacienteId,
            @RequestParam String contenido) {
        logger.info("Recibida solicitud para buscar diagnósticos por contenido '{}' para paciente ID: {}", contenido, pacienteId);
        
        try {
            List<Diagnostico> diagnosticos = diagnosticoService.buscarPorContenidoDiagnostico(pacienteId, contenido);
            
            Map<String, Object> response = new HashMap<>();
            response.put("diagnosticos", diagnosticos);
            response.put("total", diagnosticos.size());
            response.put("contenido", contenido);
            
            logger.info("Encontrados {} diagnósticos que coinciden con la búsqueda", diagnosticos.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al buscar diagnósticos por contenido: {}", e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al buscar diagnósticos: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Busca diagnósticos por contenido del pronóstico
     */
    @GetMapping("/paciente/{pacienteId}/buscar-pronostico")
    public ResponseEntity<?> buscarPorContenidoPronostico(
            @PathVariable Long pacienteId,
            @RequestParam String contenido) {
        logger.info("Recibida solicitud para buscar diagnósticos por contenido de pronóstico '{}' para paciente ID: {}", contenido, pacienteId);
        
        try {
            List<Diagnostico> diagnosticos = diagnosticoService.buscarPorContenidoPronostico(pacienteId, contenido);
            
            Map<String, Object> response = new HashMap<>();
            response.put("diagnosticos", diagnosticos);
            response.put("total", diagnosticos.size());
            response.put("contenido", contenido);
            
            logger.info("Encontrados {} diagnósticos que coinciden con la búsqueda", diagnosticos.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al buscar diagnósticos por contenido de pronóstico: {}", e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al buscar diagnósticos: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Obtiene estadísticas de diagnósticos de un paciente
     */
    @GetMapping("/paciente/{pacienteId}/estadisticas")
    public ResponseEntity<?> obtenerEstadisticasDiagnosticos(@PathVariable Long pacienteId) {
        logger.info("Recibida solicitud para obtener estadísticas de diagnósticos del paciente ID: {}", pacienteId);
        
        try {
            long totalDiagnosticos = diagnosticoService.contarDiagnosticosPorPaciente(pacienteId);
            List<Diagnostico> diagnosticos = diagnosticoService.obtenerDiagnosticosPorPaciente(pacienteId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalDiagnosticos", totalDiagnosticos);
            response.put("diagnosticos", diagnosticos);
            
            logger.info("Estadísticas obtenidas: {} diagnósticos totales", totalDiagnosticos);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al obtener estadísticas de diagnósticos: {}", e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al obtener estadísticas: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
} 