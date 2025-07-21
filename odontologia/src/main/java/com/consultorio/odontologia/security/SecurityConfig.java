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
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/usuarios/login", "/api/usuarios/register", "/api/usuarios/check-email/**").permitAll()
                        .requestMatchers("/api/pacientes/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/citas/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/citas/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/citas/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/historia-clinica/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/api/historia-clinica/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/historia-clinica/paciente/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/historia-clinica/**").permitAll()
                        .requestMatchers("/", "/error").permitAll()
                        .requestMatchers("/api/odontogramas/**").permitAll()
                        .requestMatchers("/api/periodoncia/**").permitAll()
                        .anyRequest().authenticated());

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "http://localhost:3000",
            "https://consultorio-odontologico-aqua.vercel.app"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type", 
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
