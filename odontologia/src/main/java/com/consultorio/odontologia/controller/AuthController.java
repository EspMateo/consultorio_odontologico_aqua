package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.entity.Usuario;
import com.consultorio.odontologia.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public Usuario login(@RequestBody Usuario usuario) {
        Optional<Usuario> user = usuarioService.login(usuario.getEmail(), usuario.getPassword());
        return user.orElse(null);
    }

    @PostMapping("/register")
    public Usuario register(@RequestBody Usuario usuario) {
        return usuarioService.save(usuario);
    }
}
