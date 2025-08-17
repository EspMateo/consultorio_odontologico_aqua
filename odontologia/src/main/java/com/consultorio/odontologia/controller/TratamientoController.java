package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.dto.TratamientoDTO;
import com.consultorio.odontologia.entity.Tratamiento;
import com.consultorio.odontologia.service.TratamientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tratamientos")
@CrossOrigin(origins = "*")
public class TratamientoController {

    @Autowired
    private TratamientoService tratamientoService;

    // Crear nuevo tratamiento
    @PostMapping
    public ResponseEntity<?> crearTratamiento(@RequestBody TratamientoDTO tratamientoDTO) {
        try {
            Tratamiento tratamientoCreado = tratamientoService.crearTratamiento(tratamientoDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tratamiento creado exitosamente");
            response.put("tratamiento", tratamientoCreado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Obtener tratamientos de un paciente
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<?> obtenerTratamientosPorPaciente(@PathVariable Long pacienteId) {
        try {
            List<Tratamiento> tratamientos = tratamientoService.obtenerTratamientosPorPaciente(pacienteId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("tratamientos", tratamientos);
            response.put("total", tratamientos.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Obtener tratamiento activo de un paciente
    @GetMapping("/paciente/{pacienteId}/activo")
    public ResponseEntity<?> obtenerTratamientoActivo(@PathVariable Long pacienteId) {
        try {
            var tratamientoActivo = tratamientoService.obtenerTratamientoActivo(pacienteId);
            
            if (tratamientoActivo.isPresent()) {
                return ResponseEntity.ok(tratamientoActivo.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Obtener tratamiento por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerTratamientoPorId(@PathVariable Long id) {
        try {
            Tratamiento tratamiento = tratamientoService.obtenerTratamientoPorId(id);
            return ResponseEntity.ok(tratamiento);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Actualizar tratamiento
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarTratamiento(@PathVariable Long id, @RequestBody TratamientoDTO tratamientoDTO) {
        try {
            Tratamiento tratamientoActualizado = tratamientoService.actualizarTratamiento(id, tratamientoDTO);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tratamiento actualizado exitosamente");
            response.put("tratamiento", tratamientoActualizado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Desactivar tratamiento
    @PutMapping("/{id}/desactivar")
    public ResponseEntity<?> desactivarTratamiento(@PathVariable Long id) {
        try {
            tratamientoService.desactivarTratamiento(id);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tratamiento desactivado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Activar tratamiento
    @PutMapping("/{id}/activar")
    public ResponseEntity<?> activarTratamiento(@PathVariable Long id) {
        try {
            tratamientoService.activarTratamiento(id);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tratamiento activado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Eliminar tratamiento
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarTratamiento(@PathVariable Long id) {
        try {
            tratamientoService.eliminarTratamiento(id);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tratamiento eliminado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Buscar tratamientos por nombre
    @GetMapping("/paciente/{pacienteId}/buscar")
    public ResponseEntity<?> buscarTratamientosPorNombre(
            @PathVariable Long pacienteId,
            @RequestParam String nombre) {
        try {
            List<Tratamiento> tratamientos = tratamientoService.buscarTratamientosPorNombre(pacienteId, nombre);
            
            Map<String, Object> response = new HashMap<>();
            response.put("tratamientos", tratamientos);
            response.put("total", tratamientos.size());
            response.put("nombre", nombre);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Obtener estadísticas de tratamientos
    @GetMapping("/paciente/{pacienteId}/estadisticas")
    public ResponseEntity<?> obtenerEstadisticasTratamientos(@PathVariable Long pacienteId) {
        try {
            Map<String, Object> estadisticas = tratamientoService.obtenerEstadisticasTratamientos(pacienteId);
            return ResponseEntity.ok(estadisticas);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 