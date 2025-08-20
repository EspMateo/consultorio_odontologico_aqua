package com.consultorio.odontologia.service;

import com.consultorio.odontologia.entity.Odontograma;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.repository.OdontogramaRepository;
import com.consultorio.odontologia.repository.PacienteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OdontogramaServiceTest {

    @Mock
    private OdontogramaRepository odontogramaRepository;

    @Mock
    private PacienteRepository pacienteRepository;

    @InjectMocks
    private OdontogramaService odontogramaService;

    private Paciente paciente;
    private Odontograma odontograma;
    private Odontograma odontogramaActualizado;

    @BeforeEach
    void setUp() {
        // Configurar datos de prueba
        paciente = new Paciente();
        paciente.setId(1L);
        paciente.setName("Juan");
        paciente.setLastname("Pérez");

        odontograma = new Odontograma();
        odontograma.setId(1L);
        odontograma.setPaciente(paciente);
        odontograma.setTipoDenticion("Mixta");
        odontograma.setDatosDientes("Datos del odontograma");
        odontograma.setObservaciones("Observaciones del odontograma");
        odontograma.setFechaCreacion(LocalDateTime.of(2024, 1, 15, 10, 0));

        odontogramaActualizado = new Odontograma();
        odontogramaActualizado.setTipoDenticion("Mixta actualizada");
        odontogramaActualizado.setDatosDientes("Datos actualizados");
        odontogramaActualizado.setObservaciones("Observaciones actualizadas");
    }

    @Test
    void testGuardarOdontograma_Success() {
        // Arrange
        when(odontogramaRepository.save(any(Odontograma.class))).thenReturn(odontograma);

        // Act
        Odontograma resultado = odontogramaService.guardarOdontograma(odontograma);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Mixta", resultado.getTipoDenticion());
        verify(odontogramaRepository).save(odontograma);
    }

    @Test
    void testGuardarOdontograma_SinFechaCreacion() {
        // Arrange
        odontograma.setFechaCreacion(null);
        when(odontogramaRepository.save(any(Odontograma.class))).thenReturn(odontograma);

        // Act
        Odontograma resultado = odontogramaService.guardarOdontograma(odontograma);

        // Assert
        assertNotNull(resultado);
        assertNotNull(resultado.getFechaCreacion());
        verify(odontogramaRepository).save(odontograma);
    }

    @Test
    void testObtenerOdontogramasPaciente_Success() {
        // Arrange
        List<Odontograma> odontogramas = Arrays.asList(odontograma);
        when(odontogramaRepository.findByPacienteIdOrderByFechaCreacionDesc(1L)).thenReturn(odontogramas);

        // Act
        List<Odontograma> resultado = odontogramaService.obtenerOdontogramasPaciente(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(odontograma, resultado.get(0));
        verify(odontogramaRepository).findByPacienteIdOrderByFechaCreacionDesc(1L);
    }

    @Test
    void testObtenerOdontogramaPorId_Success() {
        // Arrange
        when(odontogramaRepository.findById(1L)).thenReturn(Optional.of(odontograma));

        // Act
        Odontograma resultado = odontogramaService.obtenerOdontogramaPorId(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(odontograma, resultado);
        verify(odontogramaRepository).findById(1L);
    }

    @Test
    void testObtenerOdontogramaPorId_NoEncontrado() {
        // Arrange
        when(odontogramaRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            odontogramaService.obtenerOdontogramaPorId(1L);
        });

        assertEquals("Odontograma no encontrado con ID: 1", exception.getMessage());
        verify(odontogramaRepository).findById(1L);
    }

    @Test
    void testObtenerOdontogramaMasReciente_Success() {
        // Arrange
        List<Odontograma> odontogramas = Arrays.asList(odontograma);
        when(odontogramaRepository.findByPacienteIdOrderByFechaCreacionDesc(1L)).thenReturn(odontogramas);

        // Act
        Optional<Odontograma> resultado = odontogramaService.obtenerOdontogramaMasReciente(1L);

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals(odontograma, resultado.get());
        verify(odontogramaRepository).findByPacienteIdOrderByFechaCreacionDesc(1L);
    }

    @Test
    void testObtenerOdontogramaMasReciente_ListaVacia() {
        // Arrange
        List<Odontograma> odontogramas = Arrays.asList();
        when(odontogramaRepository.findByPacienteIdOrderByFechaCreacionDesc(1L)).thenReturn(odontogramas);

        // Act
        Optional<Odontograma> resultado = odontogramaService.obtenerOdontogramaMasReciente(1L);

        // Assert
        assertFalse(resultado.isPresent());
        verify(odontogramaRepository).findByPacienteIdOrderByFechaCreacionDesc(1L);
    }

    @Test
    void testActualizarOdontograma_Success() {
        // Arrange
        when(odontogramaRepository.findById(1L)).thenReturn(Optional.of(odontograma));
        when(odontogramaRepository.save(any(Odontograma.class))).thenReturn(odontograma);

        // Act
        Odontograma resultado = odontogramaService.actualizarOdontograma(1L, odontogramaActualizado);

        // Assert
        assertNotNull(resultado);
        assertEquals("Mixta actualizada", odontograma.getTipoDenticion());
        assertEquals("Datos actualizados", odontograma.getDatosDientes());
        assertEquals("Observaciones actualizadas", odontograma.getObservaciones());
        verify(odontogramaRepository).findById(1L);
        verify(odontogramaRepository).save(odontograma);
    }

    @Test
    void testActualizarOdontograma_NoEncontrado() {
        // Arrange
        when(odontogramaRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            odontogramaService.actualizarOdontograma(1L, odontogramaActualizado);
        });

        assertEquals("Odontograma no encontrado con ID: 1", exception.getMessage());
        verify(odontogramaRepository).findById(1L);
        verify(odontogramaRepository, never()).save(any());
    }

    @Test
    void testEliminarOdontograma_Success() {
        // Arrange
        when(odontogramaRepository.existsById(1L)).thenReturn(true);
        doNothing().when(odontogramaRepository).deleteById(1L);

        // Act
        assertDoesNotThrow(() -> odontogramaService.eliminarOdontograma(1L));

        // Assert
        verify(odontogramaRepository).existsById(1L);
        verify(odontogramaRepository).deleteById(1L);
    }

    @Test
    void testEliminarOdontograma_NoEncontrado() {
        // Arrange
        when(odontogramaRepository.existsById(1L)).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            odontogramaService.eliminarOdontograma(1L);
        });

        assertEquals("Odontograma no encontrado con ID: 1", exception.getMessage());
        verify(odontogramaRepository).existsById(1L);
        verify(odontogramaRepository, never()).deleteById(any());
    }

    @Test
    void testContarOdontogramasPaciente_Success() {
        // Arrange
        when(odontogramaRepository.countByPacienteId(1L)).thenReturn(5L);

        // Act
        long resultado = odontogramaService.contarOdontogramasPaciente(1L);

        // Assert
        assertEquals(5L, resultado);
        verify(odontogramaRepository).countByPacienteId(1L);
    }

    @Test
    void testPacienteExiste_True() {
        // Arrange
        when(pacienteRepository.existsById(1L)).thenReturn(true);

        // Act
        boolean resultado = odontogramaService.pacienteExiste(1L);

        // Assert
        assertTrue(resultado);
        verify(pacienteRepository).existsById(1L);
    }

    @Test
    void testPacienteExiste_False() {
        // Arrange
        when(pacienteRepository.existsById(1L)).thenReturn(false);

        // Act
        boolean resultado = odontogramaService.pacienteExiste(1L);

        // Assert
        assertFalse(resultado);
        verify(pacienteRepository).existsById(1L);
    }

    @Test
    void testGuardarOdontograma_ConFechaExistente() {
        // Arrange
        LocalDateTime fechaExistente = LocalDateTime.of(2024, 1, 10, 9, 0);
        odontograma.setFechaCreacion(fechaExistente);
        when(odontogramaRepository.save(any(Odontograma.class))).thenReturn(odontograma);

        // Act
        Odontograma resultado = odontogramaService.guardarOdontograma(odontograma);

        // Assert
        assertNotNull(resultado);
        assertEquals(fechaExistente, resultado.getFechaCreacion());
        verify(odontogramaRepository).save(odontograma);
    }

    @Test
    void testActualizarOdontograma_ConCamposNulos() {
        // Arrange
        Odontograma dtoConCamposNulos = new Odontograma();
        dtoConCamposNulos.setTipoDenticion(null);
        dtoConCamposNulos.setDatosDientes(null);
        dtoConCamposNulos.setObservaciones(null);

        when(odontogramaRepository.findById(1L)).thenReturn(Optional.of(odontograma));
        when(odontogramaRepository.save(any(Odontograma.class))).thenReturn(odontograma);

        // Act
        Odontograma resultado = odontogramaService.actualizarOdontograma(1L, dtoConCamposNulos);

        // Assert
        assertNotNull(resultado);
        verify(odontogramaRepository).findById(1L);
        verify(odontogramaRepository).save(odontograma);
    }

    @Test
    void testObtenerOdontogramasPaciente_ListaVacia() {
        // Arrange
        List<Odontograma> odontogramas = Arrays.asList();
        when(odontogramaRepository.findByPacienteIdOrderByFechaCreacionDesc(1L)).thenReturn(odontogramas);

        // Act
        List<Odontograma> resultado = odontogramaService.obtenerOdontogramasPaciente(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(0, resultado.size());
        verify(odontogramaRepository).findByPacienteIdOrderByFechaCreacionDesc(1L);
    }
}
