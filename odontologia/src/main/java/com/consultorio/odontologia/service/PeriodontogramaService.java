package com.consultorio.odontologia.service;

import com.consultorio.odontologia.dto.PeriodontogramaDTO;
import com.consultorio.odontologia.entity.Periodontograma;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.repository.PeriodontogramaRepository;
import com.consultorio.odontologia.repository.PacienteRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PeriodontogramaService {
    
    @Autowired
    private PeriodontogramaRepository periodontogramaRepository;
    
    @Autowired
    private PacienteRepository pacienteRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    // Guardar nuevo periodontograma
    public PeriodontogramaDTO guardarPeriodontograma(PeriodontogramaDTO dto) throws Exception {
        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        
        Periodontograma periodontograma = new Periodontograma();
        periodontograma.setPaciente(paciente);
        periodontograma.setFechaRegistro(dto.getFechaRegistro());
        periodontograma.setObservaciones(dto.getObservaciones());
        periodontograma.setFechaCreacion(LocalDateTime.now());
        
        // Convertir datosPeriodontograma a JSON
        if (dto.getDatosPeriodontograma() != null) {
            periodontograma.setDatosPeriodontograma(objectMapper.writeValueAsString(dto.getDatosPeriodontograma()));
        }
        
        Periodontograma saved = periodontogramaRepository.save(periodontograma);
        return new PeriodontogramaDTO(saved);
    }
    
    // Actualizar periodontograma existente
    public PeriodontogramaDTO actualizarPeriodontograma(Long id, PeriodontogramaDTO dto) throws Exception {
        Periodontograma periodontograma = periodontogramaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Periodontograma no encontrado"));
        
        periodontograma.setFechaRegistro(dto.getFechaRegistro());
        periodontograma.setObservaciones(dto.getObservaciones());
        periodontograma.setFechaModificacion(LocalDateTime.now());
        
        // Convertir datosPeriodontograma a JSON
        if (dto.getDatosPeriodontograma() != null) {
            periodontograma.setDatosPeriodontograma(objectMapper.writeValueAsString(dto.getDatosPeriodontograma()));
        }
        
        Periodontograma updated = periodontogramaRepository.save(periodontograma);
        return new PeriodontogramaDTO(updated);
    }
    
    // Obtener periodontograma por ID
    public PeriodontogramaDTO obtenerPorId(Long id) throws Exception {
        Periodontograma periodontograma = periodontogramaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Periodontograma no encontrado"));
        
        PeriodontogramaDTO dto = new PeriodontogramaDTO(periodontograma);
        
        // Convertir JSON a Map
        if (periodontograma.getDatosPeriodontograma() != null) {
            dto.setDatosPeriodontograma(objectMapper.readValue(periodontograma.getDatosPeriodontograma(), Map.class));
        }
        
        return dto;
    }
    
    // Obtener periodontograma por paciente y fecha
    public PeriodontogramaDTO obtenerPorPacienteYFecha(Long pacienteId, String fecha) throws Exception {
        Periodontograma periodontograma = periodontogramaRepository.findByPacienteIdAndFechaRegistro(pacienteId, fecha)
                .orElseThrow(() -> new RuntimeException("Periodontograma no encontrado"));
        
        PeriodontogramaDTO dto = new PeriodontogramaDTO(periodontograma);
        
        // Convertir JSON a Map
        if (periodontograma.getDatosPeriodontograma() != null) {
            dto.setDatosPeriodontograma(objectMapper.readValue(periodontograma.getDatosPeriodontograma(), Map.class));
        }
        
        return dto;
    }
    
    // Obtener periodontograma más reciente de un paciente
    public PeriodontogramaDTO obtenerMasReciente(Long pacienteId) throws Exception {
        Periodontograma periodontograma = periodontogramaRepository.findMostRecentByPacienteId(pacienteId)
                .orElseThrow(() -> new RuntimeException("No se encontraron periodontogramas para este paciente"));
        
        PeriodontogramaDTO dto = new PeriodontogramaDTO(periodontograma);
        
        // Convertir JSON a Map
        if (periodontograma.getDatosPeriodontograma() != null) {
            dto.setDatosPeriodontograma(objectMapper.readValue(periodontograma.getDatosPeriodontograma(), Map.class));
        }
        
        return dto;
    }
    
    // Obtener todas las fechas disponibles para un paciente
    public List<String> obtenerFechasDisponibles(Long pacienteId) {
        return periodontogramaRepository.findFechasByPacienteId(pacienteId);
    }
    
    // Verificar si existe periodontograma para paciente y fecha
    public boolean existePeriodontograma(Long pacienteId, String fecha) {
        return periodontogramaRepository.existsByPacienteIdAndFechaRegistro(pacienteId, fecha);
    }
    
    // Obtener todos los periodontogramas de un paciente
    public List<PeriodontogramaDTO> obtenerTodasPorPaciente(Long pacienteId) throws Exception {
        List<Periodontograma> periodontogramas = periodontogramaRepository.findByPacienteIdOrderByFechaCreacionDesc(pacienteId);
        
        return periodontogramas.stream().map(periodontograma -> {
            try {
                PeriodontogramaDTO dto = new PeriodontogramaDTO(periodontograma);
                
                // Convertir JSON a Map
                if (periodontograma.getDatosPeriodontograma() != null) {
                    dto.setDatosPeriodontograma(objectMapper.readValue(periodontograma.getDatosPeriodontograma(), Map.class));
                }
                
                return dto;
            } catch (Exception e) {
                throw new RuntimeException("Error al procesar periodontograma", e);
            }
        }).collect(Collectors.toList());
    }
    
    // Eliminar periodontograma
    public void eliminarPeriodontograma(Long id) {
        if (!periodontogramaRepository.existsById(id)) {
            throw new RuntimeException("Periodontograma no encontrado con ID: " + id);
        }
        periodontogramaRepository.deleteById(id);
    }
} 