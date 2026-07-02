# CV Jose Pablo Hernandez Alonso - LaTeX v3

Este paquete contiene dos versiones principales:

1. `cv_visual_fiel_jpha`: version visual fiel al PDF original.
2. `cv_ats_moderno_jpha`: version moderna para ATS, actualizada con enlaces directos en contacto, proyectos, ponencias y reconocimientos.

## Version visual fiel

Archivos:

- `cv_visual_fiel_jpha.tex`
- `cv_visual_fiel_jpha.pdf`
- `assets/original_cv_jpha.pdf`

Esta version prioriza fidelidad visual al PDF compartido. El archivo LaTeX coloca el PDF original como fondo vectorial de pagina completa y agrega rectangulos invisibles con `hyperref` para conservar enlaces clicables en portafolio, contacto, ponencias y proyectos.

Compilacion:

```bash
pdflatex cv_visual_fiel_jpha.tex
pdflatex cv_visual_fiel_jpha.tex
```

Requisitos LaTeX:

- `graphicx`
- `tikz`
- `hyperref`

## Version ATS moderna

Archivos:

- `cv_ats_moderno_jpha.tex`
- `cv_ats_moderno_jpha.pdf`

Esta version esta pensada para plataformas de reclutamiento y parsers ATS: estructura lineal, texto seleccionable, sin foto, sin QR y sin composicion compleja.

Enlaces actualizados:

- Contacto: email, web, portafolio, LinkedIn y GitHub.
- Experiencia: Palloranlabs Mexico.
- Proyectos: portfolio, StableDiffusion_t_gcode, UR5_SRUB_NURSE, SCADA industrial y NASA Space Apps 2024.
- Reconocimientos: certificado CENEVAL.
- Ponencias: Congreso SUJ, CONITACS, Expo IBERO 2021-2025, IEEE ICEV y Fab Academy.

Compilacion:

```bash
pdflatex cv_ats_moderno_jpha.tex
pdflatex cv_ats_moderno_jpha.tex
```

## Recomendacion de uso

- Usa `cv_visual_fiel_jpha.pdf` cuando quieras entregar el CV con el diseno visual original.
- Usa `cv_ats_moderno_jpha.pdf` para bolsas de trabajo, formularios y plataformas con parser ATS.
