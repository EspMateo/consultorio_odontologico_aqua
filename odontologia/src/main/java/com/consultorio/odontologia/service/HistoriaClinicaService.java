package com.consultorio.odontologia.service;

import com.consultorio.odontologia.entity.HistoriaClinica;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.entity.Usuario;
import com.consultorio.odontologia.repository.HistoriaClinicaRepository;
import com.consultorio.odontologia.repository.PacienteRepository;
import com.consultorio.odontologia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class HistoriaClinicaService {

    @Autowired
    private HistoriaClinicaRepository historiaClinicaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Obtener todas las historias clínicas
    public List<HistoriaClinica> obtenerTodas() {
        return historiaClinicaRepository.findAll();
    }

    // Obtener historia clínica por ID
    public Optional<HistoriaClinica> obtenerPorId(Long id) {
        return historiaClinicaRepository.findById(id);
    }

    // Obtener todas las historias clínicas de un paciente
    public List<HistoriaClinica> obtenerPorPaciente(Long pacienteId) {
        return historiaClinicaRepository.findByPacienteIdOrderByFechaCreacionDesc(pacienteId);
    }

    // Obtener la historia clínica más reciente de un paciente
    public Optional<HistoriaClinica> obtenerMasReciente(Long pacienteId) {
        return historiaClinicaRepository.findFirstByPacienteIdOrderByFechaCreacionDesc(pacienteId);
    }

    // Obtener historia clínica por paciente y fecha
    public Optional<HistoriaClinica> obtenerPorPacienteYFecha(Long pacienteId, LocalDate fecha) {
        return historiaClinicaRepository.findByPacienteIdAndFecha(pacienteId, fecha);
    }

    // Obtener la historia clínica más reciente de un paciente por fecha
    public Optional<HistoriaClinica> obtenerMasRecientePorPacienteYFecha(Long pacienteId, LocalDate fecha) {
        return historiaClinicaRepository.findMostRecentByPacienteIdAndFecha(pacienteId, fecha);
    }

    // Obtener fechas disponibles para un paciente
    public List<String> obtenerFechasDisponibles(Long pacienteId) {
        return historiaClinicaRepository.findFechasDisponiblesByPacienteId(pacienteId);
    }

    // Verificar si existe historia clínica para paciente y fecha
    public boolean existeHistoriaClinica(Long pacienteId, LocalDate fecha) {
        return historiaClinicaRepository.existsByPacienteIdAndFecha(pacienteId, fecha);
    }

    // Contar historias clínicas por paciente
    public long contarPorPaciente(Long pacienteId) {
        return historiaClinicaRepository.countByPacienteId(pacienteId);
    }

    // Guardar nueva historia clínica
    public HistoriaClinica guardar(HistoriaClinica historiaClinica) {
        // Validar que el paciente existe
        if (historiaClinica.getPaciente() == null || historiaClinica.getPaciente().getId() == null) {
            throw new IllegalArgumentException("El paciente es requerido");
        }

        Optional<Paciente> paciente = pacienteRepository.findById(historiaClinica.getPaciente().getId());
        if (paciente.isEmpty()) {
            throw new IllegalArgumentException("El paciente no existe");
        }

        // Asignar usuario si no está asignado
        if (historiaClinica.getUsuario() == null) {
            Optional<Usuario> usuario = usuarioRepository.findById(1L); // Usuario por defecto
            if (usuario.isPresent()) {
                historiaClinica.setUsuario(usuario.get());
            }
        }

        // Establecer timestamps
        historiaClinica.setFechaCreacion(LocalDateTime.now());
        historiaClinica.setFechaActualizacion(LocalDateTime.now());

        return historiaClinicaRepository.save(historiaClinica);
    }

    // Actualizar historia clínica existente
    public HistoriaClinica actualizar(Long id, HistoriaClinica historiaClinica) {
        Optional<HistoriaClinica> existente = historiaClinicaRepository.findById(id);
        if (existente.isEmpty()) {
            throw new IllegalArgumentException("Historia clínica no encontrada");
        }

        HistoriaClinica actualizada = existente.get();
        
        // Actualizar campos
        actualizada.setMotivoConsulta(historiaClinica.getMotivoConsulta());
        actualizada.setCepilladoDental(historiaClinica.getCepilladoDental());
        actualizada.setCepilladoEncias(historiaClinica.getCepilladoEncias());
        actualizada.setCepilladoLingual(historiaClinica.getCepilladoLingual());
        actualizada.setObservacionesHigienicas(historiaClinica.getObservacionesHigienicas());
        actualizada.setUsaHiloDental(historiaClinica.getUsaHiloDental());
        actualizada.setHigieneProtesica(historiaClinica.getHigieneProtesica());
        actualizada.setFumador(historiaClinica.getFumador());
        actualizada.setConsumeCafe(historiaClinica.getConsumeCafe());
        actualizada.setConsumeTe(historiaClinica.getConsumeTe());
        actualizada.setConsumeMate(historiaClinica.getConsumeMate());
        actualizada.setConsumeAlcohol(historiaClinica.getConsumeAlcohol());
        actualizada.setConsumeDrogas(historiaClinica.getConsumeDrogas());
        actualizada.setEnfermedadesActuales(historiaClinica.getEnfermedadesActuales());
        actualizada.setMedicamentos(historiaClinica.getMedicamentos());
        actualizada.setAlergias(historiaClinica.getAlergias());
        actualizada.setPosologia(historiaClinica.getPosologia());
        actualizada.setAntecedentesFamiliares(historiaClinica.getAntecedentesFamiliares());
        actualizada.setEnTratamiento(historiaClinica.getEnTratamiento());
        actualizada.setTomaBifosfonatos(historiaClinica.getTomaBifosfonatos());
        actualizada.setApreciacionGeneral(historiaClinica.getApreciacionGeneral());
        actualizada.setApreciacionGeneralDetalle(historiaClinica.getApreciacionGeneralDetalle());
        actualizada.setExamenRegional(historiaClinica.getExamenRegional());
        actualizada.setExamenRegionalDetalle(historiaClinica.getExamenRegionalDetalle());
        actualizada.setExamenRegionalDetalles(historiaClinica.getExamenRegionalDetalles());
        actualizada.setExamenLocal(historiaClinica.getExamenLocal());
        actualizada.setExamenLocalDetalle(historiaClinica.getExamenLocalDetalle());
        actualizada.setContinenteDetalles(historiaClinica.getContinenteDetalles());
        
        // Actualizar timestamp
        actualizada.setFechaActualizacion(LocalDateTime.now());

        return historiaClinicaRepository.save(actualizada);
    }

    // Eliminar historia clínica
    public void eliminar(Long id) {
        if (!historiaClinicaRepository.existsById(id)) {
            throw new IllegalArgumentException("Historia clínica no encontrada");
        }
        historiaClinicaRepository.deleteById(id);
    }

    // Crear o actualizar historia clínica
    public HistoriaClinica crearOActualizar(HistoriaClinica historiaClinica) {
        if (historiaClinica.getId() != null) {
            return actualizar(historiaClinica.getId(), historiaClinica);
        } else {
            return guardar(historiaClinica);
        }
    }
} 