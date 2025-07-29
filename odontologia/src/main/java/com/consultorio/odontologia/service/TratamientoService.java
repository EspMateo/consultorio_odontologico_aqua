package com.consultorio.odontologia.service;

import com.consultorio.odontologia.dto.TratamientoDTO;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.entity.Tratamiento;
import com.consultorio.odontologia.repository.PacienteRepository;
import com.consultorio.odontologia.repository.TratamientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TratamientoService {
    
    private static final Logger logger = LoggerFactory.getLogger(TratamientoService.class);
    
    @Autowired
    private TratamientoRepository tratamientoRepository;
    
    @Autowired
    private PacienteRepository pacienteRepository;
    
    /**
     * Crea un nuevo tratamiento
     */
    public Tratamiento crearTratamiento(TratamientoDTO tratamientoDTO) {
        logger.info("Creando nuevo tratamiento para paciente ID: {}", tratamientoDTO.getPacienteId());
        
        // Validar que el paciente existe
        Paciente paciente = pacienteRepository.findById(tratamientoDTO.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con ID: " + tratamientoDTO.getPacienteId()));
        
        // Permitir múltiples tratamientos activos - no desactivar otros
        Tratamiento tratamiento = new Tratamiento(
                tratamientoDTO.getNombre(),
                tratamientoDTO.getDescripcion(),
                tratamientoDTO.getDuracion(),
                tratamientoDTO.getFechaInicio(),
                tratamientoDTO.getFechaFin(),
                tratamientoDTO.getSeguimiento(),
                tratamientoDTO.isActivo(),
                paciente
        );
        
        Tratamiento tratamientoGuardado = tratamientoRepository.save(tratamiento);
        logger.info("Tratamiento creado exitosamente con ID: {}", tratamientoGuardado.getId());
        
        return tratamientoGuardado;
    }
    
    /**
     * Obtiene todos los tratamientos de un paciente
     */
    public List<Tratamiento> obtenerTratamientosPorPaciente(Long pacienteId) {
        logger.info("Obteniendo tratamientos para paciente ID: {}", pacienteId);
        
        // Validar que el paciente existe
        if (!pacienteRepository.existsById(pacienteId)) {
            throw new RuntimeException("Paciente no encontrado con ID: " + pacienteId);
        }
        
        List<Tratamiento> tratamientos = tratamientoRepository.findByPacienteIdOrderByFechaInicioDesc(pacienteId);
        logger.info("Encontrados {} tratamientos para paciente ID: {}", tratamientos.size(), pacienteId);
        
        return tratamientos;
    }
    
    /**
     * Obtiene el tratamiento activo de un paciente
     */
    public Optional<Tratamiento> obtenerTratamientoActivo(Long pacienteId) {
        logger.info("Obteniendo tratamiento activo para paciente ID: {}", pacienteId);
        
        // Validar que el paciente existe
        if (!pacienteRepository.existsById(pacienteId)) {
            throw new RuntimeException("Paciente no encontrado con ID: " + pacienteId);
        }
        
        Optional<Tratamiento> tratamiento = tratamientoRepository.findByPacienteIdAndActivoTrue(pacienteId);
        logger.info("Tratamiento activo encontrado: {}", tratamiento.isPresent());
        
        return tratamiento;
    }
    
    /**
     * Obtiene un tratamiento por ID
     */
    public Tratamiento obtenerTratamientoPorId(Long id) {
        logger.info("Obteniendo tratamiento con ID: {}", id);
        
        return tratamientoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tratamiento no encontrado con ID: " + id));
    }
    
    /**
     * Actualiza un tratamiento existente
     */
    public Tratamiento actualizarTratamiento(Long id, TratamientoDTO tratamientoDTO) {
        logger.info("Actualizando tratamiento con ID: {}", id);
        
        Tratamiento tratamientoExistente = obtenerTratamientoPorId(id);
        
        // Permitir múltiples tratamientos activos - no desactivar otros
        // Actualizar campos
        tratamientoExistente.setNombre(tratamientoDTO.getNombre());
        tratamientoExistente.setDescripcion(tratamientoDTO.getDescripcion());
        tratamientoExistente.setDuracion(tratamientoDTO.getDuracion());
        tratamientoExistente.setFechaInicio(tratamientoDTO.getFechaInicio());
        tratamientoExistente.setFechaFin(tratamientoDTO.getFechaFin());
        tratamientoExistente.setSeguimiento(tratamientoDTO.getSeguimiento());
        tratamientoExistente.setActivo(tratamientoDTO.isActivo());
        
        Tratamiento tratamientoActualizado = tratamientoRepository.save(tratamientoExistente);
        logger.info("Tratamiento actualizado exitosamente con ID: {}", id);
        
        return tratamientoActualizado;
    }
    
    /**
     * Desactiva un tratamiento
     */
    public Tratamiento desactivarTratamiento(Long id) {
        logger.info("Desactivando tratamiento con ID: {}", id);
        
        Tratamiento tratamiento = obtenerTratamientoPorId(id);
        tratamiento.setActivo(false);
        
        Tratamiento tratamientoDesactivado = tratamientoRepository.save(tratamiento);
        logger.info("Tratamiento desactivado exitosamente con ID: {}", id);
        
        return tratamientoDesactivado;
    }
    
    /**
     * Activa un tratamiento (permite múltiples activos)
     */
    public Tratamiento activarTratamiento(Long id) {
        logger.info("Activando tratamiento con ID: {}", id);
        
        Tratamiento tratamiento = obtenerTratamientoPorId(id);
        
        // Activar este tratamiento sin desactivar otros
        tratamiento.setActivo(true);
        
        Tratamiento tratamientoActivado = tratamientoRepository.save(tratamiento);
        logger.info("Tratamiento activado exitosamente con ID: {}", id);
        
        return tratamientoActivado;
    }
    
    /**
     * Elimina un tratamiento
     */
    public void eliminarTratamiento(Long id) {
        logger.info("Eliminando tratamiento con ID: {}", id);
        
        if (!tratamientoRepository.existsById(id)) {
            throw new RuntimeException("Tratamiento no encontrado con ID: " + id);
        }
        
        tratamientoRepository.deleteById(id);
        logger.info("Tratamiento eliminado exitosamente con ID: {}", id);
    }
    
    /**
     * Busca tratamientos por nombre
     */
    public List<Tratamiento> buscarTratamientosPorNombre(Long pacienteId, String nombre) {
        logger.info("Buscando tratamientos para paciente ID: {} con nombre: {}", pacienteId, nombre);
        
        return tratamientoRepository.findByPacienteIdAndNombreContainingIgnoreCase(pacienteId, nombre);
    }
    
    /**
     * Obtiene estadísticas de tratamientos de un paciente
     */
    public TratamientoStats obtenerEstadisticasTratamientos(Long pacienteId) {
        logger.info("Obteniendo estadísticas de tratamientos para paciente ID: {}", pacienteId);
        
        long totalTratamientos = tratamientoRepository.countByPacienteId(pacienteId);
        long tratamientosActivos = tratamientoRepository.countByPacienteIdAndActivoTrue(pacienteId);
        long tratamientosInactivos = totalTratamientos - tratamientosActivos;
        
        return new TratamientoStats(totalTratamientos, tratamientosActivos, tratamientosInactivos);
    }
    
    /**
     * Desactiva todos los tratamientos activos de un paciente
     */
    private void desactivarTratamientosActivos(Long pacienteId) {
        logger.info("Desactivando tratamientos activos para paciente ID: {}", pacienteId);
        
        List<Tratamiento> tratamientosActivos = tratamientoRepository.findByPacienteIdAndActivoTrueOrderByFechaInicioDesc(pacienteId);
        
        for (Tratamiento tratamiento : tratamientosActivos) {
            tratamiento.setActivo(false);
            tratamientoRepository.save(tratamiento);
        }
        
        logger.info("Desactivados {} tratamientos activos", tratamientosActivos.size());
    }
    
    /**
     * Clase interna para estadísticas
     */
    public static class TratamientoStats {
        private final long totalTratamientos;
        private final long tratamientosActivos;
        private final long tratamientosInactivos;
        
        public TratamientoStats(long totalTratamientos, long tratamientosActivos, long tratamientosInactivos) {
            this.totalTratamientos = totalTratamientos;
            this.tratamientosActivos = tratamientosActivos;
            this.tratamientosInactivos = tratamientosInactivos;
        }
        
        // Getters
        public long getTotalTratamientos() { return totalTratamientos; }
        public long getTratamientosActivos() { return tratamientosActivos; }
        public long getTratamientosInactivos() { return tratamientosInactivos; }
    }
} 