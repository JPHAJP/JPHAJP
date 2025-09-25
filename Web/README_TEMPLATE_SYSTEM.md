# Sistema de Plantillas de Proyectos

Este sistema permite crear páginas web para mostrar proyectos de manera consistente y profesional usando un JavaScript genérico y archivos JSON de configuración.

## Estructura del Sistema

```
Web/
├── js/
│   └── main_projects.js          # JavaScript genérico
├── styles/
│   └── styles_projects.css       # Estilos CSS
├── template_project_generic.html # Plantilla HTML genérica
└── projects/
    ├── proyecto-1/
    │   ├── index.html            # HTML específico del proyecto
    │   └── config_project.json   # Configuración del proyecto
    └── proyecto-2/
        ├── index.html
        └── config_project.json
```

## Cómo Usar el Sistema

### 1. Crear un Nuevo Proyecto

1. **Copia la plantilla**: Usa `template_project_generic.html` como base
2. **Ajusta las rutas**: Modifica las rutas CSS y JS según tu estructura de carpetas
3. **Especifica el config**: Define la ruta del archivo JSON de configuración

### 2. Especificar la Ruta del Archivo JSON

Hay 3 formas de especificar la ruta del archivo `config_project.json`:

#### Opción 1: Data attribute en el script tag (Recomendado)
```html
<script src="../../js/main_projects.js" data-config="./config_project.json"></script>
```

#### Opción 2: Meta tag
```html
<meta name="project-config" content="./config_project.json">
```

#### Opción 3: Data attribute en el body
```html
<script>document.body.dataset.config = "./config_project.json";</script>
```

### 3. Configurar el Archivo JSON

Crea un archivo `config_project.json` con la siguiente estructura:

```json
{
  "project": {
    "title": "Nombre del Proyecto",
    "subtitle": "Subtítulo descriptivo",
    "shortDescription": "Descripción breve para el hero",
    "status": "En desarrollo", // "Completado", "En pausa", etc.
    "repository": "https://github.com/usuario/repo",
    "documentation": "ruta/al/pdf/documentacion.pdf",
    "tags": ["Tag1", "Tag2", "Tag3"]
  },
  "overview": {
    "problem": "Descripción del problema que resuelve",
    "solution": "Descripción de la solución implementada",
    "impact": "Impacto o beneficios del proyecto"
  },
  "stats": [
    {
      "value": "100%",
      "label": "Precisión"
    },
    {
      "value": "50ms",
      "label": "Tiempo"
    }
  ],
  "media": {
    "videos": [
      {
        "src": "ruta/al/video.mp4",
        "title": "Título del video",
        "description": "Descripción del video"
      }
    ],
    "images": [
      {
        "src": "ruta/a/imagen.jpg",
        "alt": "Texto alternativo",
        "caption": "Descripción de la imagen"
      }
    ],
    "diagrams": [
      {
        "src": "ruta/a/diagrama.png",
        "alt": "Texto alternativo",
        "title": "Título del diagrama"
      }
    ]
  },
  "technologies": {
    "ai": [
      {
        "name": "TensorFlow",
        "description": "Machine Learning",
        "icon": "ruta/al/icono.png"
      }
    ],
    "development": [
      {
        "name": "Python",
        "description": "Lenguaje principal",
        "icon": "ruta/al/icono.png"
      }
    ]
  },
  "achievements": [
    {
      "date": "2024-01-01",
      "title": "Primer lugar en competencia",
      "type": "Premio",
      "description": "Descripción del logro",
      "image": "ruta/a/imagen.jpg",
      "link": "https://enlace-externo.com"
    }
  ],
  "author": {
    "name": "Tu Nombre",
    "institution": "Tu Institución",
    "email": "tu@email.com",
    "social": {
      "github": "https://github.com/tuusuario",
      "linkedin": "https://linkedin.com/in/tuusuario",
      "twitter": "https://twitter.com/tuusuario"
    }
  },
  "settings": {
    "theme": {
      "primaryColor": "#1a237e",
      "secondaryColor": "#ffffff",
      "accentColor": "#304ffe"
    }
  }
}
```

## Ejemplos de Uso

### Ejemplo 1: Proyecto en subcarpeta
```html
<!-- En projects/mi-proyecto/index.html -->
<script src="../../js/main_projects.js" data-config="./config_project.json"></script>
```

### Ejemplo 2: Proyecto en carpeta raíz
```html
<!-- En mi-proyecto.html -->
<script src="./js/main_projects.js" data-config="./mi-proyecto-config.json"></script>
```

### Ejemplo 3: Config en otra ubicación
```html
<script src="../js/main_projects.js" data-config="../configs/proyecto-especial.json"></script>
```

## Características

### 📱 Responsive Design
- Diseño adaptable a dispositivos móviles
- Optimizado para tablets y desktop

### 🎥 Soporte Multimedia
- Videos con compatibilidad iOS
- Galería de imágenes con modal
- Diagramas técnicos

### 📄 Visor PDF
- Navegación por páginas
- Zoom in/out
- Descarga directa

### 🎨 Personalización
- Temas de color personalizables
- Iconos y estilos modificables

### ⚡ Optimizado
- Carga lazy de imágenes
- Animaciones suaves
- SEO friendly

## Ventajas del Sistema Genérico

1. **Reutilizable**: Un solo archivo JS para todos los proyectos
2. **Mantenible**: Actualizaciones centralizadas
3. **Flexible**: Diferentes configuraciones por proyecto
4. **Escalable**: Fácil agregar nuevos proyectos

## Solución de Problemas

### El JSON no se carga
- Verifica que la ruta sea correcta y relativa al archivo HTML
- Asegúrate de que el archivo JSON tenga sintaxis válida
- Revisa la consola del navegador para errores

### Los videos no funcionan en iOS
- El sistema incluye compatibilidad automática para iOS
- Los videos deben estar en formato MP4
- Se requiere interacción del usuario para reproducir

### El PDF no se muestra
- Verifica que la ruta del PDF sea correcta
- Asegúrate de que el archivo PDF sea accesible
- Revisa que PDF.js esté cargado correctamente
