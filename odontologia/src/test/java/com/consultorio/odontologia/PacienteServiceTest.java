package com.consultorio.odontologia.service;

import com.consultorio.odontologia.dto.PacienteDTO;
import com.consultorio.odontologia.entity.Paciente;
import com.consultorio.odontologia.repository.PacienteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PacienteServiceTest {

    @Mock
    private PacienteRepository pacienteRepository;

    @InjectMocks
    private PacienteService pacienteService;

    private Paciente paciente;
    private PacienteDTO pacienteDTO;

    @BeforeEach
    void setUp() {
        // Configurar datos de prueba
        paciente = new Paciente();
        paciente.setId(1L);
        paciente.setName("Juan");
        paciente.setLastname("Pérez");
        paciente.setCI(12345678L);
        paciente.setGender("Masculino");
        paciente.setTelephone(123456789);
        paciente.setEmail("juan.perez@email.com");
        paciente.setDiagnosis("Consulta general");
        paciente.setGeneralMedicalHistory("Dirección de prueba");
        paciente.setReleaseSummary("2024-01-15");
        paciente.setEdad(30);

        pacienteDTO = new PacienteDTO();
        pacienteDTO.setNombre("Juan");
        pacienteDTO.setApellido("Pérez");
        pacienteDTO.setCedula("12345678");
        pacienteDTO.setSexo("Masculino");
        pacienteDTO.setNumero("123456789");
        pacienteDTO.setEmail("juan.perez@email.com");
        pacienteDTO.setConsulta("Consulta general");
        pacienteDTO.setDireccion("Dirección de prueba");
        pacienteDTO.setFecha("2024-01-15");
        pacienteDTO.setEdad(30);
    }

    @Test
    void testRegistrarPaciente_Success() {
        // Arrange
        when(pacienteRepository.existsByCI(12345678L)).thenReturn(false);
        when(pacienteRepository.save(any(Paciente.class))).thenReturn(paciente);

        // Act
        Paciente resultado = pacienteService.registrarPaciente(pacienteDTO);

        // Assert
        assertNotNull(resultado);
        assertEquals("Juan", resultado.getName());
        assertEquals("Pérez", resultado.getLastname());
        assertEquals(12345678L, resultado.getCI());
        assertEquals("Masculino", resultado.getGender());
        assertEquals(123456789, resultado.getTelephone());
        assertEquals("juan.perez@email.com", resultado.getEmail());

        verify(pacienteRepository).existsByCI(12345678L);
        verify(pacienteRepository).save(any(Paciente.class));
    }

    @Test
    void testRegistrarPaciente_CedulaObligatoria() {
        // Arrange
        pacienteDTO.setCedula(null);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pacienteService.registrarPaciente(pacienteDTO);
        });

        assertEquals("La cédula es obligatoria", exception.getMessage());
        verify(pacienteRepository, never()).existsByCI(any());
        verify(pacienteRepository, never()).save(any());
    }

    @Test
    void testRegistrarPaciente_CedulaVacia() {
        // Arrange
        pacienteDTO.setCedula("");

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pacienteService.registrarPaciente(pacienteDTO);
        });

        assertEquals("La cédula es obligatoria", exception.getMessage());
        verify(pacienteRepository, never()).existsByCI(any());
        verify(pacienteRepository, never()).save(any());
    }

    @Test
    void testRegistrarPaciente_CedulaInvalida() {
        // Arrange
        pacienteDTO.setCedula("abc123");

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pacienteService.registrarPaciente(pacienteDTO);
        });

        assertEquals("La cédula debe ser un número válido", exception.getMessage());
        verify(pacienteRepository, never()).existsByCI(any());
        verify(pacienteRepository, never()).save(any());
    }

    @Test
    void testRegistrarPaciente_CedulaDuplicada() {
        // Arrange
        when(pacienteRepository.existsByCI(12345678L)).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pacienteService.registrarPaciente(pacienteDTO);
        });

        assertEquals("Ya existe un paciente con la cédula 12345678", exception.getMessage());
        verify(pacienteRepository).existsByCI(12345678L);
        verify(pacienteRepository, never()).save(any());
    }

    @Test
    void testRegistrarPaciente_NombreConNumeros() {
        // Arrange
        pacienteDTO.setNombre("Juan123");

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pacienteService.registrarPaciente(pacienteDTO);
        });

        assertEquals("El nombre no puede contener números", exception.getMessage());
        verify(pacienteRepository, never()).existsByCI(any());
        verify(pacienteRepository, never()).save(any());
    }

    @Test
    void testRegistrarPaciente_ApellidoConNumeros() {
        // Arrange
        pacienteDTO.setApellido("Pérez123");

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pacienteService.registrarPaciente(pacienteDTO);
        });

        assertEquals("El apellido no puede contener números", exception.getMessage());
        verify(pacienteRepository, never()).existsByCI(any());
        verify(pacienteRepository, never()).save(any());
    }

    @Test
    void testObtenerTodosLosPacientes_Success() {
        // Arrange
        List<Paciente> pacientes = Arrays.asList(paciente);
        when(pacienteRepository.findAll()).thenReturn(pacientes);

        // Act
        List<Paciente> resultado = pacienteService.obtenerTodosLosPacientes();

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(paciente, resultado.get(0));
        verify(pacienteRepository).findAll();
    }

    @Test
    void testObtenerPacientePorId_Success() {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));

        // Act
        Paciente resultado = pacienteService.obtenerPacientePorId(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(paciente, resultado);
        verify(pacienteRepository).findById(1L);
    }

    @Test
    void testObtenerPacientePorId_NoEncontrado() {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pacienteService.obtenerPacientePorId(1L);
        });

        assertEquals("Paciente no encontrado", exception.getMessage());
        verify(pacienteRepository).findById(1L);
    }

    @Test
    void testBuscarPacientes_SinFiltros() {
        // Arrange
        List<Paciente> pacientes = Arrays.asList(paciente);
        when(pacienteRepository.findAll()).thenReturn(pacientes);

        // Act
        List<Paciente> resultado = pacienteService.buscarPacientes(null, null, null);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        verify(pacienteRepository).findAll();
    }

    @Test
    void testBuscarPacientes_PorNombre() {
        // Arrange
        List<Paciente> pacientes = Arrays.asList(paciente);
        when(pacienteRepository.findAll()).thenReturn(pacientes);

        // Act
        List<Paciente> resultado = pacienteService.buscarPacientes("Juan", null, null);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        verify(pacienteRepository).findAll();
    }

    @Test
    void testBuscarPacientes_PorApellido() {
        // Arrange
        List<Paciente> pacientes = Arrays.asList(paciente);
        when(pacienteRepository.findAll()).thenReturn(pacientes);

        // Act
        List<Paciente> resultado = pacienteService.buscarPacientes(null, "Pérez", null);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        verify(pacienteRepository).findAll();
    }

    @Test
    void testBuscarPacientes_PorCedula() {
        // Arrange
        List<Paciente> pacientes = Arrays.asList(paciente);
        when(pacienteRepository.findAll()).thenReturn(pacientes);

        // Act
        List<Paciente> resultado = pacienteService.buscarPacientes(null, null, "12345678");

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        verify(pacienteRepository).findAll();
    }

    @Test
    void testEliminarPaciente_Success() {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        doNothing().when(pacienteRepository).delete(paciente);

        // Act
        assertDoesNotThrow(() -> pacienteService.eliminarPaciente(1L));

        // Assert
        verify(pacienteRepository).findById(1L);
        verify(pacienteRepository).delete(paciente);
    }

    @Test
    void testEliminarPaciente_IdNulo() {
        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pacienteService.eliminarPaciente(null);
        });

        assertEquals("Error al eliminar el paciente: El ID del paciente no puede ser nulo", exception.getMessage());
        verify(pacienteRepository, never()).findById(any());
        verify(pacienteRepository, never()).delete(any());
    }

    @Test
    void testEliminarPaciente_NoEncontrado() {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pacienteService.eliminarPaciente(1L);
        });

        assertEquals("Error al eliminar el paciente: Paciente no encontrado", exception.getMessage());
        verify(pacienteRepository).findById(1L);
        verify(pacienteRepository, never()).delete(any());
    }

    @Test
    void testActualizarPaciente_Success() {
        // Arrange
        PacienteDTO dtoActualizado = new PacienteDTO();
        dtoActualizado.setNombre("Juan Carlos");
        dtoActualizado.setApellido("Pérez López");
        dtoActualizado.setCedula("87654321");

        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));
        when(pacienteRepository.save(any(Paciente.class))).thenReturn(paciente);

        // Act
        Paciente resultado = pacienteService.actualizarPaciente(1L, dtoActualizado);

        // Assert
        assertNotNull(resultado);
        verify(pacienteRepository).findById(1L);
        verify(pacienteRepository).save(paciente);
    }

    @Test
    void testActualizarPaciente_NoEncontrado() {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pacienteService.actualizarPaciente(1L, pacienteDTO);
        });

        assertEquals("Paciente no encontrado", exception.getMessage());
        verify(pacienteRepository).findById(1L);
        verify(pacienteRepository, never()).save(any());
    }

    @Test
    void testActualizarPaciente_NombreConNumeros() {
        // Arrange
        PacienteDTO dtoConNumeros = new PacienteDTO();
        dtoConNumeros.setNombre("Juan123");

        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pacienteService.actualizarPaciente(1L, dtoConNumeros);
        });

        assertEquals("El nombre no puede contener números", exception.getMessage());
        verify(pacienteRepository).findById(1L);
        verify(pacienteRepository, never()).save(any());
    }

    @Test
    void testActualizarPaciente_ApellidoConNumeros() {
        // Arrange
        PacienteDTO dtoConNumeros = new PacienteDTO();
        dtoConNumeros.setApellido("Pérez123");

        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pacienteService.actualizarPaciente(1L, dtoConNumeros);
        });

        assertEquals("El apellido no puede contener números", exception.getMessage());
        verify(pacienteRepository).findById(1L);
        verify(pacienteRepository, never()).save(any());
    }

    @Test
    void testActualizarPaciente_CedulaInvalida() {
        // Arrange
        PacienteDTO dtoCedulaInvalida = new PacienteDTO();
        dtoCedulaInvalida.setCedula("abc123");

        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pacienteService.actualizarPaciente(1L, dtoCedulaInvalida);
        });

        assertEquals("La cédula debe ser un número válido", exception.getMessage());
        verify(pacienteRepository).findById(1L);
        verify(pacienteRepository, never()).save(any());
    }

    @Test
    void testFindById_Success() {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.of(paciente));

        // Act
        Optional<Paciente> resultado = pacienteService.findById(1L);

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals(paciente, resultado.get());
        verify(pacienteRepository).findById(1L);
    }

    @Test
    void testFindById_NoEncontrado() {
        // Arrange
        when(pacienteRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        Optional<Paciente> resultado = pacienteService.findById(1L);

        // Assert
        assertFalse(resultado.isPresent());
        verify(pacienteRepository).findById(1L);
    }
}
