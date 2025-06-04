package com.consultorio.odontologia.service;

import com.consultorio.odontologia.dto.PacienteDTO;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    public Paciente registrarPaciente(PacienteDTO pacienteDTO) {
        Paciente paciente = new Paciente();
        if (pacienteDTO.getCedula() != null && !pacienteDTO.getCedula().trim().isEmpty()) {
            try {
                paciente.setCI(Long.parseLong(pacienteDTO.getCedula().trim()));
            } catch (NumberFormatException e) {
                throw new RuntimeException("La cédula debe ser un número válido");
            }
        } else {
            throw new RuntimeException("La cédula es obligatoria");
        }
        
        paciente.setName(pacienteDTO.getNombre());
        paciente.setLastname(pacienteDTO.getApellido());
        paciente.setGender(pacienteDTO.getSexo());
        paciente.setTelephone(pacienteDTO.getNumero() != null && !pacienteDTO.getNumero().isEmpty() ? Integer.parseInt(pacienteDTO.getNumero()) : 0);
        paciente.setEmail(pacienteDTO.getEmail());
        paciente.setDiagnosis(pacienteDTO.getConsulta());
        paciente.setGeneralMedicalHistory(pacienteDTO.getDireccion());
        paciente.setReleaseSummary(pacienteDTO.getFecha());
        paciente.setMedication("");
        paciente.setDentalHistory("");
        return pacienteRepository.save(paciente);
    }

    public List<Paciente> obtenerTodosLosPacientes() {
        return pacienteRepository.findAll();
    }

    public Paciente obtenerPacientePorId(Long id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));
    }
} 