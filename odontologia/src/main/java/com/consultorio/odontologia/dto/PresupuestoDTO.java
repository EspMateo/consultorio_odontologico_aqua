package com.consultorio.odontologia.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
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
    public BigDecimal getTotalPresupuesto() {
        if (tratamientos == null || tratamientos.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return tratamientos.stream()
                .map(TratamientoPresupuestoDTO::getPrecio)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getTotalAbonado() {
        if (tratamientos == null || tratamientos.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return tratamientos.stream()
                .map(TratamientoPresupuestoDTO::getAbonado)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPacienteId() {
        return pacienteId;
    }

    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }

    public String getPacienteNombre() {
        return pacienteNombre;
    }

    public void setPacienteNombre(String pacienteNombre) {
        this.pacienteNombre = pacienteNombre;
    }

    public String getPacienteApellido() {
        return pacienteApellido;
    }

    public void setPacienteApellido(String pacienteApellido) {
        this.pacienteApellido = pacienteApellido;
    }

    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public List<TratamientoPresupuestoDTO> getTratamientos() {
        return tratamientos;
    }

    public void setTratamientos(List<TratamientoPresupuestoDTO> tratamientos) {
        this.tratamientos = tratamientos;
    }

    public BigDecimal getDeudaTotal() {
        return getTotalPresupuesto().subtract(getTotalAbonado());
    }

    public Boolean isCompletamentePagado() {
        return getDeudaTotal().compareTo(BigDecimal.ZERO) <= 0;
    }
} 