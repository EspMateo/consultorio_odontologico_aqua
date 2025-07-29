# Plan de Tratamiento

## Descripción
El componente Plan de Tratamiento permite gestionar los tratamientos odontológicos de los pacientes. Permite crear nuevos tratamientos, visualizar el tratamiento actual y revisar tratamientos anteriores.

## Funcionalidades

### 1. Acceso al Plan de Tratamiento
- Se accede desde la Historia Clínica
- Aparece un botón "📋 Plan de Tratamiento" debajo de la selección de fecha
- Solo visible cuando hay un paciente seleccionado

### 2. Panel de Tratamiento Actual
- Muestra el tratamiento activo del paciente
- Incluye:
  - Nombre del tratamiento
  - Descripción
  - Duración
  - Fecha de inicio y fin
  - Seguimiento
  - Estado (Activo/Inactivo)

### 3. Crear Nuevo Tratamiento
- Botón "Crear Nuevo Tratamiento" que abre un modal
- Campos del formulario:
  - **Nombre del Tratamiento** (obligatorio)
  - **Descripción** (obligatorio)
  - **Duración** (opcional)
  - **Seguimiento** (opcional)
  - **Fecha de Inicio** (opcional)
  - **Fecha de Fin** (opcional)

### 4. Tratamientos Anteriores
- Lista de tratamientos previos del paciente
- Muestra estado y detalles de cada tratamiento
- Solo visible si hay más de un tratamiento

## Estructura de Datos

### Tratamiento
```javascript
{
  id: number,
  nombre: string,
  descripcion: string,
  duracion: string,
  fechaInicio: string (YYYY-MM-DD),
  fechaFin: string (YYYY-MM-DD),
  seguimiento: string,
  activo: boolean,
  pacienteId: number
}
```

## Endpoints de API

### GET /api/tratamientos/paciente/{pacienteId}
Obtiene todos los tratamientos de un paciente específico.

### POST /api/tratamientos
Crea un nuevo tratamiento.

**Body:**
```javascript
{
  nombre: string,
  descripcion: string,
  duracion: string,
  fechaInicio: string,
  fechaFin: string,
  seguimiento: string,
  pacienteId: number,
  activo: boolean
}
```

## Uso

### En Historia Clínica
```jsx
import PlanTratamiento from './PlanTratamiento';

// En el componente HistoriaClinica
const [showPlanTratamiento, setShowPlanTratamiento] = useState(false);

const handlePlanTratamiento = () => {
  setShowPlanTratamiento(true);
};

const handleClosePlanTratamiento = () => {
  setShowPlanTratamiento(false);
};

// En el JSX
{showPlanTratamiento && (
  <PlanTratamiento 
    paciente={pacienteSeleccionado}
    onClose={handleClosePlanTratamiento}
  />
)}
```

## Estilos

El componente utiliza estilos modulares en `PlanTratamiento.css` con:
- Diseño responsive
- Animaciones suaves
- Gradientes modernos
- Estados de carga
- Mensajes de feedback

## Características Técnicas

- **Modal overlay** con backdrop
- **Validación de formularios** en el frontend
- **Estados de carga** con spinners
- **Mensajes de error/éxito** con auto-dismiss
- **Responsive design** para móviles
- **Animaciones CSS** para mejor UX
- **Gestión de estado** con React hooks

## Dependencias

- React (useState, useEffect)
- Axios para llamadas HTTP
- CSS modules para estilos
- buildApiUrl de config.js 