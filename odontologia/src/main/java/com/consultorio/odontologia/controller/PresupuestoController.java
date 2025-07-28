package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.dto.PresupuestoDTO;
import com.consultorio.odontologia.service.PresupuestoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/presupuesto")
@CrossOrigin(origins = "*")
public class PresupuestoController {

    @Autowired
    private PresupuestoService presupuestoService;

    // Crear nuevo presupuesto
    @PostMapping
    public ResponseEntity<?> crearPresupuesto(@RequestBody PresupuestoDTO presupuestoDTO) {
        try {
            PresupuestoDTO presupuestoCreado = presupuestoService.crearPresupuesto(presupuestoDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Presupuesto creado exitosamente");
            response.put("presupuesto", presupuestoCreado);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Actualizar presupuesto existente
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarPresupuesto(@PathVariable Long id, @RequestBody PresupuestoDTO presupuestoDTO) {
        try {
            PresupuestoDTO presupuestoActualizado = presupuestoService.actualizarPresupuesto(id, presupuestoDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Presupuesto actualizado exitosamente");
            response.put("presupuesto", presupuestoActualizado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Obtener presupuesto por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPresupuestoPorId(@PathVariable Long id) {
        try {
            PresupuestoDTO presupuesto = presupuestoService.obtenerPresupuestoPorId(id);
            return ResponseEntity.ok(presupuesto);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Obtener presupuesto por paciente y fecha (mantener para compatibilidad)
    @GetMapping("/paciente/{pacienteId}/fecha/{fecha}")
    public ResponseEntity<?> obtenerPresupuestoPorPacienteYFecha(
            @PathVariable Long pacienteId, 
            @PathVariable String fecha) {
        try {
            LocalDate fechaLocal = LocalDate.parse(fecha);
            PresupuestoDTO presupuesto = presupuestoService.obtenerPresupuestoPorPacienteYFecha(pacienteId, fechaLocal);
            return ResponseEntity.ok(presupuesto);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    // Obtener todos los presupuestos de un paciente
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<?> obtenerPresupuestosPorPaciente(@PathVariable Long pacienteId) {
        try {
            List<PresupuestoDTO> presupuestos = presupuestoService.obtenerPresupuestosPorPaciente(pacienteId);
            return ResponseEntity.ok(presupuestos);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Obtener fechas disponibles para un paciente
    @GetMapping("/paciente/{pacienteId}/fechas")
    public ResponseEntity<?> obtenerFechasDisponiblesPorPaciente(@PathVariable Long pacienteId) {
        try {
            List<LocalDate> fechas = presupuestoService.obtenerFechasDisponiblesPorPaciente(pacienteId);
            return ResponseEntity.ok(fechas);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Actualizar pago de un tratamiento específico
    @PutMapping("/{presupuestoId}/tratamiento/{tratamientoId}/pago")
    public ResponseEntity<?> actualizarPagoTratamiento(
            @PathVariable Long presupuestoId,
            @PathVariable Long tratamientoId,
            @RequestBody Map<String, Integer> request) {
        try {
            Integer nuevoAbonado = request.get("abonado");
            if (nuevoAbonado == null) {
                throw new RuntimeException("El campo 'abonado' es requerido");
            }
            
            PresupuestoDTO presupuestoActualizado = presupuestoService.actualizarPagoTratamiento(presupuestoId, tratamientoId, nuevoAbonado);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Pago actualizado exitosamente");
            response.put("presupuesto", presupuestoActualizado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Eliminar presupuesto
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPresupuesto(@PathVariable Long id) {
        try {
            presupuestoService.eliminarPresupuesto(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Presupuesto eliminado exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 