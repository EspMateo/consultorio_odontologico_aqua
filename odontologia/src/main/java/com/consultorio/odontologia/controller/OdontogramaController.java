package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.entity.Odontograma;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.repository.PacienteRepository;
import com.consultorio.odontologia.service.OdontogramaService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/odontogramas")
public class OdontogramaController {
    
    @Autowired
    private OdontogramaService odontogramaService;
    
    @Autowired
    private PacienteRepository pacienteRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    /**
     * Guardar un nuevo odontograma
     */
    @PostMapping
    public ResponseEntity<?> guardarOdontograma(@RequestBody Map<String, Object> request) {
        try {
            Long pacienteId = Long.valueOf(request.get("pacienteId").toString());
            String tipoDenticion = (String) request.get("tipoDenticion");
            Map<String, Object> datosDientes = (Map<String, Object>) request.get("datosDientes");
            String observaciones = (String) request.get("observaciones");
            
            // Verificar que el paciente existe
            Optional<Paciente> paciente = pacienteRepository.findById(pacienteId);
            if (!paciente.isPresent()) {
                return ResponseEntity.badRequest().body("Paciente no encontrado");
            }
            
            // Convertir datosDientes a JSON string
            String datosDientesJson = objectMapper.writeValueAsString(datosDientes);
            
            // Crear el odontograma
            Odontograma odontograma = new Odontograma();
            odontograma.setPaciente(paciente.get());
            odontograma.setTipoDenticion(tipoDenticion);
            odontograma.setDatosDientes(datosDientesJson);
            odontograma.setObservaciones(observaciones);
            
            Odontograma guardado = odontogramaService.guardarOdontograma(odontograma);
            
            return ResponseEntity.ok(guardado);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al guardar odontograma: " + e.getMessage());
        }
    }
    
    /**
     * Obtener todos los odontogramas de un paciente
     */
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<Odontograma>> obtenerOdontogramasPaciente(@PathVariable Long pacienteId) {
        List<Odontograma> odontogramas = odontogramaService.obtenerOdontogramasPaciente(pacienteId);
        return ResponseEntity.ok(odontogramas);
    }
    
    /**
     * Obtener un odontograma específico por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerOdontograma(@PathVariable Long id) {
        try {
            Odontograma odontograma = odontogramaService.obtenerOdontogramaPorId(id);
            return ResponseEntity.ok(odontograma);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Obtener el odontograma más reciente de un paciente
     */
    @GetMapping("/paciente/{pacienteId}/reciente")
    public ResponseEntity<?> obtenerOdontogramaMasReciente(@PathVariable Long pacienteId) {
        Optional<Odontograma> odontograma = odontogramaService.obtenerOdontogramaMasReciente(pacienteId);
        return odontograma.isPresent() ? ResponseEntity.ok(odontograma.get()) : ResponseEntity.notFound().build();
    }
    
    /**
     * Actualizar un odontograma existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarOdontograma(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            String tipoDenticion = (String) request.get("tipoDenticion");
            Map<String, Object> datosDientes = (Map<String, Object>) request.get("datosDientes");
            String observaciones = (String) request.get("observaciones");
            
            // Convertir datosDientes a JSON string
            String datosDientesJson = objectMapper.writeValueAsString(datosDientes);
            
            // Crear odontograma actualizado
            Odontograma odontogramaActualizado = new Odontograma();
            odontogramaActualizado.setTipoDenticion(tipoDenticion);
            odontogramaActualizado.setDatosDientes(datosDientesJson);
            odontogramaActualizado.setObservaciones(observaciones);
            
            Odontograma actualizado = odontogramaService.actualizarOdontograma(id, odontogramaActualizado);
            return ResponseEntity.ok(actualizado);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar odontograma: " + e.getMessage());
        }
    }
    
    /**
     * Eliminar un odontograma
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarOdontograma(@PathVariable Long id) {
        try {
            odontogramaService.eliminarOdontograma(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Contar odontogramas de un paciente
     */
    @GetMapping("/paciente/{pacienteId}/count")
    public ResponseEntity<Long> contarOdontogramasPaciente(@PathVariable Long pacienteId) {
        long count = odontogramaService.contarOdontogramasPaciente(pacienteId);
        return ResponseEntity.ok(count);
    }
} 