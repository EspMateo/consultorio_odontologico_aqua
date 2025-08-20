package com.consultorio.odontologia.service;

import com.consultorio.odontologia.entity.Usuario;
import com.consultorio.odontologia.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        // Configurar datos de prueba
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setName("Dr. García");
        usuario.setEmail("dr.garcia@consultorio.com");
        usuario.setPassword("password123");
    }

    @Test
    void testLogin_Success() {
        // Arrange
        String email = "dr.garcia@consultorio.com";
        String password = "password123";
        when(usuarioRepository.findByEmail(email)).thenReturn(Optional.of(usuario));

        // Act
        Optional<Usuario> resultado = usuarioService.login(email, password);

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals(usuario, resultado.get());
        verify(usuarioRepository).findByEmail(email);
    }

    @Test
    void testLogin_EmailNoEncontrado() {
        // Arrange
        String email = "usuario.inexistente@email.com";
        String password = "password123";
        when(usuarioRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act
        Optional<Usuario> resultado = usuarioService.login(email, password);

        // Assert
        assertFalse(resultado.isPresent());
        verify(usuarioRepository).findByEmail(email);
    }

    @Test
    void testLogin_PasswordIncorrecto() {
        // Arrange
        String email = "dr.garcia@consultorio.com";
        String passwordIncorrecto = "passwordIncorrecto";
        when(usuarioRepository.findByEmail(email)).thenReturn(Optional.of(usuario));

        // Act
        Optional<Usuario> resultado = usuarioService.login(email, passwordIncorrecto);

        // Assert
        assertFalse(resultado.isPresent());
        verify(usuarioRepository).findByEmail(email);
    }

    @Test
    void testSave_Success() {
        // Arrange
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setName("Dr. López");
        nuevoUsuario.setEmail("dr.lopez@consultorio.com");
        nuevoUsuario.setPassword("password456");

        when(usuarioRepository.findByEmail("dr.lopez@consultorio.com")).thenReturn(Optional.empty());
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(nuevoUsuario);

        // Act
        Usuario resultado = usuarioService.save(nuevoUsuario);

        // Assert
        assertNotNull(resultado);
        assertEquals("Dr. López", resultado.getName());
        assertEquals("dr.lopez@consultorio.com", resultado.getEmail());
        verify(usuarioRepository).findByEmail("dr.lopez@consultorio.com");
        verify(usuarioRepository).save(nuevoUsuario);
    }

    @Test
    void testSave_EmailDuplicado() {
        // Arrange
        Usuario usuarioDuplicado = new Usuario();
        usuarioDuplicado.setName("Dr. López");
        usuarioDuplicado.setEmail("dr.garcia@consultorio.com"); // Email ya existente
        usuarioDuplicado.setPassword("password456");

        when(usuarioRepository.findByEmail("dr.garcia@consultorio.com")).thenReturn(Optional.of(usuario));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            usuarioService.save(usuarioDuplicado);
        });

        assertEquals("El email ya está registrado. Por favor, utiliza otro email o inicia sesión.", exception.getMessage());
        verify(usuarioRepository).findByEmail("dr.garcia@consultorio.com");
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void testSave_EmailNulo() {
        // Arrange
        Usuario usuarioSinEmail = new Usuario();
        usuarioSinEmail.setName("Dr. López");
        usuarioSinEmail.setPassword("password456");
        // No se establece email

        when(usuarioRepository.findByEmail(null)).thenReturn(Optional.empty());
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioSinEmail);

        // Act
        Usuario resultado = usuarioService.save(usuarioSinEmail);

        // Assert
        assertNotNull(resultado);
        verify(usuarioRepository).findByEmail(null);
        verify(usuarioRepository).save(usuarioSinEmail);
    }

    @Test
    void testFindById_Success() {
        // Arrange
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        // Act
        Optional<Usuario> resultado = usuarioService.findById(1L);

        // Assert
        assertTrue(resultado.isPresent());
        assertEquals(usuario, resultado.get());
        verify(usuarioRepository).findById(1L);
    }

    @Test
    void testFindById_NoEncontrado() {
        // Arrange
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Optional<Usuario> resultado = usuarioService.findById(999L);

        // Assert
        assertFalse(resultado.isPresent());
        verify(usuarioRepository).findById(999L);
    }

    @Test
    void testExistsByEmail_True() {
        // Arrange
        String email = "dr.garcia@consultorio.com";
        when(usuarioRepository.findByEmail(email)).thenReturn(Optional.of(usuario));

        // Act
        boolean resultado = usuarioService.existsByEmail(email);

        // Assert
        assertTrue(resultado);
        verify(usuarioRepository).findByEmail(email);
    }

    @Test
    void testExistsByEmail_False() {
        // Arrange
        String email = "usuario.inexistente@email.com";
        when(usuarioRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act
        boolean resultado = usuarioService.existsByEmail(email);

        // Assert
        assertFalse(resultado);
        verify(usuarioRepository).findByEmail(email);
    }

    @Test
    void testExistsByEmail_EmailNulo() {
        // Arrange
        when(usuarioRepository.findByEmail(null)).thenReturn(Optional.empty());

        // Act
        boolean resultado = usuarioService.existsByEmail(null);

        // Assert
        assertFalse(resultado);
        verify(usuarioRepository).findByEmail(null);
    }

    @Test
    void testLogin_EmailNulo() {
        // Arrange
        String email = null;
        String password = "password123";
        when(usuarioRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act
        Optional<Usuario> resultado = usuarioService.login(email, password);

        // Assert
        assertFalse(resultado.isPresent());
        verify(usuarioRepository).findByEmail(email);
    }

    @Test
    void testLogin_PasswordNulo() {
        // Arrange
        String email = "dr.garcia@consultorio.com";
        String password = null;
        when(usuarioRepository.findByEmail(email)).thenReturn(Optional.of(usuario));

        // Act
        Optional<Usuario> resultado = usuarioService.login(email, password);

        // Assert
        assertFalse(resultado.isPresent());
        verify(usuarioRepository).findByEmail(email);
    }
}
