package com.consultorio.odontologia.service.util;

import com.consultorio.odontologia.dto.CitaDTO;
import com.consultorio.odontologia.dto.GastoDTO;
import com.consultorio.odontologia.dto.PresupuestoDTO;
import com.consultorio.odontologia.dto.TratamientoPresupuestoDTO;
import com.consultorio.odontologia.entity.Cita;
import com.consultorio.odontologia.entity.Gasto;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.entity.Presupuesto;
import com.consultorio.odontologia.entity.TratamientoPresupuesto;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

/**
 * Clase utilitaria para convertir entre entidades y DTOs
 * Centraliza las conversiones para evitar duplicación de código
 */
@Component
public class DTOConverter {

    /**
     * Convierte una entidad Cita a CitaDTO
     */
    public static CitaDTO convertirCitaADTO(Cita cita) {
        if (cita == null) {
            return null;
        }
        
        CitaDTO dto = new CitaDTO();
        dto.setId(cita.getId());
        
        // Asegurarse de que el paciente esté cargado
        Paciente paciente = cita.getPaciente();
        if (paciente != null) {
            dto.setPaciente(paciente);
        }
        
        dto.setFecha(cita.getFecha().toString());
        dto.setHora(cita.getHora().toString());
        dto.setMotivo(cita.getMotivo());
        dto.setUsuarioId(cita.getUsuario().getId());
        dto.setUsuarioName(cita.getUsuario().getName());
        dto.setUsuarioEmail(cita.getUsuario().getEmail());
        
        return dto;
    }

    /**
     * Convierte una entidad Gasto a GastoDTO
     */
    public static GastoDTO convertirGastoADTO(Gasto gasto) {
        if (gasto == null) {
            return null;
        }
        
        GastoDTO dto = new GastoDTO();
        dto.setId(gasto.getId());
        dto.setDescripcion(gasto.getDescripcion());
        dto.setPrecio(gasto.getPrecio());
        dto.setCantidad(gasto.getCantidad());
        dto.setFechaGasto(gasto.getFechaGasto());
        dto.setCategoria(gasto.getCategoria());
        dto.setProveedor(gasto.getProveedor());
        dto.setObservaciones(gasto.getObservaciones());
        dto.setTotal(gasto.getTotal());
        
        return dto;
    }

    /**
     * Convierte una entidad Presupuesto a PresupuestoDTO
     */
    public static PresupuestoDTO convertirPresupuestoADTO(Presupuesto presupuesto) {
        if (presupuesto == null) {
            return null;
        }
        
        PresupuestoDTO dto = new PresupuestoDTO();
        dto.setId(presupuesto.getId());
        dto.setPacienteId(presupuesto.getPaciente().getId());
        dto.setFechaRegistro(presupuesto.getFechaRegistro());
        
        // Convertir tratamientos
        if (presupuesto.getTratamientos() != null) {
            dto.setTratamientos(presupuesto.getTratamientos().stream()
                .map(tratamiento -> {
                    TratamientoPresupuestoDTO tratamientoDTO = new TratamientoPresupuestoDTO();
                    tratamientoDTO.setId(tratamiento.getId());
                    tratamientoDTO.setNombre(tratamiento.getNombre());
                    tratamientoDTO.setPrecio(tratamiento.getPrecio());
                    tratamientoDTO.setAbonado(tratamiento.getAbonado());
                    tratamientoDTO.setPagado(tratamiento.getPagado());
                    return tratamientoDTO;
                })
                .collect(Collectors.toList()));
        }
        
        return dto;
    }
}
