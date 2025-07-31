package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.dto.PresupuestoDTO;
import com.consultorio.odontologia.service.PresupuestoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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
            @RequestBody Map<String, Object> request) {
        try {
            Object abonadoObj = request.get("abonado");
            BigDecimal nuevoAbonado;
            
            if (abonadoObj == null) {
                throw new RuntimeException("El campo 'abonado' es requerido");
            }
            
            // Manejar tanto Integer como BigDecimal
            if (abonadoObj instanceof Integer) {
                nuevoAbonado = BigDecimal.valueOf((Integer) abonadoObj);
            } else if (abonadoObj instanceof BigDecimal) {
                nuevoAbonado = (BigDecimal) abonadoObj;
            } else if (abonadoObj instanceof String) {
                nuevoAbonado = new BigDecimal((String) abonadoObj);
            } else {
                throw new RuntimeException("El campo 'abonado' debe ser un número válido");
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

    // Calcular total de ingresos por rango de fechas
    @GetMapping("/ingresos/total")
    public ResponseEntity<?> calcularTotalIngresosPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        try {
            BigDecimal totalIngresos = presupuestoService.calcularTotalIngresosPorFecha(fechaInicio, fechaFin);
            Map<String, Object> response = new HashMap<>();
            response.put("totalIngresos", totalIngresos);
            response.put("fechaInicio", fechaInicio);
            response.put("fechaFin", fechaFin);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Calcular total de ingresos pendientes por rango de fechas
    @GetMapping("/ingresos/pendientes")
    public ResponseEntity<?> calcularTotalIngresosPendientesPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        try {
            BigDecimal totalPendientes = presupuestoService.calcularTotalIngresosPendientesPorFecha(fechaInicio, fechaFin);
            Map<String, Object> response = new HashMap<>();
            response.put("totalPendientes", totalPendientes);
            response.put("fechaInicio", fechaInicio);
            response.put("fechaFin", fechaFin);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Obtener presupuestos por rango de fechas
    @GetMapping("/por-fecha")
    public ResponseEntity<?> obtenerPresupuestosPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        try {
            List<PresupuestoDTO> presupuestos = presupuestoService.obtenerPresupuestosPorFecha(fechaInicio, fechaFin);
            return ResponseEntity.ok(presupuestos);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 