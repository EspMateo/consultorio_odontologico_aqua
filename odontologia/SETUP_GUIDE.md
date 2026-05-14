# Guía de Setup — Consultorio Odontológico AQUA (branch `rebuildAqua`)

Esta guía cubre dos escenarios: correr el proyecto en **modo desarrollo** (para contribuir al código) y generar el **instalador de escritorio** listo para distribuir.

---

## Estructura del repositorio

```
odontologia/                        ← raíz del repo
├── src/                            ← Backend Spring Boot (Java 17)
│   └── main/resources/
│       ├── application.properties          ← perfil por defecto (MySQL)
│       ├── application-dev.properties      ← perfil dev (MySQL local, logs verbose)
│       └── application-desktop.properties  ← perfil desktop (H2 embebido, para el .exe)
├── fronendvite/consultorioOdontologicoAqua/ ← Frontend React + Electron
│   ├── main.cjs        ← proceso principal de Electron
│   ├── preload.cjs     ← bridge seguro renderer ↔ main
│   ├── loading.html    ← pantalla de carga mientras arranca Spring Boot
│   ├── src/            ← código React
│   └── release/        ← aquí aparece el instalador .exe tras el build
└── pom.xml
```

---

## Modo 1: Desarrollo local (recomendado para programar)

### Requisitos previos

| Herramienta | Versión mínima | Descarga |
|-------------|---------------|---------|
| Java JDK    | 17            | https://adoptium.net |
| Node.js     | 18            | https://nodejs.org |
| MySQL       | 8             | https://dev.mysql.com/downloads/ |
| Git         | cualquiera    | https://git-scm.com |

### Paso 1 — Clonar y pararse en la branch

```bash
git clone https://github.com/EspMateo/consultorio_odontologico_aqua.git
cd consultorio_odontologico_aqua
git checkout rebuildAqua
```

### Paso 2 — Configurar la base de datos MySQL

Abrí MySQL y ejecutá:

```sql
CREATE DATABASE consultorio_aqua CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Las credenciales ya configuradas en `application.properties` son:
- Usuario: `root`
- Contraseña: `aqua123!`
- Puerto: `3306`

Si tus credenciales son distintas, editá `src/main/resources/application.properties` antes de arrancar.

> El esquema se crea automáticamente con `ddl-auto=update` — no hay scripts de migración que correr.

### Paso 3 — Instalar dependencias del frontend

```bash
cd fronendvite/consultorioOdontologicoAqua
npm install
```

### Paso 4 — Arrancar el backend (Terminal 1)

Desde la raíz del repo:

```bash
# Windows
mvnw.cmd spring-boot:run

# Mac / Linux
./mvnw spring-boot:run
```

El backend queda escuchando en `http://localhost:8080`. Esperá a ver el mensaje:
```
Started OdontologiaApplication in X.XXX seconds
```

### Paso 5 — Arrancar el frontend + Electron (Terminal 2)

```bash
cd fronendvite/consultorioOdontologicoAqua
npm run electron:dev
```

Esto lanza Vite (`localhost:5173`) y luego abre la ventana de Electron automáticamente.
El hot-reload funciona: los cambios en el código React se reflejan sin reiniciar.

### Paso 6 — Crear el primer usuario

El registro está deshabilitado en la UI. Creá un usuario con:

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"tu_contraseña","email":"admin@clinica.com","rol":"ADMIN"}'
```

O insertá directamente en MySQL (la contraseña debe estar hasheada con BCrypt).

---

## Modo 2: Build del instalador de escritorio (.exe)

Este modo genera un instalador NSIS de Windows. La app resultante **no necesita MySQL** — usa H2 embebido que guarda los datos en `C:\Users\{usuario}\.consultorioAqua\db.mv.db`.

### Requisitos previos

Los mismos que el modo desarrollo, más:
- Maven disponible en PATH (o usar `mvnw`)
- El backend debe poder compilarse (`mvnw package`)

### Paso 1 — Build completo desde la carpeta del frontend

```bash
cd fronendvite/consultorioOdontologicoAqua
npm run build:full
```

Este comando hace todo en orden:
1. Compila el backend Spring Boot → `target/odontologia-0.0.1-SNAPSHOT.jar`
2. Compila el frontend React con Vite → `dist/`
3. Empaqueta todo con electron-builder → `release/`

### Paso 2 — Resultado

El instalador aparece en:
```
fronendvite/consultorioOdontologicoAqua/release/
└── Consultorio Odontológico Aqua Setup X.X.X.exe
```

### Lo que hace el instalador

- Instala la app en `C:\Program Files\Consultorio Odontológico Aqua\`
- Crea accesos directos en escritorio y menú inicio
- Al abrir la app, Electron lanza automáticamente el backend JAR embebido
- Se muestra una pantalla de carga mientras Spring Boot arranca (~10–20 seg)
- La base de datos H2 se crea automáticamente en el primer arranque

> **Requisito del usuario final:** debe tener **Java 17+** instalado. Si no lo tiene, la app muestra un mensaje con el enlace de descarga.

---

## Comandos útiles de referencia

```bash
# Frontend
npm run dev              # solo Vite (sin Electron, en browser)
npm run electron:dev     # Vite + Electron juntos (modo desarrollo)
npm run electron:build   # build completo → instalador .exe
npm run electron:pack    # build sin instalador (carpeta desempaquetada)
npm run lint             # ESLint

# Backend
mvnw.cmd spring-boot:run                        # arrancar con perfil default (MySQL)
mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev   # perfil dev (más logs)
mvnw.cmd test                                   # correr tests
mvnw.cmd package -DskipTests                    # compilar JAR sin tests
```

---

## Arquitectura de perfiles Spring Boot

| Perfil | Base de datos | Cuándo se usa |
|--------|--------------|---------------|
| (default) | MySQL `localhost:3306/consultorio_aqua` | `mvnw spring-boot:run` sin flags |
| `dev` | MySQL + logs DEBUG | desarrollo con más verbosidad |
| `desktop` | H2 embebido en `~/.consultorioAqua/` | app instalada (lanzada por Electron) |

El perfil `desktop` se activa automáticamente cuando Electron lanza el JAR:
```
java -jar backend.jar --spring.profiles.active=desktop
```

---

## Puertos y CORS

- Backend: `8080`
- Frontend dev: `5173`
- CORS configurado para: `localhost:5173`, `localhost:3000`, dominios Vercel/Railway, y `null` (Electron producción con `file://`)

---

## Problemas comunes

**"Java not found" al abrir la app instalada**
→ Instalar Java 17+ desde https://adoptium.net y reiniciar.

**"El servidor terminó inesperadamente (código X)"**
→ El puerto 8080 ya está en uso. Cerrá cualquier otra instancia de la app o proceso en ese puerto.

**La ventana de Electron no carga en dev**
→ Verificar que el backend esté corriendo en `:8080` y que Vite esté en `:5173`.

**Error de CORS en dev**
→ Confirmar que `SecurityConfig.java` tenga `http://localhost:5173` en los origins permitidos (ya está configurado).

**MySQL: "Access denied"**
→ Verificar credenciales en `application.properties`. Por defecto: `root` / `aqua123!`.
