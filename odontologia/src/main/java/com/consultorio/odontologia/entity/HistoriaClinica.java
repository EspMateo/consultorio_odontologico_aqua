package com.consultorio.odontologia.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "historia_clinica")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HistoriaClinica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Información básica
    @Column(nullable = true)
    private String motivoConsulta;

    // Hábitos de higiene
    @Column(nullable = true)
    private String cepilladoDental;

    @Column(nullable = true)
    private String cepilladoEncias;

    @Column(nullable = true)
    private String cepilladoLingual;

    @Column(nullable = true)
    private String observacionesHigienicas;

    @Column(nullable = true)
    private Boolean usaHiloDental;

    @Column(nullable = true)
    private Boolean higieneProtesica;

    // Hábitos y consumo
    @Column(nullable = true)
    private Boolean fumador;

    @Column(nullable = true)
    private Boolean consumeCafe;

    @Column(nullable = true)
    private Boolean consumeTe;

    @Column(nullable = true)
    private Boolean consumeMate;

    @Column(nullable = true)
    private Boolean consumeAlcohol;

    @Column(nullable = true)
    private Boolean consumeDrogas;

    // Antecedentes médicos
    @Column(nullable = true)
    private String enfermedadesActuales;

    @Column(nullable = true)
    private String medicamentos;

    @Column(nullable = true)
    private String alergias;

    @Column(nullable = true)
    private String posologia;

    @Column(nullable = true)
    private String antecedentesFamiliares;

    @Column(nullable = true)
    private Boolean enTratamiento;

    @Column(nullable = true)
    private Boolean tomaBifosfonatos;

    // Apreciación general
    @Column(nullable = true)
    private String apreciacionGeneral;

    @Column(nullable = true)
    private String apreciacionGeneralDetalle;

    // Examen regional
    @Column(nullable = true)
    private String examenRegional;

    @Column(nullable = true)
    private String examenRegionalDetalle;

    @Column(nullable = true)
    private String examenRegionalDetalles;

    // Examen local
    @Column(nullable = true)
    private String examenLocal;

    @Column(nullable = true)
    private String examenLocalDetalle;

    @Column(nullable = true)
    private String continenteDetalles;

    // Timestamps
    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(name = "fecha_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion;

    // Relaciones
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = true)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "paciente_id")
    @JsonBackReference
    private Paciente paciente;

    // Métodos de utilidad
    public String getFechaCreacionFormateada() {
        return fechaCreacion != null ? fechaCreacion.toLocalDate().toString() : "";
    }

    public String getFechaActualizacionFormateada() {
        return fechaActualizacion != null ? fechaActualizacion.toLocalDate().toString() : "";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMotivoConsulta() {
        return motivoConsulta;
    }

    public void setMotivoConsulta(String motivoConsulta) {
        this.motivoConsulta = motivoConsulta;
    }

    public String getCepilladoDental() {
        return cepilladoDental;
    }

    public void setCepilladoDental(String cepilladoDental) {
        this.cepilladoDental = cepilladoDental;
    }

    public String getCepilladoEncias() {
        return cepilladoEncias;
    }

    public void setCepilladoEncias(String cepilladoEncias) {
        this.cepilladoEncias = cepilladoEncias;
    }

    public String getCepilladoLingual() {
        return cepilladoLingual;
    }

    public void setCepilladoLingual(String cepilladoLingual) {
        this.cepilladoLingual = cepilladoLingual;
    }

    public String getObservacionesHigienicas() {
        return observacionesHigienicas;
    }

    public void setObservacionesHigienicas(String observacionesHigienicas) {
        this.observacionesHigienicas = observacionesHigienicas;
    }

    public Boolean getHigieneProtesica() {
        return higieneProtesica;
    }

    public void setHigieneProtesica(Boolean higieneProtesica) {
        this.higieneProtesica = higieneProtesica;
    }

    public Boolean getUsaHiloDental() {
        return usaHiloDental;
    }

    public void setUsaHiloDental(Boolean usaHiloDental) {
        this.usaHiloDental = usaHiloDental;
    }

    public Boolean getFumador() {
        return fumador;
    }

    public void setFumador(Boolean fumador) {
        this.fumador = fumador;
    }

    public Boolean getConsumeCafe() {
        return consumeCafe;
    }

    public void setConsumeCafe(Boolean consumeCafe) {
        this.consumeCafe = consumeCafe;
    }

    public Boolean getConsumeTe() {
        return consumeTe;
    }

    public void setConsumeTe(Boolean consumeTe) {
        this.consumeTe = consumeTe;
    }

    public Boolean getConsumeMate() {
        return consumeMate;
    }

    public void setConsumeMate(Boolean consumeMate) {
        this.consumeMate = consumeMate;
    }

    public Boolean getConsumeAlcohol() {
        return consumeAlcohol;
    }

    public void setConsumeAlcohol(Boolean consumeAlcohol) {
        this.consumeAlcohol = consumeAlcohol;
    }

    public Boolean getConsumeDrogas() {
        return consumeDrogas;
    }

    public void setConsumeDrogas(Boolean consumeDrogas) {
        this.consumeDrogas = consumeDrogas;
    }

    public String getEnfermedadesActuales() {
        return enfermedadesActuales;
    }

    public void setEnfermedadesActuales(String enfermedadesActuales) {
        this.enfermedadesActuales = enfermedadesActuales;
    }

    public String getMedicamentos() {
        return medicamentos;
    }

    public void setMedicamentos(String medicamentos) {
        this.medicamentos = medicamentos;
    }

    public String getAlergias() {
        return alergias;
    }

    public void setAlergias(String alergias) {
        this.alergias = alergias;
    }

    public String getPosologia() {
        return posologia;
    }

    public void setPosologia(String posologia) {
        this.posologia = posologia;
    }

    public String getAntecedentesFamiliares() {
        return antecedentesFamiliares;
    }

    public void setAntecedentesFamiliares(String antecedentesFamiliares) {
        this.antecedentesFamiliares = antecedentesFamiliares;
    }

    public Boolean getEnTratamiento() {
        return enTratamiento;
    }

    public void setEnTratamiento(Boolean enTratamiento) {
        this.enTratamiento = enTratamiento;
    }

    public Boolean getTomaBifosfonatos() {
        return tomaBifosfonatos;
    }

    public void setTomaBifosfonatos(Boolean tomaBifosfonatos) {
        this.tomaBifosfonatos = tomaBifosfonatos;
    }

    public String getApreciacionGeneral() {
        return apreciacionGeneral;
    }

    public void setApreciacionGeneral(String apreciacionGeneral) {
        this.apreciacionGeneral = apreciacionGeneral;
    }

    public String getApreciacionGeneralDetalle() {
        return apreciacionGeneralDetalle;
    }

    public void setApreciacionGeneralDetalle(String apreciacionGeneralDetalle) {
        this.apreciacionGeneralDetalle = apreciacionGeneralDetalle;
    }

    public String getExamenRegional() {
        return examenRegional;
    }

    public void setExamenRegional(String examenRegional) {
        this.examenRegional = examenRegional;
    }

    public String getExamenRegionalDetalle() {
        return examenRegionalDetalle;
    }

    public void setExamenRegionalDetalle(String examenRegionalDetalle) {
        this.examenRegionalDetalle = examenRegionalDetalle;
    }

    public String getExamenRegionalDetalles() {
        return examenRegionalDetalles;
    }

    public void setExamenRegionalDetalles(String examenRegionalDetalles) {
        this.examenRegionalDetalles = examenRegionalDetalles;
    }

    public String getExamenLocalDetalle() {
        return examenLocalDetalle;
    }

    public void setExamenLocalDetalle(String examenLocalDetalle) {
        this.examenLocalDetalle = examenLocalDetalle;
    }

    public String getExamenLocal() {
        return examenLocal;
    }

    public void setExamenLocal(String examenLocal) {
        this.examenLocal = examenLocal;
    }

    public String getContinenteDetalles() {
        return continenteDetalles;
    }

    public void setContinenteDetalles(String continenteDetalles) {
        this.continenteDetalles = continenteDetalles;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }
}
