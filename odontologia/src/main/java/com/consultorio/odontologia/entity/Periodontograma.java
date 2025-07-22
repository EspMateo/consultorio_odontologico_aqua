package com.consultorio.odontologia.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "periodontogramas")
public class Periodontograma {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "paciente_id")
    @JsonBackReference
    private Paciente paciente;
    
    @Column(name = "fecha_registro")
    private String fechaRegistro; // Formato: yyyy-MM-dd
    
    @Column(name = "datos_periodontograma", columnDefinition = "TEXT")
    private String datosPeriodontograma; // JSON con los datos de los dientes
    
    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion;
    
    // Constructors
    public Periodontograma() {}
    
    public Periodontograma(Paciente paciente, String fechaRegistro, String datosPeriodontograma, String observaciones) {
        this.paciente = paciente;
        this.fechaRegistro = fechaRegistro;
        this.datosPeriodontograma = datosPeriodontograma;
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
    
    public Paciente getPaciente() {
        return paciente;
    }
    
    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }
    
    public String getFechaRegistro() {
        return fechaRegistro;
    }
    
    public void setFechaRegistro(String fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
    
    public String getDatosPeriodontograma() {
        return datosPeriodontograma;
    }
    
    public void setDatosPeriodontograma(String datosPeriodontograma) {
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