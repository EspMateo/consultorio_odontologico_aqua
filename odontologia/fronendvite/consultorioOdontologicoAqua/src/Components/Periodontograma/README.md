# Periodontograma

## Descripción
El Periodontograma es un componente que permite registrar y visualizar la información periodontal de cada diente del paciente. Incluye todas las mediciones y evaluaciones necesarias para el diagnóstico periodontal.

## Funcionalidades

### 1. Pronóstico Individual
- **D**: Dependiente
- **F**: Favorable  
- **R**: Reservado

### 2. Condición Mucogingival
- **R**: Recesión gingival/Mucosa
- **FA**: Frenillo/brida aberrante
- **V**: Vestíbulo poco profundo
- **F**: Fenestración
- **O**: Otra

### 3. Movilidad
- Escala del 0 al 3
- 0: Sin movilidad
- 1: Movilidad leve
- 2: Movilidad moderada
- 3: Movilidad severa

### 4. Profundidad de Sondaje
- Rango: 1-15mm
- **Color Verde**: 1-3mm (normal)
- **Color Rojo**: 4+mm (patológico)
- Se mide en 4 sectores por diente:
  - Mesial
  - Vestibular
  - Distal
  - Lingual

### 5. Migración Gingival
- Rango: -10 a +15
- Se mide en los mismos 4 sectores
- Valores negativos indican recesión
- Valores positivos indican hiperplasia

### 6. Sangrado
- **Primer click**: Rojo (sangrado activo)
- **Segundo click**: Amarillo (sangrado leve)
- **Tercer click**: Sin sangrado
- Se registra por sector

### 7. Lesión de Furca
- Solo disponible para dientes 14-18 y 24-28
- Escala del 0 al 4
- 0: Sin lesión
- 1-4: Grado de lesión

### 8. Dientes Ausentes
- Los dientes marcados como ausentes en el odontograma se muestran deshabilitados
- No se pueden registrar datos para dientes ausentes
- Se puede marcar/desmarcar dientes como ausentes manualmente

## Integración con Odontograma
- El periodontograma verifica automáticamente los dientes ausentes del odontograma
- Los dientes ausentes se muestran deshabilitados
- Mantiene sincronización con el estado del odontograma

## Estructura de Datos

```javascript
{
  diente: {
    pronostico: "D|F|R",
    condicionMucogingival: "R|FA|V|F|O",
    movilidad: 0-3,
    profundidadSondaje: {
      mesial: 0-15,
      vestibular: 0-15,
      distal: 0-15,
      lingual: 0-15
    },
    migracionGingival: {
      mesial: -10-15,
      vestibular: -10-15,
      distal: -10-15,
      lingual: -10-15
    },
    sangrado: {
      mesial: false|"rojo"|"amarillo",
      vestibular: false|"rojo"|"amarillo",
      distal: false|"rojo"|"amarillo",
      lingual: false|"rojo"|"amarillo"
    },
    lesionFurca: 0-4, // Solo dientes específicos
    ausente: boolean
  }
}
```

## Uso

1. **Acceso**: Desde la tabla de pacientes, hacer click en "Periodontograma"
2. **Navegación**: Los dientes se organizan en dos filas (superiores e inferiores)
3. **Edición**: Click en cualquier diente para editar sus datos
4. **Guardado**: Click en "Guardar Periodontograma" para persistir los datos

## Características Técnicas

- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Persistencia**: Guarda automáticamente en la base de datos
- **Validación**: Controla rangos y valores válidos
- **Sincronización**: Se integra con el odontograma
- **Interfaz intuitiva**: Colores y símbolos para facilitar la interpretación

## Colores y Símbolos

- **Verde**: Profundidad normal (1-3mm)
- **Rojo**: Profundidad patológica (4+mm)
- **Amarillo**: Sangrado leve
- **Rojo**: Sangrado activo
- **Gris**: Diente ausente/deshabilitado 