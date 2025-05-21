package com.consultorio.odontologia.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "pacientes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long CI;
    private String name;
    private String lastname;
    private String gender;
    private int telephone;
    private String email;
    private String diagnosis;
    private String medication;
    private String generalMedicalHistory;
    private String dentalHistory;
    private String releaseSummary;
    @OneToOne
    @JoinColumn(name="historiaClinica_id", referencedColumnName = "id", nullable = true)
    @JsonManagedReference
    private HistoriaClinica historiaClinica;



}
