package com.consultorio.odontologia.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
// import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity; // Considerar habilitar si usas @PreAuthorize/PostAuthorize
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer; // Importamos WebSecurityCustomizer
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
// @EnableMethodSecurity // Considerar habilitar si usas @PreAuthorize/PostAuthorize
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Deshabilitar CSRF explícitamente
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Permitir solicitudes OPTIONS
                .requestMatchers("/api/usuarios/login", "/api/usuarios/register").permitAll() // Permitir acceso a login y register
                .requestMatchers("/api/pacientes/**").permitAll() // Temporalmente permitimos todo acceso a pacientes
                .requestMatchers(HttpMethod.POST, "/api/citas/**").permitAll() // Permitir agendar citas
                .requestMatchers(HttpMethod.GET, "/api/citas/**").permitAll() // Permitir obtener citas
                .requestMatchers(HttpMethod.POST, "/api/historia-clinica/**").permitAll() // Permitir guardar historia clinica
                .requestMatchers(HttpMethod.GET, "/api/historia-clinica/**").permitAll() // Permitir obtener historia clínica
                .anyRequest().authenticated() // Cualquier otra solicitud requiere autenticación
            );
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
