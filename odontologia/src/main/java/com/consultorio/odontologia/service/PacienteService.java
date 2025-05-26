package com.consultorio.odontologia.service;

import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

    public Paciente save(Paciente paciente) {
        // Validaciones básicas
        if (paciente.getCI() == null || paciente.getName() == null || paciente.getLastname() == null) {
            throw new IllegalArgumentException("CI, nombre y apellido son obligatorios");
        }
        
        // Verificar si ya existe un paciente con el mismo CI
        if (pacienteRepository.existsByCI(paciente.getCI())) {
            throw new IllegalArgumentException("Ya existe un paciente con ese CI");
        }

        return pacienteRepository.save(paciente);
    }
} 