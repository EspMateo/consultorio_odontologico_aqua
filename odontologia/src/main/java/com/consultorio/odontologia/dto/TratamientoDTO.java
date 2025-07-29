package com.consultorio.odontologia.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TratamientoDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private String duracion;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String seguimiento;
    private boolean activo;
    private Long pacienteId;

    // Constructor para crear nuevos tratamientos
    public TratamientoDTO(String nombre, String descripcion, String duracion,
                         LocalDate fechaInicio, LocalDate fechaFin, String seguimiento,
                         boolean activo, Long pacienteId) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.duracion = duracion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.seguimiento = seguimiento;
        this.activo = activo;
        this.pacienteId = pacienteId;
    }

    // Constructor sin ID para crear nuevos tratamientos
    public TratamientoDTO(String nombre, String descripcion, String duracion,
                         LocalDate fechaInicio, LocalDate fechaFin, String seguimiento,
                         Long pacienteId) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.duracion = duracion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.seguimiento = seguimiento;
        this.activo = true; // Por defecto activo
        this.pacienteId = pacienteId;
    }
} 