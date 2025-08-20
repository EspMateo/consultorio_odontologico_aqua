package com.consultorio.odontologia.service;

import com.consultorio.odontologia.dto.PeriodonciaDTO;
import com.consultorio.odontologia.entity.Periodoncia;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.repository.PeriodonciaRepository;
import com.consultorio.odontologia.repository.PacienteRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PeriodonciaServiceTest {

    @Mock
    private PeriodonciaRepository periodonciaRepository;

    @Mock
    private PacienteRepository pacienteRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private PeriodonciaService periodonciaService;

    private Paciente paciente;
    private Periodoncia periodoncia;
    private PeriodonciaDTO periodonciaDTO;
    private Map<String, Object> indicePlaca;
    private Map<String, Object> indiceSarro;

    @BeforeEach
    void setUp() {
        // Configurar datos de prueba
        paciente = new Paciente();
        paciente.setId(1L);
        paciente.setName("Juan");
        paciente.setLastname("Pérez");

        periodoncia = new Periodoncia();
        periodoncia.setId(1L);
        periodoncia.setPaciente(paciente);
        periodoncia.setFechaRegistro(LocalDate.of(2024, 1, 15));
        periodoncia.setTipoFicha(Periodoncia.TipoFicha.INICIAL);
        periodoncia.setObservaciones("Observaciones de periodoncia");
        periodoncia.setFechaCreacion(LocalDate.of(2024, 1, 15));
        periodoncia.setIndicePlaca("{\"diente1\":true,\"diente2\":false}");
        periodoncia.setIndiceSarro("{\"diente1\":{\"sector1\":true,\"sector2\":false}}");
        periodoncia.setPorcentajePlaca(50);
        periodoncia.setPorcentajeSarro(25);

        periodonciaDTO = new PeriodonciaDTO();
        periodonciaDTO.setId(1L);
        periodonciaDTO.setPacienteId(1L);
        periodonciaDTO.setFechaRegistro(LocalDate.of(2024, 1, 15));
        periodonciaDTO.setTipoFicha("INICIAL");
        periodonciaDTO.setObservaciones("Observaciones de periodoncia");

        indicePlaca = new HashMap<>();
        indicePlaca.put("diente1", true);
        indicePlaca.put("diente2", false);
        periodonciaDTO.setIndicePlaca(indicePlaca);

        indiceSarro = new HashMap<>();
        Map<String, Object> dienteSarro = new HashMap<>();
        dienteSarro.put("sector1", true);
        dienteSarro.put("sector2", false);
        indiceSarro.put("diente1", dienteSarro);
        periodonciaDTO.setIndiceSarro(indiceSarro);
    }

    @Test
    void testGuardarPeriodoncia_Success() throws Exception {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(objectMapper.writeValueAsString(any())).thenReturn("{\"diente1\":true,\"diente2\":false}");
        when(periodonciaRepository.save(any(Periodoncia.class))).thenReturn(periodoncia);

        // Act
        PeriodonciaDTO resultado = periodonciaService.guardarPeriodoncia(periodonciaDTO);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        verify(pacienteRepository).findById(1L);
        verify(objectMapper, times(2)).writeValueAsString(any());
        verify(periodonciaRepository).save(any(Periodoncia.class));
    }

    @Test
    void testGuardarPeriodoncia_PacienteNoEncontrado() {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            periodonciaService.guardarPeriodoncia(periodonciaDTO);
        });

        assertEquals("Paciente no encontrado", exception.getMessage());
        verify(pacienteRepository).findById(1L);
        verify(periodonciaRepository, never()).save(any());
    }

    @Test
    void testGuardarPeriodoncia_SinIndices() throws Exception {
        // Arrange
        periodonciaDTO.setIndicePlaca(null);
        periodonciaDTO.setIndiceSarro(null);
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(periodonciaRepository.save(any(Periodoncia.class))).thenReturn(periodoncia);

        // Act
        PeriodonciaDTO resultado = periodonciaService.guardarPeriodoncia(periodonciaDTO);

        // Assert
        assertNotNull(resultado);
        verify(pacienteRepository).findById(1L);
        verify(objectMapper, never()).writeValueAsString(any());
        verify(periodonciaRepository).save(any(Periodoncia.class));
    }

    @Test
    void testActualizarPeriodoncia_Success() throws Exception {
        // Arrange
        PeriodonciaDTO dtoActualizado = new PeriodonciaDTO();
        dtoActualizado.setFechaRegistro(LocalDate.of(2024, 2, 1));
        dtoActualizado.setTipoFicha("CONTROL_PERIODICO");
        dtoActualizado.setObservaciones("Observaciones actualizadas");
        dtoActualizado.setIndicePlaca(indicePlaca);
        dtoActualizado.setIndiceSarro(indiceSarro);

        when(periodonciaRepository.findById(1L)).thenReturn(Optional.of(periodoncia));
        when(objectMapper.writeValueAsString(any())).thenReturn("{\"diente1\":true,\"diente2\":false}");
        when(periodonciaRepository.save(any(Periodoncia.class))).thenReturn(periodoncia);

        // Act
        PeriodonciaDTO resultado = periodonciaService.actualizarPeriodoncia(1L, dtoActualizado);

        // Assert
        assertNotNull(resultado);
        verify(periodonciaRepository).findById(1L);
        verify(objectMapper, times(2)).writeValueAsString(any());
        verify(periodonciaRepository).save(periodoncia);
    }

    @Test
    void testActualizarPeriodoncia_NoEncontrada() {
        // Arrange
        when(periodonciaRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            periodonciaService.actualizarPeriodoncia(1L, periodonciaDTO);
        });

        assertEquals("Periodoncia no encontrada", exception.getMessage());
        verify(periodonciaRepository).findById(1L);
        verify(periodonciaRepository, never()).save(any());
    }

    @Test
    void testObtenerPorId_Success() throws Exception {
        // Arrange
        when(periodonciaRepository.findById(1L)).thenReturn(Optional.of(periodoncia));
        when(objectMapper.readValue(anyString(), eq(Map.class))).thenReturn(indicePlaca);

        // Act
        PeriodonciaDTO resultado = periodonciaService.obtenerPorId(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        verify(periodonciaRepository).findById(1L);
        verify(objectMapper, times(2)).readValue(anyString(), eq(Map.class));
    }

    @Test
    void testObtenerPorId_NoEncontrada() {
        // Arrange
        when(periodonciaRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            periodonciaService.obtenerPorId(1L);
        });

        assertEquals("Periodoncia no encontrada", exception.getMessage());
        verify(periodonciaRepository).findById(1L);
    }

    @Test
    void testObtenerPorPacienteYFecha_Success() throws Exception {
        // Arrange
        LocalDate fecha = LocalDate.of(2024, 1, 15);
        when(periodonciaRepository.findByPacienteIdAndFechaRegistro(1L, fecha)).thenReturn(Optional.of(periodoncia));
        when(objectMapper.readValue(anyString(), eq(Map.class))).thenReturn(indicePlaca);

        // Act
        PeriodonciaDTO resultado = periodonciaService.obtenerPorPacienteYFecha(1L, fecha);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        verify(periodonciaRepository).findByPacienteIdAndFechaRegistro(1L, fecha);
        verify(objectMapper, times(2)).readValue(anyString(), eq(Map.class));
    }

    @Test
    void testObtenerPorPacienteYFecha_NoEncontrada() {
        // Arrange
        LocalDate fecha = LocalDate.of(2024, 1, 15);
        when(periodonciaRepository.findByPacienteIdAndFechaRegistro(1L, fecha)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            periodonciaService.obtenerPorPacienteYFecha(1L, fecha);
        });

        assertEquals("Periodoncia no encontrada", exception.getMessage());
        verify(periodonciaRepository).findByPacienteIdAndFechaRegistro(1L, fecha);
    }

    @Test
    void testObtenerMasReciente_Success() throws Exception {
        // Arrange
        when(periodonciaRepository.findMostRecentByPacienteId(1L)).thenReturn(Optional.of(periodoncia));
        when(objectMapper.readValue(anyString(), eq(Map.class))).thenReturn(indicePlaca);

        // Act
        PeriodonciaDTO resultado = periodonciaService.obtenerMasReciente(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        verify(periodonciaRepository).findMostRecentByPacienteId(1L);
        verify(objectMapper, times(2)).readValue(anyString(), eq(Map.class));
    }

    @Test
    void testObtenerMasReciente_NoEncontrada() {
        // Arrange
        when(periodonciaRepository.findMostRecentByPacienteId(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            periodonciaService.obtenerMasReciente(1L);
        });

        assertEquals("No se encontraron periodoncias para este paciente", exception.getMessage());
        verify(periodonciaRepository).findMostRecentByPacienteId(1L);
    }

    @Test
    void testObtenerFechasDisponibles_Success() {
        // Arrange
        List<LocalDate> fechas = Arrays.asList(LocalDate.of(2024, 1, 15), LocalDate.of(2024, 1, 20));
        when(periodonciaRepository.findFechasByPacienteId(1L)).thenReturn(fechas);

        // Act
        List<LocalDate> resultado = periodonciaService.obtenerFechasDisponibles(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals(LocalDate.of(2024, 1, 15), resultado.get(0));
        assertEquals(LocalDate.of(2024, 1, 20), resultado.get(1));
        verify(periodonciaRepository).findFechasByPacienteId(1L);
    }

    @Test
    void testExistePeriodoncia_True() {
        // Arrange
        LocalDate fecha = LocalDate.of(2024, 1, 15);
        when(periodonciaRepository.existsByPacienteIdAndFechaRegistro(1L, fecha)).thenReturn(true);

        // Act
        boolean resultado = periodonciaService.existePeriodoncia(1L, fecha);

        // Assert
        assertTrue(resultado);
        verify(periodonciaRepository).existsByPacienteIdAndFechaRegistro(1L, fecha);
    }

    @Test
    void testExistePeriodoncia_False() {
        // Arrange
        LocalDate fecha = LocalDate.of(2024, 1, 15);
        when(periodonciaRepository.existsByPacienteIdAndFechaRegistro(1L, fecha)).thenReturn(false);

        // Act
        boolean resultado = periodonciaService.existePeriodoncia(1L, fecha);

        // Assert
        assertFalse(resultado);
        verify(periodonciaRepository).existsByPacienteIdAndFechaRegistro(1L, fecha);
    }

    @Test
    void testObtenerTodasPorPaciente_Success() throws Exception {
        // Arrange
        List<Periodoncia> periodoncias = Arrays.asList(periodoncia);
        when(periodonciaRepository.findByPacienteIdOrderByFechaRegistroDesc(1L)).thenReturn(periodoncias);
        when(objectMapper.readValue(anyString(), eq(Map.class))).thenReturn(indicePlaca);

        // Act
        List<PeriodonciaDTO> resultado = periodonciaService.obtenerTodasPorPaciente(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(1L, resultado.get(0).getId());
        verify(periodonciaRepository).findByPacienteIdOrderByFechaRegistroDesc(1L);
        verify(objectMapper, times(2)).readValue(anyString(), eq(Map.class));
    }

    @Test
    void testGuardarPeriodoncia_ConErrorEnObjectMapper() throws Exception {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(objectMapper.writeValueAsString(any())).thenThrow(new RuntimeException("Error en ObjectMapper"));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            periodonciaService.guardarPeriodoncia(periodonciaDTO);
        });

        assertTrue(exception.getMessage().contains("Error en ObjectMapper"));
        verify(pacienteRepository).findById(1L);
        verify(objectMapper).writeValueAsString(any());
        verify(periodonciaRepository, never()).save(any());
    }

    @Test
    void testObtenerPorId_ConErrorEnObjectMapper() throws Exception {
        // Arrange
        when(periodonciaRepository.findById(1L)).thenReturn(Optional.of(periodoncia));
        when(objectMapper.readValue(anyString(), eq(Map.class))).thenThrow(new RuntimeException("Error en ObjectMapper"));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            periodonciaService.obtenerPorId(1L);
        });

        assertTrue(exception.getMessage().contains("Error en ObjectMapper"));
        verify(periodonciaRepository).findById(1L);
        verify(objectMapper).readValue(anyString(), eq(Map.class));
    }

    @Test
    void testObtenerTodasPorPaciente_ConErrorEnObjectMapper() throws Exception {
        // Arrange
        List<Periodoncia> periodoncias = Arrays.asList(periodoncia);
        when(periodonciaRepository.findByPacienteIdOrderByFechaRegistroDesc(1L)).thenReturn(periodoncias);
        when(objectMapper.readValue(anyString(), eq(Map.class))).thenThrow(new RuntimeException("Error en ObjectMapper"));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            periodonciaService.obtenerTodasPorPaciente(1L);
        });

        assertTrue(exception.getMessage().contains("Error al procesar periodoncia"));
        verify(periodonciaRepository).findByPacienteIdOrderByFechaRegistroDesc(1L);
        verify(objectMapper).readValue(anyString(), eq(Map.class));
    }

    @Test
    void testGuardarPeriodoncia_ConTipoFichaDiferente() throws Exception {
        // Arrange
        periodonciaDTO.setTipoFicha("CONTROL_PERIODICO");
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(objectMapper.writeValueAsString(any())).thenReturn("{\"diente1\":true,\"diente2\":false}");
        when(periodonciaRepository.save(any(Periodoncia.class))).thenReturn(periodoncia);

        // Act
        PeriodonciaDTO resultado = periodonciaService.guardarPeriodoncia(periodonciaDTO);

        // Assert
        assertNotNull(resultado);
        verify(pacienteRepository).findById(1L);
        verify(objectMapper, times(2)).writeValueAsString(any());
        verify(periodonciaRepository).save(any(Periodoncia.class));
    }

    @Test
    void testActualizarPeriodoncia_ConCamposNulos() throws Exception {
        // Arrange
        PeriodonciaDTO dtoConCamposNulos = new PeriodonciaDTO();
        dtoConCamposNulos.setFechaRegistro(LocalDate.of(2024, 2, 1));
        dtoConCamposNulos.setTipoFicha("CONTROL_PERIODICO");
        dtoConCamposNulos.setObservaciones("Observaciones actualizadas");
        dtoConCamposNulos.setIndicePlaca(null);
        dtoConCamposNulos.setIndiceSarro(null);

        when(periodonciaRepository.findById(1L)).thenReturn(Optional.of(periodoncia));
        when(periodonciaRepository.save(any(Periodoncia.class))).thenReturn(periodoncia);

        // Act
        PeriodonciaDTO resultado = periodonciaService.actualizarPeriodoncia(1L, dtoConCamposNulos);

        // Assert
        assertNotNull(resultado);
        verify(periodonciaRepository).findById(1L);
        verify(objectMapper, never()).writeValueAsString(any());
        verify(periodonciaRepository).save(periodoncia);
    }
}
