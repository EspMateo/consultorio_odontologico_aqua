package com.consultorio.odontologia.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * Genera y valida los tokens JWT usados para autenticar a los usuarios logueados.
 * La clave se toma de la variable de entorno JWT_SECRET (debe ser un string
 * random largo, codificado en Base64 — ver instrucciones de configuración).
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret:}")
    private String secret;

    // 24 horas por defecto
    @Value("${jwt.expiration-ms:86400000}")
    private long expirationMs;

    private SecretKey signingKey;

    @PostConstruct
    private void init() {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException(
                "Falta configurar la variable de entorno JWT_SECRET. " +
                "Generá una con: openssl rand -base64 32"
            );
        }
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Long userId, String email) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey)
                .compact();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Long extractUserId(String token) {
        return extractAllClaims(token).get("userId", Long.class);
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
