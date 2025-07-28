package com.consultorio.odontologia.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PresupuestoDTO {

    private Long id;
    private Long pacienteId;
    private String pacienteNombre;
    private String pacienteApellido;
    private LocalDate fechaRegistro;
    private List<TratamientoPresupuestoDTO> tratamientos;

    // Métodos para calcular totales
    public Integer getTotalPresupuesto() {
        if (tratamientos == null || tratamientos.isEmpty()) {
            return 0;
        }
        return tratamientos.stream()
                .mapToInt(TratamientoPresupuestoDTO::getPrecio)
                .sum();
    }

    public Integer getTotalAbonado() {
        if (tratamientos == null || tratamientos.isEmpty()) {
            return 0;
        }
        return tratamientos.stream()
                .mapToInt(TratamientoPresupuestoDTO::getAbonado)
                .sum();
    }

    public Integer getDeudaTotal() {
        return getTotalPresupuesto() - getTotalAbonado();
    }

    public Boolean isCompletamentePagado() {
        return getDeudaTotal() <= 0;
    }
} 