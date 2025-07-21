package com.consultorio.odontologia.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Map;

@Entity
@Table(name = "periodoncia")
public class Periodoncia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false)
    @JsonBackReference
    private Paciente paciente;
    
    @Column(name = "fecha_registro", nullable = false)
    private LocalDate fechaRegistro;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_ficha", nullable = false)
    private TipoFicha tipoFicha;
    
    @Column(name = "indice_placa", columnDefinition = "TEXT")
    private String indicePlaca; // JSON string
    
    @Column(name = "indice_sarro", columnDefinition = "TEXT")
    private String indiceSarro; // JSON string
    
    @Column(name = "porcentaje_placa")
    private Integer porcentajePlaca;
    
    @Column(name = "porcentaje_sarro")
    private Integer porcentajeSarro;
    
    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;
    
    @Column(name = "fecha_creacion")
    private LocalDate fechaCreacion;
    
    @Column(name = "fecha_modificacion")
    private LocalDate fechaModificacion;
    
    public enum TipoFicha {
        INICIAL,
        REEVALUACION,
        CONTROL_PERIODICO
    }
    
    // Constructors
    public Periodoncia() {}
    
    public Periodoncia(Paciente paciente, LocalDate fechaRegistro, TipoFicha tipoFicha) {
        this.paciente = paciente;
        this.fechaRegistro = fechaRegistro;
        this.tipoFicha = tipoFicha;
        this.fechaCreacion = LocalDate.now();
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
    
    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }
    
    public void setFechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
    
    public TipoFicha getTipoFicha() {
        return tipoFicha;
    }
    
    public void setTipoFicha(TipoFicha tipoFicha) {
        this.tipoFicha = tipoFicha;
    }
    
    public String getIndicePlaca() {
        return indicePlaca;
    }
    
    public void setIndicePlaca(String indicePlaca) {
        this.indicePlaca = indicePlaca;
    }
    
    public String getIndiceSarro() {
        return indiceSarro;
    }
    
    public void setIndiceSarro(String indiceSarro) {
        this.indiceSarro = indiceSarro;
    }
    
    public Integer getPorcentajePlaca() {
        return porcentajePlaca;
    }
    
    public void setPorcentajePlaca(Integer porcentajePlaca) {
        this.porcentajePlaca = porcentajePlaca;
    }
    
    public Integer getPorcentajeSarro() {
        return porcentajeSarro;
    }
    
    public void setPorcentajeSarro(Integer porcentajeSarro) {
        this.porcentajeSarro = porcentajeSarro;
    }
    
    public String getObservaciones() {
        return observaciones;
    }
    
    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }
    
    public LocalDate getFechaCreacion() {
        return fechaCreacion;
    }
    
    public void setFechaCreacion(LocalDate fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
    
    public LocalDate getFechaModificacion() {
        return fechaModificacion;
    }
    
    public void setFechaModificacion(LocalDate fechaModificacion) {
        this.fechaModificacion = fechaModificacion;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.fechaModificacion = LocalDate.now();
    }
} 