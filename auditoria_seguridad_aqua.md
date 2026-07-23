# Auditoría de seguridad — Consultorio Odontológico AQUA

Revisión del código pensando en un despliegue a internet (Railway + Vercel, según el README). Se listan los hallazgos de mayor a menor severidad, con el archivo exacto donde está cada problema y cómo corregirlo. Todos los hallazgos fueron verificados leyendo el código, no son suposiciones genéricas.

**Estado:** los puntos 1 (sin autenticación real) y 2 (contraseñas en texto plano / filtradas) ya están corregidos: se implementó JWT real, bcrypt, y se sacó el campo `password` de todas las respuestas. Ver la sección "Segunda revisión" al final para lo encontrado en esa implementación y lo que sigue pendiente.

---

## CRÍTICO — bloqueantes antes de salir a producción

### 1. No hay autenticación real en el backend

`SecurityConfig.java` marca **todas** las rutas de negocio como `permitAll()`: `/api/citas/**`, `/api/pacientes/**`, `/api/historia-clinica/**`, `/api/diagnosticos/**`, `/api/tratamientos/**`, `/api/odontograma/**`, `/api/periodoncia/**`, `/api/periodontograma/**`, `/api/presupuesto/**`, `/api/gastos/**`, `/api/usuarios/**`. La única línea que exige autenticación (`anyRequest().authenticated()`) nunca se cumple porque no hay ningún mecanismo real de autenticación configurado (no hay filtro JWT, no hay sesión, no hay nada que popule el `SecurityContext`).

El "login" que existe es enteramente cosmético y vive solo en el frontend: `ProtectedRoute.jsx` únicamente verifica que exista la clave `token` en `localStorage`, y `Login.jsx` la setea como `res.data.token || 'dummy-token'` — es decir, ni siquiera hay un token real, es un string fijo.

**Impacto real:** cualquiera que sepa la URL del backend desplegado puede leer, crear, modificar o borrar pacientes, citas, historias clínicas, diagnósticos, tratamientos y presupuestos con un simple `curl` o Postman, sin necesidad de loguearse. En una app que maneja historias clínicas de pacientes, esto es el hallazgo más grave de toda la revisión.

**Cómo corregirlo:** implementar autenticación real de verdad en el backend (Spring Security + JWT, tal como dice el README que "ya está" pero no está implementado). Cada endpoint que no sea `/api/auth/**` debería exigir un token válido, verificado en el servidor.

---

### 2. Contraseñas en texto plano — guardadas y filtradas en respuestas

**Guardado y verificación sin hash.** `UsuarioService.java`:
```java
public Optional<Usuario> login(String email, String password) {
    return usuarioRepository.findByEmail(email)
            .filter(usuario -> usuario.getPassword().equals(password));
}
```
Compara la contraseña como texto plano. `save()` tampoco hashea nada antes de persistir. Curiosamente `SecurityConfig.java` ya tiene un bean `BCryptPasswordEncoder` definido — está creado pero nunca se usa.

**Filtración de la contraseña en respuestas JSON.** La entidad `Usuario.java` no tiene `@JsonIgnore` en el campo `password`, así que cualquier endpoint que serialice un `Usuario` (directo o anidado) lo devuelve en la respuesta:
- `AuthController.login()` y `.register()` devuelven el `Usuario` completo, contraseña incluida.
- `Cita.java` tiene un campo `usuario` (relación `@ManyToOne`) sin `@JsonIgnore`. `CitaController.crearCita()` y `.actualizarCita()` devuelven `ResponseEntity<Cita>` directamente → cada vez que se agenda o edita una cita, la respuesta trae la contraseña del doctor en texto plano.
- Lo mismo pasa con `HistoriaClinica.java` (también tiene `usuario`): `HistoriaClinicaController.crear()` arma un `Map` con `response.put("historiaClinica", nueva)`, donde `nueva` es la entidad completa → misma filtración.

**Cómo corregirlo:**
- Hashear contraseñas con el `BCryptPasswordEncoder` que ya existe, tanto al registrar como al comparar en el login.
- Nunca devolver la entidad `Usuario` completa. Agregar `@JsonIgnore` al campo `password` como mínimo, y, mejor todavía, usar siempre DTOs de salida (el proyecto ya tiene el patrón `UsuarioDTO`, `CitaDTO`, etc. — solo falta aplicarlo de forma consistente en todos los controllers).

---

### 3. Credenciales de base de datos commiteadas en el repo

`application.properties` y `application-dev.properties` tienen usuario y contraseña de MySQL hardcodeados en texto plano (`root` / `aqua123!` y `root` / `Arribalos80!`). Si el repositorio es público en GitHub (o se hace público más adelante), cualquiera puede ver esas credenciales.

Punto a favor: `application-prod.properties` sí está bien hecho, usa variables de entorno (`${DB_HOST}`, `${DB_USER}`, `${DB_PASSWORD}`) — ese archivo no filtra nada.

**Cómo corregirlo:** mover también las credenciales de dev a variables de entorno (o a un `application-dev-local.properties` fuera de git), y rotar esas dos contraseñas de MySQL ya que quedaron expuestas en el historial de git.

---

## ALTO

### 4. Sin límite de intentos de login (fuerza bruta)

`AuthController.login()` no tiene ningún control de intentos fallidos, captcha, ni rate limiting. Combinado con el punto 2 (sin hash), un atacante puede probar contraseñas sin límite contra cualquier email.

**Cómo corregirlo:** agregar rate limiting (por IP y/o por email) en el login, por ejemplo con Bucket4j o un contador simple en Redis/memoria con bloqueo temporal tras N intentos fallidos.

### 5. `ddl-auto=update` en producción

`application-prod.properties` tiene `spring.jpa.hibernate.ddl-auto=update`. Esto hace que Hibernate modifique automáticamente el esquema de la base de datos real cada vez que arranca el backend, según lo que vea en las entidades. Es cómodo en desarrollo pero riesgoso en producción: un cambio de tipo de columna o un typo en una entidad puede alterar o corromper datos reales sin que nadie lo revise antes.

**Cómo corregirlo:** usar `validate` o `none` en producción, y manejar los cambios de esquema con una herramienta de migraciones (Flyway o Liquibase) que se pueda revisar antes de aplicar.

### 6. CORS más permisivo de lo necesario

`SecurityConfig.corsConfigurationSource()` tiene `setAllowCredentials(true)` combinado con `addAllowedOrigin("null")` (permite pedidos con `Origin: null`, que se puede falsificar fácilmente desde un iframe sandboxeado o un archivo HTML local) y un patrón wildcard `https://*.vercel.app` (cualquier proyecto de Vercel de cualquier persona podría, en teoría, hacer pedidos con credenciales a tu API). Como hoy no hay cookies de sesión reales en juego, el riesgo práctico es bajo, pero conviene ajustarlo antes de depender de autenticación real.

**Cómo corregirlo:** una vez el frontend esté en su dominio final, restringir `allowedOriginPatterns` a ese dominio exacto (y a `localhost` solo en desarrollo), y sacar el `"null"` si no es estrictamente necesario para Electron.

---

## MEDIO

### 7. Falta de validación de entrada

Salvo un par de chequeos manuales en `AuthController.register()` (email/password/nombre no vacíos), casi ningún DTO usa Bean Validation (`@NotBlank`, `@Email`, `@Size`, etc. con `@Valid` en el controller). Esto permite mandar payloads vacíos, campos gigantes, o tipos inesperados que después revientan más abajo en la capa de servicio.

**Cómo corregirlo:** agregar anotaciones de validación en los DTOs y `@Valid` en los `@RequestBody` de los controllers.

### 8. Manejo de excepciones que no deja rastro

Prácticamente todos los controllers (`CitaController`, `AuthController`, etc.) capturan `Exception` genérica y devuelven un 400/500 sin loguear nada (`e.printStackTrace()` o un logger no aparece en ningún lado). Esto evita fugas de información al cliente (bien), pero también significa que si alguien está atacando la API en producción, no vas a tener ningún log para detectarlo.

**Cómo corregirlo:** loguear la excepción del lado del servidor (con un logger, no `System.out`) antes de devolver la respuesta genérica al cliente.

### 9. Dependencias

El proyecto usa Spring Boot 3.4.5. Antes de salir a producción conviene correr `mvn versions:display-dependency-updates` (o `npm audit` del lado del frontend) y actualizar a la última versión patch, ya que suelen incluir correcciones de seguridad.

---

## Plan de acción sugerido (en orden)

1. Implementar autenticación real (JWT) y proteger todos los endpoints salvo `/api/auth/**`.
2. Hashear contraseñas (bcrypt) y sacar el campo `password` de cualquier respuesta JSON.
3. Rotar las contraseñas de MySQL que quedaron en el repo y mover las de dev a variables de entorno.
4. Agregar rate limiting al login.
5. Cambiar `ddl-auto` a `validate` en producción.
6. Ajustar CORS al dominio final.
7. Agregar validación de entrada en los DTOs principales (paciente, cita, historia clínica).

Los puntos 1 y 2 son los que de verdad importan antes de poner esto en internet — el resto se puede ir haciendo en paralelo o después del primer deploy.

---

## Segunda revisión (después de implementar JWT + bcrypt)

### 10. Spring Security devolvía 403 en vez de 401 sin token — ya corregido

Al no tener configurado `httpBasic()`/`formLogin()`, Spring Security usa por defecto un `Http403ForbiddenEntryPoint`: cualquier request sin token (o con uno vencido/inválido) devolvía **403**, no 401. El interceptor del frontend (`config.js`) solo escuchaba 401 para cerrar la sesión y mandar al login, así que un token vencido hubiera quedado mostrando errores confusos en vez de mandar a la persona de vuelta al login. Ya se agregó un `authenticationEntryPoint` explícito en `SecurityConfig.java` que fuerza el 401 en ese caso.

### 11. El `usuarioId`/doctor lo manda el cliente, no se saca del token — pendiente

Ahora que hay autenticación real, vale la pena cerrar este otro hueco: varios endpoints reciben el id del doctor como un campo más del JSON que manda el navegador, en vez de sacarlo del JWT ya validado:

- `CitaService.crearCita()` / `.actualizarCita()` usan `citaDTO.getUsuarioId()`.
- `DiagnosticoService` usa el mismo patrón (`usuarioId` del DTO).
- `HistoriaClinica.jsx` (líneas 449 y 515) ni siquiera manda el id del usuario logueado: tiene **hardcodeado** `usuario: { id: 1 }` en el `handleGuardar` y `handleModificar` — todas las historias clínicas quedan atribuidas al usuario 1 sin importar quién esté logueado. Esto es además un bug funcional, no solo de seguridad.

**Impacto:** cualquier usuario autenticado puede hacer que una cita o un diagnóstico queden atribuidos a otro doctor con solo cambiar un número en el body del request (suplantación dentro de la app). No es tan grave como el punto 1 original porque ya hace falta estar logueado, pero no debería depender de lo que mande el cliente.

**Cómo corregirlo:** en vez de leer `usuarioId` del DTO, sacar el id del usuario autenticado desde el `SecurityContext` (que ya lo tiene, `JwtAuthenticationFilter` lo guarda en `authentication.getDetails()`) y usar ese valor en el backend, ignorando lo que mande el cliente. Del lado del frontend, sacar el `usuario: { id: 1 }` hardcodeado de `HistoriaClinica.jsx` (ya no haría falta mandarlo).

### 12. CORS con `allowCredentials` + origen `null` — severidad más baja de lo que parecía

Con la autenticación ahora basada en un header `Authorization: Bearer <token>` (no en cookies), el riesgo real de `allowCredentials(true)` + `addAllowedOrigin("null")` bajó bastante: un sitio malicioso no puede leer el token guardado en `localStorage` de otra pestaña ni hacer que el navegador lo adjunte solo (como sí pasa con cookies). Sigue siendo buena práctica restringir los orígenes al dominio final antes de salir a producción, pero ya no es urgente.

### Lo que sigue pendiente de la primera revisión

Sin cambios todavía: rate limiting en el login (fuerza bruta), `ddl-auto=update` en `application-prod.properties`, falta de validación de entrada (`@Valid`) en la mayoría de los DTOs, y mantener las dependencias actualizadas.

---

## Tercera revisión — puntos restantes, ya resueltos

### 13. Rate limiting en el login — corregido

`LoginRateLimiter.java` (nuevo): bloquea el login de un email por 5 minutos después de 5 intentos fallidos seguidos. Es en memoria (por instancia del backend) — si en algún momento el backend corre en más de una instancia a la vez, habría que moverlo a Redis para que el límite se comparta.

### 14. `ddl-auto=update` en producción — corregido, con una advertencia

Cambiado a `validate` en `application-prod.properties`. Esto significa que Hibernate ya **no** va a alterar el esquema de la base de Railway solo. Importante: si el esquema actual de esa base tiene alguna diferencia con las entidades de Java (por mínima que sea), el backend **no va a arrancar** en el próximo deploy. Te recomiendo probar este cambio con cuidado — si el próximo deploy falla al arrancar, ese es el motivo, y se puede revertir a `update` momentáneamente mientras se ajusta el esquema a mano.

### 15. CORS con wildcard por controller — corregido

Encontrado en esta pasada: 8 controllers (`PacienteController`, `HistoriaClinicaController`, `DiagnosticoController`, `GastoController`, `TratamientoController`, `PresupuestoController`, `PeriodonciaController`, `PeriodontogramaController`) tenían `@CrossOrigin(origins = "*")`, permitiendo pedidos desde **cualquier** sitio web a esos endpoints — contradecía la configuración restrictiva de `SecurityConfig`. Se sacó de los 8 archivos; la configuración global de CORS ya cubre todo.

### 16. Validación de entrada — resuelto para lo más sensible

Se agregó `spring-boot-starter-validation` y se anotaron con `@NotBlank`/`@Email`/`@Size`/`@Min`/`@Max`: `PacienteDTO`, `CitaDTO` y `Usuario` (usada en `/api/auth/register` — el login no se tocó para no romperlo). Se agregó `@Valid` en los controllers correspondientes y un `GlobalExceptionHandler` que convierte los errores de validación en una respuesta 400 legible en vez del error genérico de Spring. No se cubrieron todos los DTOs de la app (historia clínica, presupuesto, etc. quedan sin validar) — se priorizaron los que reciben datos de pacientes y credenciales.

### 17. Dependencias desactualizadas — hallazgo importante

No pude correr `mvn` en este entorno (falta Maven y la versión de Java correcta), pero sí corrí `npm audit` sobre el frontend: **36 vulnerabilidades (25 altas, 3 críticas)**. Las dos que más importan porque son librerías que usa la app en producción (no solo herramientas de desarrollo):

- **`axios`** (la librería que hace *todos* los pedidos al backend): versión instalada vulnerable a varias fallas serias (SSRF, prototype pollution, fuga de credenciales). El rango que ya tenés en `package.json` (`^1.9.0`) permite actualizar a la versión arreglada sin tocar nada más.
- **`react-router-dom`**: vulnerable a XSS y open redirect. Mismo caso, el rango `^7.6.0` ya permite la versión arreglada.

Solución (correr en tu terminal, dentro de `fronendvite/consultorioOdontologicoAqua`):
```
npm update axios react-router-dom
npm audit
```
El resto de las vulnerabilidades son de herramientas de desarrollo/empaquetado (Electron, Vite, Rollup, electron-builder) — menos urgentes porque no corren en el navegador del usuario final, pero conviene revisarlas más adelante con `npm audit fix` (probando bien que el build de Electron siga funcionando después).

**Backend:** Spring Boot 3.4.5 (lo que usa el proyecto) quedó **fuera de soporte** el 30 de junio de 2026 — ya no recibe parches de seguridad. Lo mínimo recomendable es actualizar dentro de la misma rama 3.x a la última versión (3.5.16), que sí sigue teniendo parches acumulados de todo este año. Pasar a Spring Boot 4 (la rama activa hoy) es un cambio mayor —requiere Spring Framework 7— que conviene planear aparte, no de apuro. No hice este cambio en el `pom.xml` porque no tengo forma de compilar el proyecto en este entorno para confirmar que no rompe nada; te recomiendo probarlo vos con cuidado (cambiar la versión en `spring-boot-starter-parent`, correr `mvnw compile`) antes de subirlo a producción.
