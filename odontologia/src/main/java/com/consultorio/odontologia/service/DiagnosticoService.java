package com.consultorio.odontologia.service;

import com.consultorio.odontologia.dto.DiagnosticoDTO;
import com.consultorio.odontologia.entity.Diagnostico;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.entity.Usuario;
import com.consultorio.odontologia.repository.DiagnosticoRepository;
import com.consultorio.odontologia.repository.PacienteRepository;
import com.consultorio.odontologia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DiagnosticoService {
    
    private static final Logger logger = LoggerFactory.getLogger(DiagnosticoService.class);
    
    @Autowired
    private DiagnosticoRepository diagnosticoRepository;
    
    @Autowired
    private PacienteRepository pacienteRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    /**
     * Crea un nuevo diagnóstico
     */
    public Diagnostico crearDiagnostico(DiagnosticoDTO diagnosticoDTO) {
        logger.info("Creando nuevo diagnóstico para paciente ID: {}", diagnosticoDTO.getPacienteId());
        
        // Validar que el paciente existe
        Paciente paciente = pacienteRepository.findById(diagnosticoDTO.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con ID: " + diagnosticoDTO.getPacienteId()));
        
        // Validar que el usuario existe (si se proporciona)
        Usuario usuario = null;
        if (diagnosticoDTO.getUsuarioId() != null) {
            usuario = usuarioRepository.findById(diagnosticoDTO.getUsuarioId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + diagnosticoDTO.getUsuarioId()));
        }
        
        // Validar campos obligatorios
        if (diagnosticoDTO.getDiagnostico() == null || diagnosticoDTO.getDiagnostico().trim().isEmpty()) {
            throw new RuntimeException("El diagnóstico es obligatorio");
        }
        
        if (diagnosticoDTO.getPronostico() == null || diagnosticoDTO.getPronostico().trim().isEmpty()) {
            throw new RuntimeException("El pronóstico es obligatorio");
        }
        
        // Si no se proporciona fecha, usar la fecha actual
        LocalDate fechaDiagnostico = diagnosticoDTO.getFechaDiagnostico();
        if (fechaDiagnostico == null) {
            fechaDiagnostico = LocalDate.now();
        }
        
        Diagnostico diagnostico = new Diagnostico(
                diagnosticoDTO.getDiagnostico(),
                diagnosticoDTO.getPronostico(),
                diagnosticoDTO.getObservaciones(),
                fechaDiagnostico,
                paciente,
                usuario
        );
        
        Diagnostico diagnosticoGuardado = diagnosticoRepository.save(diagnostico);
        logger.info("Diagnóstico creado exitosamente con ID: {}", diagnosticoGuardado.getId());
        
        return diagnosticoGuardado;
    }
    
    /**
     * Actualiza un diagnóstico existente
     */
    public Diagnostico actualizarDiagnostico(Long id, DiagnosticoDTO diagnosticoDTO) {
        logger.info("Actualizando diagnóstico con ID: {}", id);
        
        Diagnostico diagnosticoExistente = diagnosticoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diagnóstico no encontrado con ID: " + id));
        
        // Validar campos obligatorios
        if (diagnosticoDTO.getDiagnostico() == null || diagnosticoDTO.getDiagnostico().trim().isEmpty()) {
            throw new RuntimeException("El diagnóstico es obligatorio");
        }
        
        if (diagnosticoDTO.getPronostico() == null || diagnosticoDTO.getPronostico().trim().isEmpty()) {
            throw new RuntimeException("El pronóstico es obligatorio");
        }
        
        // Actualizar campos
        diagnosticoExistente.setDiagnostico(diagnosticoDTO.getDiagnostico());
        diagnosticoExistente.setPronostico(diagnosticoDTO.getPronostico());
        diagnosticoExistente.setObservaciones(diagnosticoDTO.getObservaciones());
        
        if (diagnosticoDTO.getFechaDiagnostico() != null) {
            diagnosticoExistente.setFechaDiagnostico(diagnosticoDTO.getFechaDiagnostico());
        }
        
        Diagnostico diagnosticoActualizado = diagnosticoRepository.save(diagnosticoExistente);
        logger.info("Diagnóstico actualizado exitosamente con ID: {}", diagnosticoActualizado.getId());
        
        return diagnosticoActualizado;
    }
    
    /**
     * Obtiene el diagnóstico más reciente de un paciente
     */
    public Optional<Diagnostico> obtenerDiagnosticoReciente(Long pacienteId) {
        logger.info("Obteniendo diagnóstico más reciente para paciente ID: {}", pacienteId);
        
        Optional<Diagnostico> diagnostico = diagnosticoRepository.findFirstByPacienteIdOrderByFechaDiagnosticoDesc(pacienteId);
        
        if (diagnostico.isPresent()) {
            logger.info("Diagnóstico encontrado con ID: {}", diagnostico.get().getId());
        } else {
            logger.info("No se encontró diagnóstico para paciente ID: {}", pacienteId);
        }
        
        return diagnostico;
    }
    
    /**
     * Obtiene todos los diagnósticos de un paciente
     */
    public List<Diagnostico> obtenerDiagnosticosPorPaciente(Long pacienteId) {
        logger.info("Obteniendo todos los diagnósticos para paciente ID: {}", pacienteId);
        
        List<Diagnostico> diagnosticos = diagnosticoRepository.findByPacienteIdOrderByFechaDiagnosticoDesc(pacienteId);
        
        logger.info("Encontrados {} diagnósticos para paciente ID: {}", diagnosticos.size(), pacienteId);
        
        return diagnosticos;
    }
    
    /**
     * Obtiene un diagnóstico por ID
     */
    public Diagnostico obtenerDiagnosticoPorId(Long id) {
        logger.info("Obteniendo diagnóstico con ID: {}", id);
        
        return diagnosticoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diagnóstico no encontrado con ID: " + id));
    }
    
    /**
     * Elimina un diagnóstico
     */
    public void eliminarDiagnostico(Long id) {
        logger.info("Eliminando diagnóstico con ID: {}", id);
        
        if (!diagnosticoRepository.existsById(id)) {
            throw new RuntimeException("Diagnóstico no encontrado con ID: " + id);
        }
        
        diagnosticoRepository.deleteById(id);
        logger.info("Diagnóstico eliminado exitosamente con ID: {}", id);
    }
    
    /**
     * Busca diagnósticos por contenido del diagnóstico
     */
    public List<Diagnostico> buscarPorContenidoDiagnostico(Long pacienteId, String contenido) {
        logger.info("Buscando diagnósticos por contenido '{}' para paciente ID: {}", contenido, pacienteId);
        
        List<Diagnostico> diagnosticos = diagnosticoRepository.findByPacienteIdAndDiagnosticoContainingIgnoreCase(pacienteId, contenido);
        
        logger.info("Encontrados {} diagnósticos que coinciden con la búsqueda", diagnosticos.size());
        
        return diagnosticos;
    }
    
    /**
     * Busca diagnósticos por contenido del pronóstico
     */
    public List<Diagnostico> buscarPorContenidoPronostico(Long pacienteId, String contenido) {
        logger.info("Buscando diagnósticos por contenido de pronóstico '{}' para paciente ID: {}", contenido, pacienteId);
        
        List<Diagnostico> diagnosticos = diagnosticoRepository.findByPacienteIdAndPronosticoContainingIgnoreCase(pacienteId, contenido);
        
        logger.info("Encontrados {} diagnósticos que coinciden con la búsqueda", diagnosticos.size());
        
        return diagnosticos;
    }
    
    /**
     * Cuenta los diagnósticos de un paciente
     */
    public long contarDiagnosticosPorPaciente(Long pacienteId) {
        logger.info("Contando diagnósticos para paciente ID: {}", pacienteId);
        
        long count = diagnosticoRepository.countByPacienteId(pacienteId);
        
        logger.info("Paciente ID {} tiene {} diagnósticos", pacienteId, count);
        
        return count;
    }
} 