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
        // Verificar si el email ya existe
        Optional<Usuario> existingUser = usuarioRepository.findByEmail(usuario.getEmail());
        
        if (existingUser.isPresent()) {
            throw new RuntimeException("El email ya está registrado. Por favor, utiliza otro email o inicia sesión.");
        }
        
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> findById(Long id) {
        return usuarioRepository.findById(id);
    }

    public boolean existsByEmail(String email) {
        return usuarioRepository.findByEmail(email).isPresent();
    }
}
