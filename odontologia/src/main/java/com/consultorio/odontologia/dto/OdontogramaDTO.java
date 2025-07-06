package com.consultorio.odontologia.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class OdontogramaDTO {
    
    private Long id;
    private Long pacienteId;
    private String tipoDenticion;
    private Map<String, Object> datosDientes; // Estructura de dientes
    private String observaciones;
    private LocalDateTime fechaCreacion;
    
    // Constructors
    public OdontogramaDTO() {}
    
    public OdontogramaDTO(Long pacienteId, String tipoDenticion, Map<String, Object> datosDientes, String observaciones) {
        this.pacienteId = pacienteId;
        this.tipoDenticion = tipoDenticion;
        this.datosDientes = datosDientes;
        this.observaciones = observaciones;
        this.fechaCreacion = LocalDateTime.now();
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
    
    public String getTipoDenticion() {
        return tipoDenticion;
    }
    
    public void setTipoDenticion(String tipoDenticion) {
        this.tipoDenticion = tipoDenticion;
    }
    
    public Map<String, Object> getDatosDientes() {
        return datosDientes;
    }
    
    public void setDatosDientes(Map<String, Object> datosDientes) {
        this.datosDientes = datosDientes;
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
} 