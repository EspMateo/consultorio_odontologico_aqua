package com.consultorio.odontologia.service;

import com.consultorio.odontologia.dto.CitaDTO;
import com.consultorio.odontologia.entity.Cita;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.entity.Usuario;
import com.consultorio.odontologia.repository.CitaRepository;
import com.consultorio.odontologia.repository.PacienteRepository;
import com.consultorio.odontologia.repository.UsuarioRepository;
import com.consultorio.odontologia.service.util.DTOConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CitaService {
    
    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Cita crearCita(CitaDTO citaDTO) {
        Paciente paciente = pacienteRepository.findById(citaDTO.getPaciente().getId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        Usuario usuario = usuarioRepository.findById(citaDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Cita cita = new Cita();
        cita.setPaciente(paciente);
        cita.setFecha(LocalDate.parse(citaDTO.getFecha()));
        cita.setHora(LocalTime.parse(citaDTO.getHora()));
        cita.setMotivo(citaDTO.getMotivo());
        cita.setUsuario(usuario);

        return citaRepository.save(cita);
    }

    public List<CitaDTO> obtenerTodasLasCitas() {
        List<Cita> citas = citaRepository.findAllWithPaciente();
        return citas.stream()
                .map(DTOConverter::convertirCitaADTO)
                .collect(Collectors.toList());
    }

    public List<CitaDTO> obtenerCitasPorFecha(String fecha) {
        LocalDate fechaLocal = LocalDate.parse(fecha);
        List<Cita> citas = citaRepository.findByFechaWithPaciente(fechaLocal);
        return citas.stream()
                .map(DTOConverter::convertirCitaADTO)
                .collect(Collectors.toList());
    }

    public void eliminarCita(Long id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada con ID: " + id));
        citaRepository.delete(cita);
    }

    public Cita actualizarCita(Long id, CitaDTO citaDTO) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada con ID: " + id));

        Paciente paciente = pacienteRepository.findById(citaDTO.getPaciente().getId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        Usuario usuario = usuarioRepository.findById(citaDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        cita.setPaciente(paciente);
        cita.setFecha(LocalDate.parse(citaDTO.getFecha()));
        cita.setHora(LocalTime.parse(citaDTO.getHora()));
        cita.setMotivo(citaDTO.getMotivo());
        cita.setUsuario(usuario);

        return citaRepository.save(cita);
    }
}
