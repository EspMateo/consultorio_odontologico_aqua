package com.consultorio.odontologia.service;

import com.consultorio.odontologia.entity.Usuario;
import com.consultorio.odontologia.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<Usuario> login(String email, String password) {
        Optional<Usuario> userOpt = usuarioRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }

        Usuario usuario = userOpt.get();
        String storedPassword = usuario.getPassword();

        if (storedPassword == null) {
            return Optional.empty();
        }

        // Las contraseñas hasheadas con BCrypt siempre empiezan con $2a$/$2b$/$2y$
        boolean isBcryptHash = storedPassword.startsWith("$2a$")
                || storedPassword.startsWith("$2b$")
                || storedPassword.startsWith("$2y$");

        if (isBcryptHash) {
            return passwordEncoder.matches(password, storedPassword)
                    ? Optional.of(usuario)
                    : Optional.empty();
        }

        // Migración transparente: si la contraseña todavía está en texto plano
        // (usuarios creados antes de este cambio) y coincide, se re-hashea y
        // se guarda en BCrypt para que a partir de ahora quede segura.
        if (storedPassword.equals(password)) {
            usuario.setPassword(passwordEncoder.encode(password));
            usuarioRepository.save(usuario);
            return Optional.of(usuario);
        }

        return Optional.empty();
    }

    public Usuario save(Usuario usuario) {
        // Verificar si el email ya existe
        Optional<Usuario> existingUser = usuarioRepository.findByEmail(usuario.getEmail());

        if (existingUser.isPresent()) {
            throw new RuntimeException("El email ya está registrado. Por favor, utiliza otro email o inicia sesión.");
        }

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> findById(Long id) {
        return usuarioRepository.findById(id);
    }

    public boolean existsByEmail(String email) {
        return usuarioRepository.findByEmail(email).isPresent();
    }
}
