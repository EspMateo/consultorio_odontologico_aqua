package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.dto.TratamientoDTO;
import com.consultorio.odontologia.entity.Tratamiento;
import com.consultorio.odontologia.service.TratamientoService;
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
@RequestMapping("/api/tratamientos")
@CrossOrigin(origins = "*")
public class TratamientoController {
    
    private static final Logger logger = LoggerFactory.getLogger(TratamientoController.class);
    
    @Autowired
    private TratamientoService tratamientoService;
    
    /**
     * Crea un nuevo tratamiento
     */
    @PostMapping
    public ResponseEntity<?> crearTratamiento(@RequestBody TratamientoDTO tratamientoDTO) {
        logger.info("Recibida solicitud para crear tratamiento: {}", tratamientoDTO);
        
        try {
            Tratamiento tratamientoCreado = tratamientoService.crearTratamiento(tratamientoDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tratamiento creado exitosamente");
            response.put("tratamiento", tratamientoCreado);
            
            logger.info("Tratamiento creado exitosamente con ID: {}", tratamientoCreado.getId());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al crear tratamiento: {}", e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al crear tratamiento: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Obtiene todos los tratamientos de un paciente
     */
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<?> obtenerTratamientosPorPaciente(@PathVariable Long pacienteId) {
        logger.info("Recibida solicitud para obtener tratamientos del paciente ID: {}", pacienteId);
        
        try {
            List<Tratamiento> tratamientos = tratamientoService.obtenerTratamientosPorPaciente(pacienteId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("tratamientos", tratamientos);
            response.put("total", tratamientos.size());
            
            logger.info("Encontrados {} tratamientos para paciente ID: {}", tratamientos.size(), pacienteId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al obtener tratamientos del paciente ID {}: {}", pacienteId, e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al obtener tratamientos: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Obtiene el tratamiento activo de un paciente
     */
    @GetMapping("/paciente/{pacienteId}/activo")
    public ResponseEntity<?> obtenerTratamientoActivo(@PathVariable Long pacienteId) {
        logger.info("Recibida solicitud para obtener tratamiento activo del paciente ID: {}", pacienteId);
        
        try {
            Optional<Tratamiento> tratamientoActivo = tratamientoService.obtenerTratamientoActivo(pacienteId);
            
            Map<String, Object> response = new HashMap<>();
            if (tratamientoActivo.isPresent()) {
                response.put("tratamiento", tratamientoActivo.get());
                response.put("existe", true);
            } else {
                response.put("existe", false);
                response.put("mensaje", "No hay tratamiento activo para este paciente");
            }
            
            logger.info("Tratamiento activo encontrado: {}", tratamientoActivo.isPresent());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al obtener tratamiento activo del paciente ID {}: {}", pacienteId, e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al obtener tratamiento activo: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Obtiene un tratamiento por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerTratamientoPorId(@PathVariable Long id) {
        logger.info("Recibida solicitud para obtener tratamiento con ID: {}", id);
        
        try {
            Tratamiento tratamiento = tratamientoService.obtenerTratamientoPorId(id);
            return ResponseEntity.ok(tratamiento);
            
        } catch (Exception e) {
            logger.error("Error al obtener tratamiento con ID {}: {}", id, e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al obtener tratamiento: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Actualiza un tratamiento existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarTratamiento(@PathVariable Long id, @RequestBody TratamientoDTO tratamientoDTO) {
        logger.info("Recibida solicitud para actualizar tratamiento con ID: {}", id);
        
        try {
            Tratamiento tratamientoActualizado = tratamientoService.actualizarTratamiento(id, tratamientoDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tratamiento actualizado exitosamente");
            response.put("tratamiento", tratamientoActualizado);
            
            logger.info("Tratamiento actualizado exitosamente con ID: {}", id);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al actualizar tratamiento con ID {}: {}", id, e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al actualizar tratamiento: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Desactiva un tratamiento
     */
    @PutMapping("/{id}/desactivar")
    public ResponseEntity<?> desactivarTratamiento(@PathVariable Long id) {
        logger.info("Recibida solicitud para desactivar tratamiento con ID: {}", id);
        
        try {
            Tratamiento tratamientoDesactivado = tratamientoService.desactivarTratamiento(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tratamiento desactivado exitosamente");
            response.put("tratamiento", tratamientoDesactivado);
            
            logger.info("Tratamiento desactivado exitosamente con ID: {}", id);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al desactivar tratamiento con ID {}: {}", id, e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al desactivar tratamiento: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Activa un tratamiento
     */
    @PutMapping("/{id}/activar")
    public ResponseEntity<?> activarTratamiento(@PathVariable Long id) {
        logger.info("Recibida solicitud para activar tratamiento con ID: {}", id);
        
        try {
            Tratamiento tratamientoActivado = tratamientoService.activarTratamiento(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tratamiento activado exitosamente");
            response.put("tratamiento", tratamientoActivado);
            
            logger.info("Tratamiento activado exitosamente con ID: {}", id);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al activar tratamiento con ID {}: {}", id, e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al activar tratamiento: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Elimina un tratamiento
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarTratamiento(@PathVariable Long id) {
        logger.info("Recibida solicitud para eliminar tratamiento con ID: {}", id);
        
        try {
            tratamientoService.eliminarTratamiento(id);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tratamiento eliminado exitosamente");
            
            logger.info("Tratamiento eliminado exitosamente con ID: {}", id);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al eliminar tratamiento con ID {}: {}", id, e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al eliminar tratamiento: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Busca tratamientos por nombre
     */
    @GetMapping("/paciente/{pacienteId}/buscar")
    public ResponseEntity<?> buscarTratamientosPorNombre(
            @PathVariable Long pacienteId,
            @RequestParam String nombre) {
        logger.info("Recibida solicitud para buscar tratamientos del paciente ID: {} con nombre: {}", pacienteId, nombre);
        
        try {
            List<Tratamiento> tratamientos = tratamientoService.buscarTratamientosPorNombre(pacienteId, nombre);
            
            Map<String, Object> response = new HashMap<>();
            response.put("tratamientos", tratamientos);
            response.put("total", tratamientos.size());
            response.put("busqueda", nombre);
            
            logger.info("Encontrados {} tratamientos para la búsqueda '{}'", tratamientos.size(), nombre);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al buscar tratamientos del paciente ID {}: {}", pacienteId, e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al buscar tratamientos: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Obtiene estadísticas de tratamientos de un paciente
     */
    @GetMapping("/paciente/{pacienteId}/estadisticas")
    public ResponseEntity<?> obtenerEstadisticasTratamientos(@PathVariable Long pacienteId) {
        logger.info("Recibida solicitud para obtener estadísticas de tratamientos del paciente ID: {}", pacienteId);
        
        try {
            TratamientoService.TratamientoStats stats = tratamientoService.obtenerEstadisticasTratamientos(pacienteId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("totalTratamientos", stats.getTotalTratamientos());
            response.put("tratamientosActivos", stats.getTratamientosActivos());
            response.put("tratamientosInactivos", stats.getTratamientosInactivos());
            
            logger.info("Estadísticas obtenidas para paciente ID: {}", pacienteId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error al obtener estadísticas del paciente ID {}: {}", pacienteId, e.getMessage());
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error al obtener estadísticas: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
} 