package com.consultorio.odontologia.service;

import com.consultorio.odontologia.dto.DiagnosticoDTO;
import com.consultorio.odontologia.entity.Diagnostico;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.entity.Usuario;
import com.consultorio.odontologia.repository.DiagnosticoRepository;
import com.consultorio.odontologia.repository.PacienteRepository;
import com.consultorio.odontologia.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DiagnosticoServiceTest {

    @Mock
    private DiagnosticoRepository diagnosticoRepository;

    @Mock
    private PacienteRepository pacienteRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private DiagnosticoService diagnosticoService;

    private Paciente paciente;
    private Usuario usuario;
    private Diagnostico diagnostico;
    private DiagnosticoDTO diagnosticoDTO;

    @BeforeEach
    void setUp() {
        // Configurar datos de prueba
        paciente = new Paciente();
        paciente.setId(1L);
        paciente.setName("Juan");
        paciente.setLastname("Pérez");

        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setName("Dr. García");
        usuario.setEmail("dr.garcia@consultorio.com");

        diagnostico = new Diagnostico();
        diagnostico.setId(1L);
        diagnostico.setDiagnostico("Caries dental");
        diagnostico.setPronostico("Favorable con tratamiento");
        diagnostico.setObservaciones("Requiere empaste");
        diagnostico.setFechaDiagnostico(LocalDate.now());
        diagnostico.setPaciente(paciente);
        diagnostico.setUsuario(usuario);

        diagnosticoDTO = new DiagnosticoDTO();
        diagnosticoDTO.setDiagnostico("Caries dental");
        diagnosticoDTO.setPronostico("Favorable con tratamiento");
        diagnosticoDTO.setObservaciones("Requiere empaste");
        diagnosticoDTO.setPacienteId(1L);
        diagnosticoDTO.setUsuarioId(1L);
    }

    @Test
    void testCrearDiagnostico_Success() {
        // Arrange
        diagnosticoDTO.setFechaDiagnostico(LocalDate.now()); // Fecha obligatoria
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(diagnosticoRepository.save(any(Diagnostico.class))).thenReturn(diagnostico);

        // Act
        Diagnostico resultado = diagnosticoService.crearDiagnostico(diagnosticoDTO);

        // Assert
        assertNotNull(resultado);
        assertEquals("Caries dental", resultado.getDiagnostico());
        assertEquals("Favorable con tratamiento", resultado.getPronostico());
        assertEquals("Requiere empaste", resultado.getObservaciones());
        assertEquals(paciente, resultado.getPaciente());
        assertEquals(usuario, resultado.getUsuario());
        assertEquals(LocalDate.now(), resultado.getFechaDiagnostico());

        verify(pacienteRepository).findById(1L);
        verify(usuarioRepository).findById(1L);
        verify(diagnosticoRepository).save(any(Diagnostico.class));
    }

    @Test
    void testCrearDiagnostico_PacienteNoEncontrado() {
        // Arrange
        diagnosticoDTO.setFechaDiagnostico(LocalDate.now()); // Fecha obligatoria
        when(pacienteRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            diagnosticoService.crearDiagnostico(diagnosticoDTO);
        });

        assertEquals("Paciente no encontrado", exception.getMessage());
        verify(pacienteRepository).findById(1L);
        verify(usuarioRepository, never()).findById(any());
        verify(diagnosticoRepository, never()).save(any());
    }

    @Test
    void testCrearDiagnostico_UsuarioNoEncontrado() {
        // Arrange
        diagnosticoDTO.setFechaDiagnostico(LocalDate.now()); // Fecha obligatoria
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            diagnosticoService.crearDiagnostico(diagnosticoDTO);
        });

        assertEquals("Usuario no encontrado", exception.getMessage());
        verify(pacienteRepository).findById(1L);
        verify(usuarioRepository).findById(1L);
        verify(diagnosticoRepository, never()).save(any());
    }

    @Test
    void testActualizarDiagnostico_Success() {
        // Arrange
        DiagnosticoDTO dtoActualizado = new DiagnosticoDTO();
        dtoActualizado.setDiagnostico("Caries avanzada");
        dtoActualizado.setPronostico("Requiere endodoncia");
        dtoActualizado.setObservaciones("Dolor intenso");
        dtoActualizado.setFechaDiagnostico(LocalDate.now()); // Fecha obligatoria

        when(diagnosticoRepository.findById(1L)).thenReturn(Optional.of(diagnostico));
        when(diagnosticoRepository.save(any(Diagnostico.class))).thenReturn(diagnostico);

        // Act
        Diagnostico resultado = diagnosticoService.actualizarDiagnostico(1L, dtoActualizado);

        // Assert
        assertNotNull(resultado);
        verify(diagnosticoRepository).findById(1L);
        verify(diagnosticoRepository).save(diagnostico);
    }

    @Test
    void testActualizarDiagnostico_DiagnosticoNoEncontrado() {
        // Arrange
        diagnosticoDTO.setFechaDiagnostico(LocalDate.now()); // Fecha obligatoria
        when(diagnosticoRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            diagnosticoService.actualizarDiagnostico(1L, diagnosticoDTO);
        });

        assertEquals("Diagnóstico no encontrado", exception.getMessage());
        verify(diagnosticoRepository).findById(1L);
        verify(diagnosticoRepository, never()).save(any());
    }

    @Test
    void testObtenerDiagnosticoMasReciente_Success() {
        // Arrange
        when(diagnosticoRepository.findFirstByPacienteIdOrderByFechaDiagnosticoDesc(1L))
                .thenReturn(Optional.of(diagnostico));

        // Act
        Optional<Diagnostico> resultado = diagnosticoService.obtenerDiagnosticoMasReciente(1L);

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals(diagnostico, resultado.get());
        verify(diagnosticoRepository).findFirstByPacienteIdOrderByFechaDiagnosticoDesc(1L);
    }

    @Test
    void testObtenerDiagnosticoMasReciente_NoEncontrado() {
        // Arrange
        when(diagnosticoRepository.findFirstByPacienteIdOrderByFechaDiagnosticoDesc(1L))
                .thenReturn(Optional.empty());

        // Act
        Optional<Diagnostico> resultado = diagnosticoService.obtenerDiagnosticoMasReciente(1L);

        // Assert
        assertFalse(resultado.isPresent());
        verify(diagnosticoRepository).findFirstByPacienteIdOrderByFechaDiagnosticoDesc(1L);
    }

    @Test
    void testObtenerDiagnosticosPorPaciente_Success() {
        // Arrange
        Diagnostico diagnostico2 = new Diagnostico();
        diagnostico2.setId(2L);
        diagnostico2.setDiagnostico("Gingivitis");
        diagnostico2.setPaciente(paciente);

        List<Diagnostico> diagnosticos = Arrays.asList(diagnostico, diagnostico2);
        when(diagnosticoRepository.findByPacienteIdOrderByFechaDiagnosticoDesc(1L))
                .thenReturn(diagnosticos);

        // Act
        List<Diagnostico> resultado = diagnosticoService.obtenerDiagnosticosPorPaciente(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals(diagnostico, resultado.get(0));
        assertEquals(diagnostico2, resultado.get(1));
        verify(diagnosticoRepository).findByPacienteIdOrderByFechaDiagnosticoDesc(1L);
    }

    @Test
    void testObtenerDiagnosticoPorId_Success() {
        // Arrange
        when(diagnosticoRepository.findById(1L)).thenReturn(Optional.of(diagnostico));

        // Act
        Diagnostico resultado = diagnosticoService.obtenerDiagnosticoPorId(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(diagnostico, resultado);
        verify(diagnosticoRepository).findById(1L);
    }

    @Test
    void testObtenerDiagnosticoPorId_NoEncontrado() {
        // Arrange
        when(diagnosticoRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            diagnosticoService.obtenerDiagnosticoPorId(1L);
        });

        assertEquals("Diagnóstico no encontrado", exception.getMessage());
        verify(diagnosticoRepository).findById(1L);
    }

    @Test
    void testEliminarDiagnostico_Success() {
        // Arrange
        when(diagnosticoRepository.existsById(1L)).thenReturn(true);
        doNothing().when(diagnosticoRepository).deleteById(1L);

        // Act
        assertDoesNotThrow(() -> diagnosticoService.eliminarDiagnostico(1L));

        // Assert
        verify(diagnosticoRepository).existsById(1L);
        verify(diagnosticoRepository).deleteById(1L);
    }

    @Test
    void testEliminarDiagnostico_NoEncontrado() {
        // Arrange
        when(diagnosticoRepository.existsById(1L)).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            diagnosticoService.eliminarDiagnostico(1L);
        });

        assertEquals("Diagnóstico no encontrado", exception.getMessage());
        verify(diagnosticoRepository).existsById(1L);
        verify(diagnosticoRepository, never()).deleteById(any());
    }

    @Test
    void testBuscarDiagnosticosPorContenido_Success() {
        // Arrange
        List<Diagnostico> diagnosticos = Arrays.asList(diagnostico);
        when(diagnosticoRepository.findByPacienteIdAndDiagnosticoContainingIgnoreCase(1L, "caries"))
                .thenReturn(diagnosticos);

        // Act
        List<Diagnostico> resultado = diagnosticoService.buscarDiagnosticosPorContenido(1L, "caries");

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(diagnostico, resultado.get(0));
        verify(diagnosticoRepository).findByPacienteIdAndDiagnosticoContainingIgnoreCase(1L, "caries");
    }

    @Test
    void testBuscarDiagnosticosPorPronostico_Success() {
        // Arrange
        List<Diagnostico> diagnosticos = Arrays.asList(diagnostico);
        when(diagnosticoRepository.findByPacienteIdAndPronosticoContainingIgnoreCase(1L, "favorable"))
                .thenReturn(diagnosticos);

        // Act
        List<Diagnostico> resultado = diagnosticoService.buscarDiagnosticosPorPronostico(1L, "favorable");

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(diagnostico, resultado.get(0));
        verify(diagnosticoRepository).findByPacienteIdAndPronosticoContainingIgnoreCase(1L, "favorable");
    }

    @Test
    void testContarDiagnosticosPorPaciente_Success() {
        // Arrange
        when(diagnosticoRepository.countByPacienteId(1L)).thenReturn(5L);

        // Act
        long resultado = diagnosticoService.contarDiagnosticosPorPaciente(1L);

        // Assert
        assertEquals(5L, resultado);
        verify(diagnosticoRepository).countByPacienteId(1L);
    }

    @Test
    void testCrearDiagnostico_ConFechaEspecifica() {
        // Arrange
        LocalDate fechaEspecifica = LocalDate.of(2024, 1, 15);
        diagnosticoDTO.setFechaDiagnostico(fechaEspecifica);
        
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(diagnosticoRepository.save(any(Diagnostico.class))).thenReturn(diagnostico);

        // Act
        Diagnostico resultado = diagnosticoService.crearDiagnostico(diagnosticoDTO);

        // Assert
        assertNotNull(resultado);
        verify(pacienteRepository).findById(1L);
        verify(usuarioRepository).findById(1L);
        verify(diagnosticoRepository).save(any(Diagnostico.class));
    }

    @Test
    void testActualizarDiagnostico_ConCamposVacios() {
        // Arrange
        DiagnosticoDTO dtoConCamposVacios = new DiagnosticoDTO();
        dtoConCamposVacios.setDiagnostico("");
        dtoConCamposVacios.setPronostico(null);
        dtoConCamposVacios.setObservaciones("");
        dtoConCamposVacios.setFechaDiagnostico(LocalDate.now()); // Fecha obligatoria

        when(diagnosticoRepository.findById(1L)).thenReturn(Optional.of(diagnostico));
        when(diagnosticoRepository.save(any(Diagnostico.class))).thenReturn(diagnostico);

        // Act
        Diagnostico resultado = diagnosticoService.actualizarDiagnostico(1L, dtoConCamposVacios);

        // Assert
        assertNotNull(resultado);
        verify(diagnosticoRepository).findById(1L);
        verify(diagnosticoRepository).save(diagnostico);
    }

    @Test
    void testActualizarDiagnostico_SinFecha_DeberiaLanzarExcepcion() {
        // Arrange
        DiagnosticoDTO dtoSinFecha = new DiagnosticoDTO();
        dtoSinFecha.setDiagnostico("Caries avanzada");
        dtoSinFecha.setPronostico("Requiere endodoncia");
        dtoSinFecha.setObservaciones("Dolor intenso");
        // No se establece fecha - debería causar error

        when(diagnosticoRepository.findById(1L)).thenReturn(Optional.of(diagnostico));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            diagnosticoService.actualizarDiagnostico(1L, dtoSinFecha);
        });

        assertEquals("La fecha del diagnóstico es obligatoria", exception.getMessage());
        verify(diagnosticoRepository).findById(1L);
        verify(diagnosticoRepository, never()).save(any());
    }

    @Test
    void testCrearDiagnostico_SinFecha_DeberiaLanzarExcepcion() {
        // Arrange
        DiagnosticoDTO dtoSinFecha = new DiagnosticoDTO();
        dtoSinFecha.setDiagnostico("Caries dental");
        dtoSinFecha.setPronostico("Favorable con tratamiento");
        dtoSinFecha.setObservaciones("Requiere empaste");
        dtoSinFecha.setPacienteId(1L);
        dtoSinFecha.setUsuarioId(1L);
        // No se establece fecha - debería causar error

        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            diagnosticoService.crearDiagnostico(dtoSinFecha);
        });

        assertEquals("La fecha del diagnóstico es obligatoria", exception.getMessage());
        verify(pacienteRepository).findById(1L);
        verify(usuarioRepository).findById(1L);
        verify(diagnosticoRepository, never()).save(any());
    }
}
