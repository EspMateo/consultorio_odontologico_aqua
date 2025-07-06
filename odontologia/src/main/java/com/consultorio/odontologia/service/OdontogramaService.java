package com.consultorio.odontologia.service;

import com.consultorio.odontologia.entity.Odontograma;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.repository.OdontogramaRepository;
import com.consultorio.odontologia.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OdontogramaService {
    
    @Autowired
    private OdontogramaRepository odontogramaRepository;
    
    @Autowired
    private PacienteRepository pacienteRepository;
    
    /**
     * Guardar un nuevo odontograma
     */
    public Odontograma guardarOdontograma(Odontograma odontograma) {
        if (odontograma.getFechaCreacion() == null) {
            odontograma.setFechaCreacion(LocalDateTime.now());
        }
        return odontogramaRepository.save(odontograma);
    }
    
    /**
     * Obtener todos los odontogramas de un paciente ordenados por fecha
     */
    public List<Odontograma> obtenerOdontogramasPaciente(Long pacienteId) {
        return odontogramaRepository.findByPacienteIdOrderByFechaCreacionDesc(pacienteId);
    }
    
    /**
     * Obtener un odontograma específico por ID
     */
    public Odontograma obtenerOdontogramaPorId(Long id) {
        return odontogramaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Odontograma no encontrado con ID: " + id));
    }
    
    /**
     * Obtener el odontograma más reciente de un paciente
     */
    public Optional<Odontograma> obtenerOdontogramaMasReciente(Long pacienteId) {
        List<Odontograma> odontogramas = odontogramaRepository.findByPacienteIdOrderByFechaCreacionDesc(pacienteId);
        return odontogramas.isEmpty() ? Optional.empty() : Optional.of(odontogramas.get(0));
    }
    
    /**
     * Actualizar un odontograma existente
     */
    public Odontograma actualizarOdontograma(Long id, Odontograma odontogramaActualizado) {
        Odontograma odontogramaExistente = obtenerOdontogramaPorId(id);
        
        odontogramaExistente.setTipoDenticion(odontogramaActualizado.getTipoDenticion());
        odontogramaExistente.setDatosDientes(odontogramaActualizado.getDatosDientes());
        odontogramaExistente.setObservaciones(odontogramaActualizado.getObservaciones());
        
        return odontogramaRepository.save(odontogramaExistente);
    }
    
    /**
     * Eliminar un odontograma
     */
    public void eliminarOdontograma(Long id) {
        if (!odontogramaRepository.existsById(id)) {
            throw new RuntimeException("Odontograma no encontrado con ID: " + id);
        }
        odontogramaRepository.deleteById(id);
    }
    
    /**
     * Contar odontogramas de un paciente
     */
    public long contarOdontogramasPaciente(Long pacienteId) {
        return odontogramaRepository.countByPacienteId(pacienteId);
    }
    
    /**
     * Verificar si un paciente existe antes de crear odontograma
     */
    public boolean pacienteExiste(Long pacienteId) {
        return pacienteRepository.existsById(pacienteId);
    }
} 