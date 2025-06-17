package com.consultorio.odontologia.service;

import com.consultorio.odontologia.entity.HistoriaClinica;
import com.consultorio.odontologia.repository.HistoriaClinicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HistoriaClinicaService {

    @Autowired
    private HistoriaClinicaRepository historiaClinicaRepository;

    public List<HistoriaClinica> findAll() {
        return historiaClinicaRepository.findAll();
    }

    public Optional<HistoriaClinica> findById(Long id) {
        return historiaClinicaRepository.findById(id);
    }

    public HistoriaClinica findByPacienteId(Long pacienteId) {
        return historiaClinicaRepository.findByPacienteId(pacienteId);
    }

    public HistoriaClinica save(HistoriaClinica historiaClinica) {
        return historiaClinicaRepository.save(historiaClinica);
    }

    public void deleteById(Long id) {
        historiaClinicaRepository.deleteById(id);
    }
} 