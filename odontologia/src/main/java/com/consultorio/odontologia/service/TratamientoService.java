package com.consultorio.odontologia.service;

import com.consultorio.odontologia.dto.TratamientoDTO;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.entity.Tratamiento;
import com.consultorio.odontologia.repository.PacienteRepository;
import com.consultorio.odontologia.repository.TratamientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
@Transactional
public class TratamientoService {

    @Autowired
    private TratamientoRepository tratamientoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    // Crear nuevo tratamiento
    public Tratamiento crearTratamiento(TratamientoDTO tratamientoDTO) {
        // Verificar que el paciente existe
        Paciente paciente = pacienteRepository.findById(tratamientoDTO.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        // Crear entidad Tratamiento
        Tratamiento tratamiento = new Tratamiento();
        tratamiento.setPaciente(paciente);
        tratamiento.setNombre(tratamientoDTO.getNombre());
        tratamiento.setDescripcion(tratamientoDTO.getDescripcion());
        tratamiento.setDuracion(tratamientoDTO.getDuracion());
        tratamiento.setFechaInicio(tratamientoDTO.getFechaInicio());
        tratamiento.setFechaFin(tratamientoDTO.getFechaFin());
        tratamiento.setSeguimiento(tratamientoDTO.getSeguimiento());
        tratamiento.setActivo(tratamientoDTO.isActivo());

        // Guardar y retornar
        Tratamiento tratamientoGuardado = tratamientoRepository.save(tratamiento);
        return tratamientoGuardado;
    }

    // Obtener tratamientos de un paciente
    public List<Tratamiento> obtenerTratamientosPorPaciente(Long pacienteId) {
        List<Tratamiento> tratamientos = tratamientoRepository.findByPacienteIdOrderByFechaInicioDesc(pacienteId);
        return tratamientos;
    }

    // Obtener tratamiento activo de un paciente
    public Optional<Tratamiento> obtenerTratamientoActivo(Long pacienteId) {
        Optional<Tratamiento> tratamiento = tratamientoRepository.findByPacienteIdAndActivoTrue(pacienteId);
        return tratamiento;
    }

    // Obtener tratamiento por ID
    public Tratamiento obtenerTratamientoPorId(Long id) {
        return tratamientoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tratamiento no encontrado"));
    }

    // Actualizar tratamiento existente
    public Tratamiento actualizarTratamiento(Long id, TratamientoDTO tratamientoDTO) {
        // Verificar que el tratamiento existe
        Tratamiento tratamientoExistente = obtenerTratamientoPorId(id);

        // Actualizar campos
        if (tratamientoDTO.getNombre() != null) {
            tratamientoExistente.setNombre(tratamientoDTO.getNombre());
        }
        if (tratamientoDTO.getDescripcion() != null) {
            tratamientoExistente.setDescripcion(tratamientoDTO.getDescripcion());
        }
        if (tratamientoDTO.getDuracion() != null) {
            tratamientoExistente.setDuracion(tratamientoDTO.getDuracion());
        }
        if (tratamientoDTO.getFechaInicio() != null) {
            tratamientoExistente.setFechaInicio(tratamientoDTO.getFechaInicio());
        }
        if (tratamientoDTO.getFechaFin() != null) {
            tratamientoExistente.setFechaFin(tratamientoDTO.getFechaFin());
        }
        if (tratamientoDTO.getSeguimiento() != null) {
            tratamientoExistente.setSeguimiento(tratamientoDTO.getSeguimiento());
        }

        // Guardar y retornar
        Tratamiento tratamientoActualizado = tratamientoRepository.save(tratamientoExistente);
        return tratamientoActualizado;
    }

    // Desactivar tratamiento
    public void desactivarTratamiento(Long id) {
        Tratamiento tratamiento = obtenerTratamientoPorId(id);
        tratamiento.setActivo(false);
        tratamientoRepository.save(tratamiento);
    }

    // Activar tratamiento
    public void activarTratamiento(Long id) {
        Tratamiento tratamiento = obtenerTratamientoPorId(id);
        tratamiento.setActivo(true);
        tratamientoRepository.save(tratamiento);
    }

    // Eliminar tratamiento
    public void eliminarTratamiento(Long id) {
        if (!tratamientoRepository.existsById(id)) {
            throw new RuntimeException("Tratamiento no encontrado");
        }
        tratamientoRepository.deleteById(id);
    }

    // Buscar tratamientos por nombre
    public List<Tratamiento> buscarTratamientosPorNombre(Long pacienteId, String nombre) {
        List<Tratamiento> tratamientos = tratamientoRepository.findByPacienteIdAndNombreContainingIgnoreCase(pacienteId, nombre);
        return tratamientos;
    }

    // Obtener estadísticas de tratamientos
    public Map<String, Object> obtenerEstadisticasTratamientos(Long pacienteId) {
        long totalTratamientos = tratamientoRepository.countByPacienteId(pacienteId);
        long tratamientosActivos = tratamientoRepository.countByPacienteIdAndActivoTrue(pacienteId);
        long tratamientosInactivos = totalTratamientos - tratamientosActivos;

        Map<String, Object> estadisticas = new HashMap<>();
        estadisticas.put("totalTratamientos", totalTratamientos);
        estadisticas.put("tratamientosActivos", tratamientosActivos);
        estadisticas.put("tratamientosInactivos", tratamientosInactivos);
        estadisticas.put("pacienteId", pacienteId);

        return estadisticas;
    }

    // Desactivar tratamientos activos de un paciente
    public void desactivarTratamientosActivos(Long pacienteId) {
        List<Tratamiento> tratamientosActivos = tratamientoRepository.findByPacienteIdAndActivoTrueOrderByFechaInicioDesc(pacienteId);
        
        for (Tratamiento tratamiento : tratamientosActivos) {
            tratamiento.setActivo(false);
        }
        
        tratamientoRepository.saveAll(tratamientosActivos);
    }
} 