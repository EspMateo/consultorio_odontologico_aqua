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
} 