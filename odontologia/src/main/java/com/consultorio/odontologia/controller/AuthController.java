package com.consultorio.odontologia.controller;

import com.consultorio.odontologia.entity.Usuario;
import com.consultorio.odontologia.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    @CrossOrigin(origins = {
        "https://consultorio-odontologico-aqua.vercel.app",
        "https://consultorioodontologicoaqua-production-0ffa.up.railway.app",
        "http://localhost:3000",
        "http://localhost:5173"
    })
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        try {
            Optional<Usuario> user = usuarioService.login(usuario.getEmail(), usuario.getPassword());
            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            } else {
                return ResponseEntity.badRequest().body("Credenciales incorrectas");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error en el servidor");
        }
    }

    @PostMapping("/register")
    @CrossOrigin(origins = {
        "https://consultorio-odontologico-aqua.vercel.app",
        "https://consultorioodontologicoaqua-production-0ffa.up.railway.app",
        "http://localhost:3000",
        "http://localhost:5173"
    })
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {
        try {
            // Validar que el email no esté vacío
            if (usuario.getEmail() == null || usuario.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El email es obligatorio");
            }
            
            // Validar que la contraseña no esté vacía
            if (usuario.getPassword() == null || usuario.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("La contraseña es obligatoria");
            }
            
            // Validar que el nombre no esté vacío
            if (usuario.getName() == null || usuario.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("El nombre es obligatorio");
            }
            
            Usuario savedUser = usuarioService.save(usuario);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error interno del servidor. Por favor, inténtalo de nuevo.");
        }
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<?> checkEmailExists(@PathVariable String email) {
        try {
            boolean exists = usuarioService.existsByEmail(email);
            return ResponseEntity.ok(Map.of("exists", exists));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al verificar el email");
        }
    }
}
