package com.consultorio.odontologia.service;

import com.consultorio.odontologia.dto.PeriodonciaDTO;
import com.consultorio.odontologia.entity.Periodoncia;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.repository.PeriodonciaRepository;
import com.consultorio.odontologia.repository.PacienteRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PeriodonciaService {
    
    @Autowired
    private PeriodonciaRepository periodonciaRepository;
    
    @Autowired
    private PacienteRepository pacienteRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    // Guardar nueva periodoncia
    public PeriodonciaDTO guardarPeriodoncia(PeriodonciaDTO dto) throws Exception {
        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
        
        Periodoncia periodoncia = new Periodoncia();
        periodoncia.setPaciente(paciente);
        periodoncia.setFechaRegistro(dto.getFechaRegistro());
        periodoncia.setTipoFicha(Periodoncia.TipoFicha.valueOf(dto.getTipoFicha()));
        periodoncia.setObservaciones(dto.getObservaciones());
        periodoncia.setFechaCreacion(LocalDate.now());
        
        // Convertir índices a JSON
        if (dto.getIndicePlaca() != null) {
            periodoncia.setIndicePlaca(objectMapper.writeValueAsString(dto.getIndicePlaca()));
        }
        if (dto.getIndiceSarro() != null) {
            periodoncia.setIndiceSarro(objectMapper.writeValueAsString(dto.getIndiceSarro()));
        }
        
        // Calcular porcentajes
        periodoncia.setPorcentajePlaca(calcularPorcentajePlaca(dto.getIndicePlaca()));
        periodoncia.setPorcentajeSarro(calcularPorcentajeSarro(dto.getIndiceSarro()));
        
        Periodoncia saved = periodonciaRepository.save(periodoncia);
        return new PeriodonciaDTO(saved);
    }
    
    // Actualizar periodoncia existente
    public PeriodonciaDTO actualizarPeriodoncia(Long id, PeriodonciaDTO dto) throws Exception {
        Periodoncia periodoncia = periodonciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Periodoncia no encontrada"));
        
        periodoncia.setFechaRegistro(dto.getFechaRegistro());
        periodoncia.setTipoFicha(Periodoncia.TipoFicha.valueOf(dto.getTipoFicha()));
        periodoncia.setObservaciones(dto.getObservaciones());
        periodoncia.setFechaModificacion(LocalDate.now());
        
        // Convertir índices a JSON
        if (dto.getIndicePlaca() != null) {
            periodoncia.setIndicePlaca(objectMapper.writeValueAsString(dto.getIndicePlaca()));
        }
        if (dto.getIndiceSarro() != null) {
            periodoncia.setIndiceSarro(objectMapper.writeValueAsString(dto.getIndiceSarro()));
        }
        
        // Calcular porcentajes
        periodoncia.setPorcentajePlaca(calcularPorcentajePlaca(dto.getIndicePlaca()));
        periodoncia.setPorcentajeSarro(calcularPorcentajeSarro(dto.getIndiceSarro()));
        
        Periodoncia updated = periodonciaRepository.save(periodoncia);
        return new PeriodonciaDTO(updated);
    }
    
    // Obtener periodoncia por ID
    public PeriodonciaDTO obtenerPorId(Long id) throws Exception {
        Periodoncia periodoncia = periodonciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Periodoncia no encontrada"));
        
        PeriodonciaDTO dto = new PeriodonciaDTO(periodoncia);
        
        // Convertir JSON a Map
        if (periodoncia.getIndicePlaca() != null) {
            dto.setIndicePlaca(objectMapper.readValue(periodoncia.getIndicePlaca(), Map.class));
        }
        if (periodoncia.getIndiceSarro() != null) {
            dto.setIndiceSarro(objectMapper.readValue(periodoncia.getIndiceSarro(), Map.class));
        }
        
        return dto;
    }
    
    // Obtener periodoncia por paciente y fecha
    public PeriodonciaDTO obtenerPorPacienteYFecha(Long pacienteId, LocalDate fecha) throws Exception {
        Periodoncia periodoncia = periodonciaRepository.findByPacienteIdAndFechaRegistro(pacienteId, fecha)
                .orElseThrow(() -> new RuntimeException("Periodoncia no encontrada"));
        
        PeriodonciaDTO dto = new PeriodonciaDTO(periodoncia);
        
        // Convertir JSON a Map
        if (periodoncia.getIndicePlaca() != null) {
            dto.setIndicePlaca(objectMapper.readValue(periodoncia.getIndicePlaca(), Map.class));
        }
        if (periodoncia.getIndiceSarro() != null) {
            dto.setIndiceSarro(objectMapper.readValue(periodoncia.getIndiceSarro(), Map.class));
        }
        
        return dto;
    }
    
    // Obtener periodoncia más reciente de un paciente
    public PeriodonciaDTO obtenerMasReciente(Long pacienteId) throws Exception {
        Periodoncia periodoncia = periodonciaRepository.findMostRecentByPacienteId(pacienteId)
                .orElseThrow(() -> new RuntimeException("No se encontraron periodoncias para este paciente"));
        
        PeriodonciaDTO dto = new PeriodonciaDTO(periodoncia);
        
        // Convertir JSON a Map
        if (periodoncia.getIndicePlaca() != null) {
            dto.setIndicePlaca(objectMapper.readValue(periodoncia.getIndicePlaca(), Map.class));
        }
        if (periodoncia.getIndiceSarro() != null) {
            dto.setIndiceSarro(objectMapper.readValue(periodoncia.getIndiceSarro(), Map.class));
        }
        
        return dto;
    }
    
    // Obtener todas las fechas disponibles para un paciente
    public List<LocalDate> obtenerFechasDisponibles(Long pacienteId) {
        return periodonciaRepository.findFechasByPacienteId(pacienteId);
    }
    
    // Verificar si existe periodoncia para paciente y fecha
    public boolean existePeriodoncia(Long pacienteId, LocalDate fecha) {
        return periodonciaRepository.existsByPacienteIdAndFechaRegistro(pacienteId, fecha);
    }
    
    // Obtener todas las periodoncias de un paciente
    public List<PeriodonciaDTO> obtenerTodasPorPaciente(Long pacienteId) throws Exception {
        List<Periodoncia> periodoncias = periodonciaRepository.findByPacienteIdOrderByFechaRegistroDesc(pacienteId);
        
        return periodoncias.stream().map(periodoncia -> {
            try {
                PeriodonciaDTO dto = new PeriodonciaDTO(periodoncia);
                
                // Convertir JSON a Map
                if (periodoncia.getIndicePlaca() != null) {
                    dto.setIndicePlaca(objectMapper.readValue(periodoncia.getIndicePlaca(), Map.class));
                }
                if (periodoncia.getIndiceSarro() != null) {
                    dto.setIndiceSarro(objectMapper.readValue(periodoncia.getIndiceSarro(), Map.class));
                }
                
                return dto;
            } catch (Exception e) {
                throw new RuntimeException("Error al procesar periodoncia", e);
            }
        }).collect(Collectors.toList());
    }
    
    // Calcular porcentaje de placa
    private Integer calcularPorcentajePlaca(Map<String, Object> indicePlaca) {
        if (indicePlaca == null || indicePlaca.isEmpty()) {
            return 0;
        }
        
        int totalSectores = indicePlaca.size();
        long sectoresSeleccionados = indicePlaca.values().stream()
                .filter(value -> Boolean.TRUE.equals(value))
                .count();
        
        return totalSectores > 0 ? (int) Math.round((double) sectoresSeleccionados / totalSectores * 100) : 0;
    }
    
    // Calcular porcentaje de sarro
    private Integer calcularPorcentajeSarro(Map<String, Object> indiceSarro) {
        if (indiceSarro == null || indiceSarro.isEmpty()) {
            return 0;
        }
        
        int totalSectores = 0;
        int sectoresConSarro = 0;
        
        for (Object value : indiceSarro.values()) {
            if (value instanceof Map) {
                Map<?, ?> dienteSarro = (Map<?, ?>) value;
                totalSectores += dienteSarro.size();
                sectoresConSarro += dienteSarro.values().stream()
                        .filter(v -> Boolean.TRUE.equals(v))
                        .count();
            }
        }
        
        return totalSectores > 0 ? (int) Math.round((double) sectoresConSarro / totalSectores * 100) : 0;
    }
} 