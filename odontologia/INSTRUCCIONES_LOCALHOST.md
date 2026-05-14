# 🚀 Instrucciones para Probar en Localhost

## Requisitos Previos

1. ✅ MySQL instalado y corriendo
2. ✅ Java JDK instalado
3. ✅ Node.js y npm instalados
4. ✅ Base de datos `consultorio_aqua` creada (o se creará automáticamente)

---

## Paso 1: Verificar/Crear la Base de Datos MySQL

Abre MySQL y ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS consultorio_aqua;
```

O verifica que la base de datos exista. El backend la creará automáticamente si usas `ddl-auto=update`.

**Credenciales configuradas en `application-dev.properties`:**
- Usuario: `root`
- Contraseña: `Arribalos80!`
- Base de datos: `consultorio_aqua`
- Puerto: `3306`

Si tus credenciales son diferentes, edita `src/main/resources/application-dev.properties`.

---

## Paso 2: Ejecutar el Backend (Spring Boot)

Abre una **Terminal/PowerShell** y ejecuta:

```powershell
# Navegar a la raíz del proyecto
cd c:\Users\matee\Downloads\odontologia\odontologia

# Ejecutar el backend con perfil de desarrollo
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

**O si prefieres usar Maven directamente:**

```powershell
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Espera a ver este mensaje:**
```
Started ConsultorioOdontologicoAquaApplication in X.XXX seconds
```

El backend estará disponible en: **http://localhost:8080**

---

## Paso 3: Ejecutar el Frontend (React + Vite)

Abre **otra Terminal/PowerShell** (deja el backend corriendo) y ejecuta:

```powershell
# Navegar a la carpeta del frontend
cd c:\Users\matee\Downloads\odontologia\odontologia\fronendvite\consultorioOdontologicoAqua

# Instalar dependencias (solo la primera vez o si cambiaste algo)
npm install

# Ejecutar el servidor de desarrollo
npm run dev
```

**Espera a ver este mensaje:**
```
  VITE v6.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

El frontend estará disponible en: **http://localhost:5173**

---

## Paso 4: Probar la Aplicación

1. Abre tu navegador en: **http://localhost:5173**
2. Deberías ver la pantalla de login
3. Si no tienes usuario, puedes registrarte
4. El frontend se conectará automáticamente a `http://localhost:8080/api`

---

## ⚠️ Solución de Problemas

### Error: "Cannot connect to database"
- Verifica que MySQL esté corriendo
- Verifica las credenciales en `application-dev.properties`
- Verifica que la base de datos exista

### Error: "Port 8080 already in use"
- Algo más está usando el puerto 8080
- Cambia el puerto en `application-dev.properties`: `server.port=8081`
- Actualiza `config.js` para usar el nuevo puerto

### Error: "Port 5173 already in use"
- Vite usará automáticamente el siguiente puerto disponible (5174, 5175, etc.)
- O detén el proceso que está usando el puerto

### Error de CORS
- El backend ya está configurado para aceptar `http://localhost:5173`
- Si cambias el puerto del frontend, actualiza `SecurityConfig.java`

### El frontend no se conecta al backend
- Verifica que el backend esté corriendo en `http://localhost:8080`
- Abre `http://localhost:8080/api/auth/login` en el navegador para verificar
- Revisa la consola del navegador (F12) para ver errores

---

## 📝 Notas Importantes

1. **No necesitas crear `.env.local`** - El `config.js` ya tiene un fallback a localhost
2. **El backend debe estar corriendo antes** de usar el frontend
3. **Mantén ambas terminales abiertas** mientras desarrollas
4. **Para detener:**
   - Backend: `Ctrl + C` en la terminal del backend
   - Frontend: `Ctrl + C` en la terminal del frontend

---

## 🎯 Comandos Rápidos (Resumen)

**Terminal 1 - Backend:**
```powershell
cd c:\Users\matee\Downloads\odontologia\odontologia
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

**Terminal 2 - Frontend:**
```powershell
cd c:\Users\matee\Downloads\odontologia\odontologia\fronendvite\consultorioOdontologicoAqua
npm run dev
```

¡Listo! 🎉

