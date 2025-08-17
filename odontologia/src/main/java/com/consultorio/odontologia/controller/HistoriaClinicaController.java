package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.entity.HistoriaClinica;
import com.consultorio.odontologia.service.HistoriaClinicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import com.consultorio.odontologia.dto.HistoriaClinicaDTO;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/historia-clinica")
@CrossOrigin(origins = "*")
public class HistoriaClinicaController {

    @Autowired
    private HistoriaClinicaService historiaClinicaService;

    // Obtener todas las historias clínicas
    @GetMapping
    public ResponseEntity<List<HistoriaClinicaDTO>> obtenerTodas() {
        try {
            List<HistoriaClinica> historias = historiaClinicaService.obtenerTodas();
            List<HistoriaClinicaDTO> dtos = historias.stream()
                .map(HistoriaClinicaDTO::new)
                .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Obtener historia clínica por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            return historiaClinicaService.obtenerPorId(id)
                    .map(historia -> ResponseEntity.ok(new HistoriaClinicaDTO(historia)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener historia clínica: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Obtener todas las historias clínicas de un paciente
    @GetMapping("/paciente/{pacienteId}/todas")
    public ResponseEntity<?> obtenerPorPaciente(@PathVariable Long pacienteId) {
        try {
            List<HistoriaClinica> historias = historiaClinicaService.obtenerPorPaciente(pacienteId);
            List<HistoriaClinicaDTO> dtos = historias.stream()
                .map(HistoriaClinicaDTO::new)
                .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener historias clínicas: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Obtener la historia clínica más reciente de un paciente
    @GetMapping("/paciente/{pacienteId}/reciente")
    public ResponseEntity<?> obtenerMasReciente(@PathVariable Long pacienteId) {
        try {
            return historiaClinicaService.obtenerMasReciente(pacienteId)
                    .map(historia -> ResponseEntity.ok(new HistoriaClinicaDTO(historia)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener historia clínica más reciente: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Obtener historia clínica por paciente y fecha
    @GetMapping("/paciente/{pacienteId}/fecha/{fecha}")
    public ResponseEntity<?> obtenerPorPacienteYFecha(@PathVariable Long pacienteId, @PathVariable String fecha) {
        try {
            LocalDate localDate = LocalDate.parse(fecha);
            Optional<HistoriaClinica> historia = historiaClinicaService.obtenerPorPacienteYFecha(pacienteId, localDate);
            
            if (historia.isPresent()) {
                HistoriaClinica data = historia.get();
                HistoriaClinicaDTO dto = new HistoriaClinicaDTO(data);
                
                return ResponseEntity.ok(dto);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener historia clínica por fecha: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Obtener la historia clínica más reciente por paciente y fecha
    @GetMapping("/paciente/{pacienteId}/fecha/{fecha}/reciente")
    public ResponseEntity<?> obtenerMasRecientePorPacienteYFecha(@PathVariable Long pacienteId, @PathVariable String fecha) {
        try {
            LocalDate localDate = LocalDate.parse(fecha);
            Optional<HistoriaClinica> historia = historiaClinicaService.obtenerMasRecientePorPacienteYFecha(pacienteId, localDate);
            
            if (historia.isPresent()) {
                HistoriaClinica data = historia.get();
                HistoriaClinicaDTO dto = new HistoriaClinicaDTO(data);
                
                return ResponseEntity.ok(dto);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener historia clínica más reciente por fecha: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Obtener fechas disponibles para un paciente
    @GetMapping("/paciente/{pacienteId}/fechas")
    public ResponseEntity<?> obtenerFechasDisponibles(@PathVariable Long pacienteId) {
        try {
            List<String> fechas = historiaClinicaService.obtenerFechasDisponibles(pacienteId);
            return ResponseEntity.ok(fechas);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener fechas: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Verificar si existe historia clínica para paciente y fecha
    @GetMapping("/paciente/{pacienteId}/existe/{fecha}")
    public ResponseEntity<?> existeHistoriaClinica(@PathVariable Long pacienteId, @PathVariable String fecha) {
        try {
            LocalDate localDate = LocalDate.parse(fecha);
            boolean existe = historiaClinicaService.existeHistoriaClinica(pacienteId, localDate);
            Map<String, Boolean> response = new HashMap<>();
            response.put("existe", existe);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al verificar existencia: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Contar historias clínicas por paciente
    @GetMapping("/paciente/{pacienteId}/contar")
    public ResponseEntity<?> contarPorPaciente(@PathVariable Long pacienteId) {
        try {
            long cantidad = historiaClinicaService.contarPorPaciente(pacienteId);
            Map<String, Long> response = new HashMap<>();
            response.put("cantidad", cantidad);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al contar historias clínicas: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Crear nueva historia clínica
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody HistoriaClinica historiaClinica) {
        try {
            HistoriaClinica nueva = historiaClinicaService.guardar(historiaClinica);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Historia clínica creada exitosamente");
            response.put("historiaClinica", nueva);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al crear historia clínica: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Actualizar historia clínica existente
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody HistoriaClinica historiaClinica) {
        try {
            HistoriaClinica actualizada = historiaClinicaService.actualizar(id, historiaClinica);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Historia clínica actualizada exitosamente");
            response.put("historiaClinica", actualizada);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al actualizar historia clínica: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Crear o actualizar historia clínica
    @PostMapping("/crear-o-actualizar")
    public ResponseEntity<?> crearOActualizar(@RequestBody HistoriaClinica historiaClinica) {
        try {
            HistoriaClinica resultado = historiaClinicaService.crearOActualizar(historiaClinica);
            Map<String, Object> response = new HashMap<>();
            response.put("message", historiaClinica.getId() != null ? 
                "Historia clínica actualizada exitosamente" : "Historia clínica creada exitosamente");
            response.put("historiaClinica", resultado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al procesar historia clínica: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Eliminar historia clínica
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            historiaClinicaService.eliminar(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Historia clínica eliminada exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al eliminar historia clínica: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 