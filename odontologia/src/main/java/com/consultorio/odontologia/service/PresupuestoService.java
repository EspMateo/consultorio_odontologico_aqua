package com.consultorio.odontologia.service;

import com.consultorio.odontologia.dto.PresupuestoDTO;
import com.consultorio.odontologia.dto.TratamientoPresupuestoDTO;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.entity.Presupuesto;
import com.consultorio.odontologia.entity.TratamientoPresupuesto;
import com.consultorio.odontologia.repository.PacienteRepository;
import com.consultorio.odontologia.repository.PresupuestoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PresupuestoService {

    @Autowired
    private PresupuestoRepository presupuestoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    // Crear nuevo presupuesto
    public PresupuestoDTO crearPresupuesto(PresupuestoDTO presupuestoDTO) {
        Paciente paciente = pacienteRepository.findById(presupuestoDTO.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        Presupuesto presupuesto = new Presupuesto(paciente, presupuestoDTO.getFechaRegistro());
        
        // Agregar tratamientos
        if (presupuestoDTO.getTratamientos() != null) {
            for (TratamientoPresupuestoDTO tratamientoDTO : presupuestoDTO.getTratamientos()) {
                TratamientoPresupuesto tratamiento = new TratamientoPresupuesto(
                    tratamientoDTO.getNombre(),
                    tratamientoDTO.getPrecio(),
                    tratamientoDTO.getAbonado(),
                    tratamientoDTO.getPagado()
                );
                presupuesto.addTratamiento(tratamiento);
            }
        }

        Presupuesto presupuestoGuardado = presupuestoRepository.save(presupuesto);
        return convertirADTO(presupuestoGuardado);
    }

    // Actualizar presupuesto existente
    public PresupuestoDTO actualizarPresupuesto(Long id, PresupuestoDTO presupuestoDTO) {
        Presupuesto presupuesto = presupuestoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado"));

        // Actualizar fecha si es diferente
        if (!presupuesto.getFechaRegistro().equals(presupuestoDTO.getFechaRegistro())) {
            presupuesto.setFechaRegistro(presupuestoDTO.getFechaRegistro());
        }

        // Actualizar tratamientos existentes o crear nuevos
        if (presupuestoDTO.getTratamientos() != null) {
            // Limpiar tratamientos existentes
            presupuesto.getTratamientos().clear();
            
            for (TratamientoPresupuestoDTO tratamientoDTO : presupuestoDTO.getTratamientos()) {
                TratamientoPresupuesto tratamiento = new TratamientoPresupuesto(
                    tratamientoDTO.getNombre(),
                    tratamientoDTO.getPrecio(),
                    tratamientoDTO.getAbonado(),
                    tratamientoDTO.getPagado()
                );
                presupuesto.addTratamiento(tratamiento);
            }
        }

        Presupuesto presupuestoActualizado = presupuestoRepository.save(presupuesto);
        return convertirADTO(presupuestoActualizado);
    }

    // Obtener presupuesto por ID
    public PresupuestoDTO obtenerPresupuestoPorId(Long id) {
        Presupuesto presupuesto = presupuestoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado"));
        return convertirADTO(presupuesto);
    }

    // Obtener presupuesto por paciente y fecha
    public PresupuestoDTO obtenerPresupuestoPorPacienteYFecha(Long pacienteId, LocalDate fecha) {
        Presupuesto presupuesto = presupuestoRepository.findByPacienteIdAndFechaRegistro(pacienteId, fecha);
        if (presupuesto == null) {
            throw new RuntimeException("Presupuesto no encontrado para el paciente y fecha especificados");
        }
        return convertirADTO(presupuesto);
    }

    // Obtener todos los presupuestos de un paciente
    public List<PresupuestoDTO> obtenerPresupuestosPorPaciente(Long pacienteId) {
        List<Presupuesto> presupuestos = presupuestoRepository.findByPacienteIdOrderByFechaRegistroDesc(pacienteId);
        return presupuestos.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // Obtener fechas disponibles para un paciente
    public List<LocalDate> obtenerFechasDisponiblesPorPaciente(Long pacienteId) {
        return presupuestoRepository.findFechasDisponiblesByPacienteId(pacienteId);
    }

    // Actualizar pago de un tratamiento específico
    public PresupuestoDTO actualizarPagoTratamiento(Long presupuestoId, Long tratamientoId, BigDecimal nuevoAbonado) {
        Presupuesto presupuesto = presupuestoRepository.findById(presupuestoId)
                .orElseThrow(() -> new RuntimeException("Presupuesto no encontrado"));
        
        TratamientoPresupuesto tratamiento = presupuesto.getTratamientos().stream()
                .filter(t -> t.getId().equals(tratamientoId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Tratamiento no encontrado"));
        
        tratamiento.actualizarPago(nuevoAbonado);
        
        Presupuesto presupuestoActualizado = presupuestoRepository.save(presupuesto);
        return convertirADTO(presupuestoActualizado);
    }

    // Método sobrecargado para compatibilidad con Integer
    public PresupuestoDTO actualizarPagoTratamiento(Long presupuestoId, Long tratamientoId, Integer nuevoAbonado) {
        return actualizarPagoTratamiento(presupuestoId, tratamientoId, BigDecimal.valueOf(nuevoAbonado));
    }

    // Eliminar presupuesto
    public void eliminarPresupuesto(Long id) {
        if (!presupuestoRepository.existsById(id)) {
            throw new RuntimeException("Presupuesto no encontrado");
        }
        presupuestoRepository.deleteById(id);
    }

    // Convertir entidad a DTO
    private PresupuestoDTO convertirADTO(Presupuesto presupuesto) {
        PresupuestoDTO dto = new PresupuestoDTO();
        dto.setId(presupuesto.getId());
        dto.setPacienteId(presupuesto.getPaciente().getId());
        dto.setPacienteNombre(presupuesto.getPaciente().getName());
        dto.setPacienteApellido(presupuesto.getPaciente().getLastname());
        dto.setFechaRegistro(presupuesto.getFechaRegistro());
        
        if (presupuesto.getTratamientos() != null) {
            List<TratamientoPresupuestoDTO> tratamientosDTO = presupuesto.getTratamientos().stream()
                    .map(this::convertirTratamientoADTO)
                    .collect(Collectors.toList());
            dto.setTratamientos(tratamientosDTO);
        }
        
        return dto;
    }

    // Convertir tratamiento a DTO
    private TratamientoPresupuestoDTO convertirTratamientoADTO(TratamientoPresupuesto tratamiento) {
        TratamientoPresupuestoDTO dto = new TratamientoPresupuestoDTO(
                tratamiento.getId(),
                tratamiento.getNombre(),
                tratamiento.getPrecio(),
                tratamiento.getAbonado(),
                tratamiento.getPagado()
        );
        dto.setFechaCreacion(tratamiento.getFechaCreacion());
        dto.setFechaUltimaActualizacion(tratamiento.getFechaUltimaActualizacion());
        return dto;
    }

    // Calcular total de ingresos por rango de fechas
    public BigDecimal calcularTotalIngresosPorFecha(LocalDate fechaInicio, LocalDate fechaFin) {
        List<Presupuesto> presupuestos = presupuestoRepository.findByFechaRegistroBetween(fechaInicio, fechaFin);
        return presupuestos.stream()
                .flatMap(p -> p.getTratamientos().stream())
                .map(TratamientoPresupuesto::getAbonado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Calcular total de ingresos pendientes por rango de fechas
    public BigDecimal calcularTotalIngresosPendientesPorFecha(LocalDate fechaInicio, LocalDate fechaFin) {
        List<Presupuesto> presupuestos = presupuestoRepository.findByFechaRegistroBetween(fechaInicio, fechaFin);
        return presupuestos.stream()
                .flatMap(p -> p.getTratamientos().stream())
                .map(tratamiento -> tratamiento.getPrecio().subtract(tratamiento.getAbonado()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Obtener presupuestos por rango de fechas
    public List<PresupuestoDTO> obtenerPresupuestosPorFecha(LocalDate fechaInicio, LocalDate fechaFin) {
        List<Presupuesto> presupuestos = presupuestoRepository.findByFechaRegistroBetween(fechaInicio, fechaFin);
        return presupuestos.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
} 