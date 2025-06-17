package com.consultorio.odontologia.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "historiaClinica")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HistoriaClinica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private String enfermedadesActuales;

    @Column(nullable = true)
    private String medicamentos;

    @Column(nullable = true)
    private String alergias;

    @Column(nullable = true)
    private String antecedentesFamiliares;

    @Column(nullable = true)
    private String apreciacionGeneral;

    @Column(nullable = true)
    private String apreciacionGeneralDetalle;

    @Column(nullable = true)
    private String examenRegional;

    @Column(nullable = true)
    private String examenRegionalDetalle;

    @Column(nullable = true)
    private String examenLocal;

    @Column(nullable = true)
    private String examenLocalDetalle;

    @OneToOne(mappedBy = "historiaClinica")
    @JsonBackReference
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = true)
    private Usuario usuario;
}
