package com.consultorio.odontologia.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class DiagnosticoDTO {

    private Long id;
    private String diagnostico;
    private String pronostico;
    private String observaciones;
    private LocalDate fechaDiagnostico;
    private Long pacienteId;
    private Long usuarioId;

    // Constructor para crear nuevo diagnóstico
    public DiagnosticoDTO(String diagnostico, String pronostico, String observaciones, 
                         LocalDate fechaDiagnostico, Long pacienteId, Long usuarioId) {
        this.diagnostico = diagnostico;
        this.pronostico = pronostico;
        this.observaciones = observaciones;
        this.fechaDiagnostico = fechaDiagnostico;
        this.pacienteId = pacienteId;
        this.usuarioId = usuarioId;
    }

    // Constructor para actualizar diagnóstico
    public DiagnosticoDTO(Long id, String diagnostico, String pronostico, String observaciones, 
                         LocalDate fechaDiagnostico, Long pacienteId, Long usuarioId) {
        this.id = id;
        this.diagnostico = diagnostico;
        this.pronostico = pronostico;
        this.observaciones = observaciones;
        this.fechaDiagnostico = fechaDiagnostico;
        this.pacienteId = pacienteId;
        this.usuarioId = usuarioId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDiagnostico() {
        return diagnostico;
    }

    public void setDiagnostico(String diagnostico) {
        this.diagnostico = diagnostico;
    }

    public String getPronostico() {
        return pronostico;
    }

    public void setPronostico(String pronostico) {
        this.pronostico = pronostico;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public LocalDate getFechaDiagnostico() {
        return fechaDiagnostico;
    }

    public void setFechaDiagnostico(LocalDate fechaDiagnostico) {
        this.fechaDiagnostico = fechaDiagnostico;
    }

    public Long getPacienteId() {
        return pacienteId;
    }

    public void setPacienteId(Long pacienteId) {
        this.pacienteId = pacienteId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
}