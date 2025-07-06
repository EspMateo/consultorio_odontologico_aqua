package com.consultorio.odontologia.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "odontogramas")
public class Odontograma {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "paciente_id")
    private Paciente paciente;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;
    
    @Column(name = "tipo_denticion")
    private String tipoDenticion; // "temporaria", "mixta", "permanente"
    
    @Column(name = "datos_dientes", columnDefinition = "TEXT")
    private String datosDientes; // JSON con el estado de cada diente
    
    @Column(name = "observaciones")
    private String observaciones;
    
    // Constructors
    public Odontograma() {}
    
    public Odontograma(Paciente paciente, String tipoDenticion, String datosDientes, String observaciones) {
        this.paciente = paciente;
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
    
    public Paciente getPaciente() {
        return paciente;
    }
    
    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }
    
    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
    
    public String getTipoDenticion() {
        return tipoDenticion;
    }
    
    public void setTipoDenticion(String tipoDenticion) {
        this.tipoDenticion = tipoDenticion;
    }
    
    public String getDatosDientes() {
        return datosDientes;
    }
    
    public void setDatosDientes(String datosDientes) {
        this.datosDientes = datosDientes;
    }
    
    public String getObservaciones() {
        return observaciones;
    }
    
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
} 