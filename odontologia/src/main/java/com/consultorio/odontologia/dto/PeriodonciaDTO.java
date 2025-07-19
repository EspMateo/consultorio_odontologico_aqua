package com.consultorio.odontologia.dto;

import com.consultorio.odontologia.entity.Periodoncia;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDate;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class PeriodonciaDTO {
    
    private Long id;
    private Long pacienteId;
    private String pacienteNombre;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaRegistro;
    
    private String tipoFicha;
    private Map<String, Object> indicePlaca;
    private Map<String, Object> indiceSarro;
    private Integer porcentajePlaca;
    private Integer porcentajeSarro;
    private String observaciones;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaCreacion;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaModificacion;
    
    // Constructors
    public PeriodonciaDTO() {}
    
    public PeriodonciaDTO(Periodoncia periodoncia) {
        this.id = periodoncia.getId();
        this.pacienteId = periodoncia.getPaciente().getId();
        this.pacienteNombre = periodoncia.getPaciente().getName() + " " + periodoncia.getPaciente().getLastname();
        this.fechaRegistro = periodoncia.getFechaRegistro();
        this.tipoFicha = periodoncia.getTipoFicha().name();
        this.porcentajePlaca = periodoncia.getPorcentajePlaca();
        this.porcentajeSarro = periodoncia.getPorcentajeSarro();
        this.observaciones = periodoncia.getObservaciones();
        this.fechaCreacion = periodoncia.getFechaCreacion();
        this.fechaModificacion = periodoncia.getFechaModificacion();
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
    
    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }
    
    public void setFechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
    
    public String getTipoFicha() {
        return tipoFicha;
    }
    
    public void setTipoFicha(String tipoFicha) {
        this.tipoFicha = tipoFicha;
    }
    
    public Map<String, Object> getIndicePlaca() {
        return indicePlaca;
    }
    
    public void setIndicePlaca(Map<String, Object> indicePlaca) {
        this.indicePlaca = indicePlaca;
    }
    
    public Map<String, Object> getIndiceSarro() {
        return indiceSarro;
    }
    
    public void setIndiceSarro(Map<String, Object> indiceSarro) {
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
} 