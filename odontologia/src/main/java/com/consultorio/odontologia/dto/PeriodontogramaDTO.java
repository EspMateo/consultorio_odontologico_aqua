package com.consultorio.odontologia.dto;

import com.consultorio.odontologia.entity.Periodontograma;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class PeriodontogramaDTO {
    
    private Long id;
    private Long pacienteId;
    private String pacienteNombre;
    private String fechaRegistro;
    private Map<String, Object> datosPeriodontograma;
    private String observaciones;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaCreacion;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime fechaModificacion;
    
    // Constructors
    public PeriodontogramaDTO() {}
    
    public PeriodontogramaDTO(Periodontograma periodontograma) {
        this.id = periodontograma.getId();
        this.pacienteId = periodontograma.getPaciente().getId();
        this.pacienteNombre = periodontograma.getPaciente().getName() + " " + periodontograma.getPaciente().getLastname();
        this.fechaRegistro = periodontograma.getFechaRegistro();
        this.observaciones = periodontograma.getObservaciones();
        this.fechaCreacion = periodontograma.getFechaCreacion();
        this.fechaModificacion = periodontograma.getFechaModificacion();
    }
    
    // Getters and Setters
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
    
    public String getFechaRegistro() {
        return fechaRegistro;
    }
    
    public void setFechaRegistro(String fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
    
    public Map<String, Object> getDatosPeriodontograma() {
        return datosPeriodontograma;
    }
    
    public void setDatosPeriodontograma(Map<String, Object> datosPeriodontograma) {
        this.datosPeriodontograma = datosPeriodontograma;
    }
    
    public String getObservaciones() {
        return observaciones;
    }
    
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
    
    public LocalDateTime getFechaModificacion() {
        return fechaModificacion;
    }
    
    public void setFechaModificacion(LocalDateTime fechaModificacion) {
        this.fechaModificacion = fechaModificacion;
    }
} 