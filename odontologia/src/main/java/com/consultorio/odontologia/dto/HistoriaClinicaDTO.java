package com.consultorio.odontologia.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HistoriaClinicaDTO {
    private Long id;
    private PacienteDTO paciente;
    private String motivoConsulta;
    private String cepilladoDental;
    private String cepilladoEncias;
    private String cepilladoLingual;
    private String observacionesHigienicas;
    private Boolean usaHiloDental;
    private Boolean higieneProtesica;
    private String enfermedadesActuales;
    private String medicamentos;
    private String alergias;
    private String posologia;
    private String antecedentesFamiliares;
    private Boolean enTratamiento;
    private Boolean tomaBifosfonatos;
    private String apreciacionGeneral;
    private String apreciacionGeneralDetalle;
    private String examenRegional;
    private String examenRegionalDetalle;
    private String examenLocal;
    private String examenLocalDetalle;
    private Object examenRegionalDetalles; // Será convertido a JSON
    private Object continenteDetalles; // Será convertido a JSON
    private UsuarioDTO usuario;
    private Boolean fumador;
    private Boolean consumeCafe;
    private Boolean consumeTe;
    private Boolean consumeMate;
    private Boolean consumeAlcohol;
    private Boolean consumeDrogas;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PacienteDTO getPaciente() {
        return paciente;
    }

    public void setPaciente(PacienteDTO paciente) {
        this.paciente = paciente;
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

    public Boolean getUsaHiloDental() {
        return usaHiloDental;
    }

    public void setUsaHiloDental(Boolean usaHiloDental) {
        this.usaHiloDental = usaHiloDental;
    }

    public Boolean getHigieneProtesica() {
        return higieneProtesica;
    }

    public void setHigieneProtesica(Boolean higieneProtesica) {
        this.higieneProtesica = higieneProtesica;
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

    public String getExamenLocal() {
        return examenLocal;
    }

    public void setExamenLocal(String examenLocal) {
        this.examenLocal = examenLocal;
    }

    public String getExamenLocalDetalle() {
        return examenLocalDetalle;
    }

    public void setExamenLocalDetalle(String examenLocalDetalle) {
        this.examenLocalDetalle = examenLocalDetalle;
    }

    public Object getExamenRegionalDetalles() {
        return examenRegionalDetalles;
    }

    public void setExamenRegionalDetalles(Object examenRegionalDetalles) {
        this.examenRegionalDetalles = examenRegionalDetalles;
    }

    public Object getContinenteDetalles() {
        return continenteDetalles;
    }

    public void setContinenteDetalles(Object continenteDetalles) {
        this.continenteDetalles = continenteDetalles;
    }

    public UsuarioDTO getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioDTO usuario) {
        this.usuario = usuario;
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
}