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

        // Validar que la fecha no sea null
        if (diagnosticoDTO.getFechaDiagnostico() == null) {
            throw new RuntimeException("La fecha del diagnóstico es obligatoria");
        }

        // Debug: Imprimir la fecha recibida
        System.out.println("Fecha recibida en DTO: " + diagnosticoDTO.getFechaDiagnostico());
        System.out.println("Tipo de fecha: " + (diagnosticoDTO.getFechaDiagnostico() != null ? diagnosticoDTO.getFechaDiagnostico().getClass().getName() : "null"));

        // Crear entidad Diagnostico
        Diagnostico diagnostico = new Diagnostico();
        diagnostico.setPaciente(paciente);
        diagnostico.setUsuario(usuario);
        diagnostico.setFechaDiagnostico(diagnosticoDTO.getFechaDiagnostico());
        diagnostico.setDiagnostico(diagnosticoDTO.getDiagnostico());
        diagnostico.setPronostico(diagnosticoDTO.getPronostico());
        diagnostico.setObservaciones(diagnosticoDTO.getObservaciones());

        // Debug: Imprimir la fecha que se va a guardar
        System.out.println("Fecha que se va a guardar: " + diagnostico.getFechaDiagnostico());

        // Guardar y retornar
        Diagnostico diagnosticoGuardado = diagnosticoRepository.save(diagnostico);
        System.out.println("Fecha guardada en BD: " + diagnosticoGuardado.getFechaDiagnostico());
        return diagnosticoGuardado;
    }

    // Actualizar diagnóstico existente
    public Diagnostico actualizarDiagnostico(Long id, DiagnosticoDTO diagnosticoDTO) {
        // Verificar que el diagnóstico existe
        Diagnostico diagnosticoExistente = diagnosticoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diagnóstico no encontrado"));

        // Validar que la fecha no sea null
        if (diagnosticoDTO.getFechaDiagnostico() == null) {
            throw new RuntimeException("La fecha del diagnóstico es obligatoria");
        }

        // Debug: Imprimir la fecha recibida para actualización
        System.out.println("Actualizando diagnóstico ID: " + id);
        System.out.println("Fecha recibida para actualizar: " + diagnosticoDTO.getFechaDiagnostico());
        System.out.println("Fecha anterior: " + diagnosticoExistente.getFechaDiagnostico());

        // Actualizar campos
        diagnosticoExistente.setFechaDiagnostico(diagnosticoDTO.getFechaDiagnostico());
        diagnosticoExistente.setDiagnostico(diagnosticoDTO.getDiagnostico());
        diagnosticoExistente.setPronostico(diagnosticoDTO.getPronostico());
        diagnosticoExistente.setObservaciones(diagnosticoDTO.getObservaciones());

        // Debug: Imprimir la fecha que se va a guardar
        System.out.println("Fecha que se va a guardar en actualización: " + diagnosticoExistente.getFechaDiagnostico());

        // Guardar y retornar
        Diagnostico diagnosticoActualizado = diagnosticoRepository.save(diagnosticoExistente);
        System.out.println("Fecha guardada después de actualización: " + diagnosticoActualizado.getFechaDiagnostico());
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