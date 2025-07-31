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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDuracion() {
        return duracion;
    }

    public void setDuracion(String duracion) {
        this.duracion = duracion;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public String getSeguimiento() {
        return seguimiento;
    }

    public void setSeguimiento(String seguimiento) {
        this.seguimiento = seguimiento;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public Long getPacienteId() {
        return pacienteId;
    }

    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }
}