package com.consultorio.odontologia.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

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

    // Relaciones con eliminación en cascada
    @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<HistoriaClinica> historiasClinicas;

    @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Cita> citas;

    @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Odontograma> odontogramas;

    @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Periodoncia> periodoncias;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCI() {
        return CI;
    }

    public void setCI(Long CI) {
        this.CI = CI;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public int getTelephone() {
        return telephone;
    }

    public void setTelephone(int telephone) {
        this.telephone = telephone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getMedication() {
        return medication;
    }

    public void setMedication(String medication) {
        this.medication = medication;
    }

    public String getGeneralMedicalHistory() {
        return generalMedicalHistory;
    }

    public void setGeneralMedicalHistory(String generalMedicalHistory) {
        this.generalMedicalHistory = generalMedicalHistory;
    }

    public String getDentalHistory() {
        return dentalHistory;
    }

    public void setDentalHistory(String dentalHistory) {
        this.dentalHistory = dentalHistory;
    }

    public String getReleaseSummary() {
        return releaseSummary;
    }

    public void setReleaseSummary(String releaseSummary) {
        this.releaseSummary = releaseSummary;
    }

}
