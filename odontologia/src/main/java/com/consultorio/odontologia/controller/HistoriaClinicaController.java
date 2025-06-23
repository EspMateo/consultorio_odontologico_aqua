package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.dto.HistoriaClinicaDTO;
import com.consultorio.odontologia.entity.HistoriaClinica;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.entity.Usuario;
import com.consultorio.odontologia.service.HistoriaClinicaService;
import com.consultorio.odontologia.service.PacienteService;
import com.consultorio.odontologia.service.UsuarioService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historia-clinica")
@CrossOrigin(origins = {"http://localhost:5173"}, 
             methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
             allowedHeaders = "*",
             allowCredentials = "true")
public class HistoriaClinicaController {

    @Autowired
    private HistoriaClinicaService historiaClinicaService;

    @Autowired
    private PacienteService pacienteService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public List<HistoriaClinica> findAll() {
        return historiaClinicaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistoriaClinica> findById(@PathVariable Long id) {
        return historiaClinicaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<HistoriaClinica> findByPacienteId(@PathVariable Long pacienteId) {
        HistoriaClinica historiaClinica = historiaClinicaService.findByPacienteId(pacienteId);
        return historiaClinica != null ? ResponseEntity.ok(historiaClinica) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody HistoriaClinicaDTO historiaClinicaDTO) {
        try {
            // Convertir DTO a entidad
            HistoriaClinica historiaClinica = new HistoriaClinica();
            
            // Establecer paciente
            if (historiaClinicaDTO.getPaciente() != null && historiaClinicaDTO.getPaciente().getId() != null) {
                Paciente paciente = pacienteService.findById(historiaClinicaDTO.getPaciente().getId())
                    .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
                historiaClinica.setPaciente(paciente);
            }
            
            // Establecer usuario
            if (historiaClinicaDTO.getUsuario() != null && historiaClinicaDTO.getUsuario().getId() != null) {
                Usuario usuario = usuarioService.findById(historiaClinicaDTO.getUsuario().getId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                historiaClinica.setUsuario(usuario);
            }
            
            // Establecer campos básicos
            historiaClinica.setMotivoConsulta(historiaClinicaDTO.getMotivoConsulta());
            historiaClinica.setCepilladoDental(historiaClinicaDTO.getCepilladoDental());
            historiaClinica.setCepilladoEncias(historiaClinicaDTO.getCepilladoEncias());
            historiaClinica.setCepilladoLingual(historiaClinicaDTO.getCepilladoLingual());
            historiaClinica.setObservacionesHigienicas(historiaClinicaDTO.getObservacionesHigienicas());
            historiaClinica.setUsaHiloDental(historiaClinicaDTO.getUsaHiloDental());
            historiaClinica.setHigieneProtesica(historiaClinicaDTO.getHigieneProtesica());
            historiaClinica.setEnfermedadesActuales(historiaClinicaDTO.getEnfermedadesActuales());
            historiaClinica.setMedicamentos(historiaClinicaDTO.getMedicamentos());
            historiaClinica.setAlergias(historiaClinicaDTO.getAlergias());
            historiaClinica.setPosologia(historiaClinicaDTO.getPosologia());
            historiaClinica.setAntecedentesFamiliares(historiaClinicaDTO.getAntecedentesFamiliares());
            historiaClinica.setEnTratamiento(historiaClinicaDTO.getEnTratamiento());
            historiaClinica.setTomaBifosfonatos(historiaClinicaDTO.getTomaBifosfonatos());
            historiaClinica.setApreciacionGeneral(historiaClinicaDTO.getApreciacionGeneral());
            historiaClinica.setApreciacionGeneralDetalle(historiaClinicaDTO.getApreciacionGeneralDetalle());
            historiaClinica.setExamenRegional(historiaClinicaDTO.getExamenRegional());
            historiaClinica.setExamenRegionalDetalle(historiaClinicaDTO.getExamenRegionalDetalle());
            historiaClinica.setExamenLocal(historiaClinicaDTO.getExamenLocal());
            historiaClinica.setExamenLocalDetalle(historiaClinicaDTO.getExamenLocalDetalle());
            historiaClinica.setFumador(historiaClinicaDTO.getFumador());
            historiaClinica.setConsumeCafe(historiaClinicaDTO.getConsumeCafe());
            historiaClinica.setConsumeTe(historiaClinicaDTO.getConsumeTe());
            historiaClinica.setConsumeMate(historiaClinicaDTO.getConsumeMate());
            historiaClinica.setConsumeAlcohol(historiaClinicaDTO.getConsumeAlcohol());
            historiaClinica.setConsumeDrogas(historiaClinicaDTO.getConsumeDrogas());
            
            // Convertir objetos complejos a JSON
            if (historiaClinicaDTO.getExamenRegionalDetalles() != null) {
                historiaClinica.setExamenRegionalDetalles(objectMapper.writeValueAsString(historiaClinicaDTO.getExamenRegionalDetalles()));
            }
            
            if (historiaClinicaDTO.getContinenteDetalles() != null) {
                historiaClinica.setContinenteDetalles(objectMapper.writeValueAsString(historiaClinicaDTO.getContinenteDetalles()));
            }
            
            HistoriaClinica savedHistoria = historiaClinicaService.save(historiaClinica);
            return ResponseEntity.ok(savedHistoria);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al guardar la historia clínica: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<HistoriaClinica> update(@PathVariable Long id, @RequestBody HistoriaClinica historiaClinica) {
        return historiaClinicaService.findById(id)
                .map(existingHistoria -> {
                    historiaClinica.setId(id);
                    return ResponseEntity.ok(historiaClinicaService.save(historiaClinica));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return historiaClinicaService.findById(id)
                .map(historiaClinica -> {
                    historiaClinicaService.deleteById(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 