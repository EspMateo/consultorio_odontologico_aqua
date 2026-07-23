package com.consultorio.odontologia.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Acceso al id del usuario autenticado en el request actual. JwtAuthenticationFilter
 * guarda ese id en authentication.getDetails() al validar el token; los servicios
 * deben usar este helper en vez de confiar en un usuarioId que venga del cliente.
 */
public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static Long getUsuarioIdActual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        Object details = authentication.getDetails();
        return (details instanceof Long) ? (Long) details : null;
    }
}
