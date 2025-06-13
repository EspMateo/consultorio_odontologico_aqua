package com.consultorio.odontologia.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

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

    @OneToOne(mappedBy = "historiaClinica")
    @JsonBackReference
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    private Date fecha;

    private String cepilladoDental;
    private String cepilladoEncias;
    private String cepilladoLingual;
    private String hiloDental;
    private String expociosionPhAcido;
    private String momentosDeAzucar;
    private String ingestasClientes;
    private String obsHigiene;
    private String obsAlimenticio;
    private String fumar;

    public List<Infusiones> infusiones;
    public List<Mordisqueo> mordisqueos;
    public List<Succion> succiones;




}
