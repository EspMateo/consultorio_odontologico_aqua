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
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DiagnosticoService {

    @Autowired
    private DiagnosticoRepository diagnosticoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Crear nuevo diagnóstico
    public Diagnostico crearDiagnostico(DiagnosticoDTO diagnosticoDTO) {
        // Verificar que el paciente existe
        Paciente paciente = pacienteRepository.findById(diagnosticoDTO.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado"));

        // Verificar que el usuario existe
        Usuario usuario = usuarioRepository.findById(diagnosticoDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Crear entidad Diagnostico
        Diagnostico diagnostico = new Diagnostico();
        diagnostico.setPaciente(paciente);
        diagnostico.setUsuario(usuario);
        diagnostico.setFechaDiagnostico(LocalDate.now());
        diagnostico.setDiagnostico(diagnosticoDTO.getDiagnostico());
        diagnostico.setPronostico(diagnosticoDTO.getPronostico());
        diagnostico.setObservaciones(diagnosticoDTO.getObservaciones());

        // Guardar y retornar
        Diagnostico diagnosticoGuardado = diagnosticoRepository.save(diagnostico);
        return diagnosticoGuardado;
    }

    // Actualizar diagnóstico existente
    public Diagnostico actualizarDiagnostico(Long id, DiagnosticoDTO diagnosticoDTO) {
        // Verificar que el diagnóstico existe
        Diagnostico diagnosticoExistente = diagnosticoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diagnóstico no encontrado"));

        // Actualizar campos
        diagnosticoExistente.setDiagnostico(diagnosticoDTO.getDiagnostico());
        diagnosticoExistente.setPronostico(diagnosticoDTO.getPronostico());
        diagnosticoExistente.setObservaciones(diagnosticoDTO.getObservaciones());

        // Guardar y retornar
        Diagnostico diagnosticoActualizado = diagnosticoRepository.save(diagnosticoExistente);
        return diagnosticoActualizado;
    }

    // Obtener diagnóstico más reciente de un paciente
    public Optional<Diagnostico> obtenerDiagnosticoMasReciente(Long pacienteId) {
        return diagnosticoRepository.findFirstByPacienteIdOrderByFechaDiagnosticoDesc(pacienteId);
    }

    // Obtener todos los diagnósticos de un paciente
    public List<Diagnostico> obtenerDiagnosticosPorPaciente(Long pacienteId) {
        List<Diagnostico> diagnosticos = diagnosticoRepository.findByPacienteIdOrderByFechaDiagnosticoDesc(pacienteId);
        return diagnosticos;
    }

    // Obtener diagnóstico por ID
    public Diagnostico obtenerDiagnosticoPorId(Long id) {
        return diagnosticoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diagnóstico no encontrado"));
    }

    // Eliminar diagnóstico
    public void eliminarDiagnostico(Long id) {
        if (!diagnosticoRepository.existsById(id)) {
            throw new RuntimeException("Diagnóstico no encontrado");
        }
        diagnosticoRepository.deleteById(id);
    }

    // Buscar diagnósticos por contenido
    public List<Diagnostico> buscarDiagnosticosPorContenido(Long pacienteId, String contenido) {
        List<Diagnostico> diagnosticos = diagnosticoRepository.findByPacienteIdAndDiagnosticoContainingIgnoreCase(pacienteId, contenido);
        return diagnosticos;
    }

    // Buscar diagnósticos por contenido de pronóstico
    public List<Diagnostico> buscarDiagnosticosPorPronostico(Long pacienteId, String contenido) {
        List<Diagnostico> diagnosticos = diagnosticoRepository.findByPacienteIdAndPronosticoContainingIgnoreCase(pacienteId, contenido);
        return diagnosticos;
    }

    // Contar diagnósticos de un paciente
    public long contarDiagnosticosPorPaciente(Long pacienteId) {
        long count = diagnosticoRepository.countByPacienteId(pacienteId);
        return count;
    }
} 