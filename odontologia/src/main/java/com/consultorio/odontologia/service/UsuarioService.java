package com.consultorio.odontologia.service;

import com.consultorio.odontologia.entity.Usuario;
import com.consultorio.odontologia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Optional<Usuario> login(String email, String password) {
        return usuarioRepository.findByEmail(email)
                .filter(usuario -> usuario.getPassword().equals(password));
    }

    public Usuario save(Usuario usuario) {
        System.out.println("=== DEBUG: Intentando guardar usuario ===");
        System.out.println("Email a verificar: " + usuario.getEmail());
        
        // Verificar si el email ya existe
        Optional<Usuario> existingUser = usuarioRepository.findByEmail(usuario.getEmail());
        System.out.println("Usuario existente encontrado: " + existingUser.isPresent());
        
        if (existingUser.isPresent()) {
            System.out.println("ERROR: El email ya está registrado: " + usuario.getEmail());
            throw new RuntimeException("El email ya está registrado. Por favor, utiliza otro email o inicia sesión.");
        }
        
        System.out.println("Email válido, guardando usuario...");
        Usuario savedUser = usuarioRepository.save(usuario);
        System.out.println("Usuario guardado exitosamente con ID: " + savedUser.getId());
        return savedUser;
    }

    public Optional<Usuario> findById(Long id) {
        return usuarioRepository.findById(id);
    }

    public boolean existsByEmail(String email) {
        System.out.println("Verificando si existe email: " + email);
        boolean exists = usuarioRepository.findByEmail(email).isPresent();
        System.out.println("Resultado: " + exists);
        return exists;
    }
}
