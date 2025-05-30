package com.consultorio.odontologia.service;

import com.consultorio.odontologia.dto.PacienteDTO;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    public Paciente registrarPaciente(PacienteDTO pacienteDTO) {
        Paciente paciente = new Paciente();
        paciente.setCI(pacienteDTO.getCedula() != null && !pacienteDTO.getCedula().isEmpty() ? Long.parseLong(pacienteDTO.getCedula()) : null);
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
} 