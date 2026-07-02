#!/usr/bin/env bash
set -euo pipefail
pdflatex -interaction=nonstopmode -halt-on-error cv_visual_fiel_jpha.tex
pdflatex -interaction=nonstopmode -halt-on-error cv_visual_fiel_jpha.tex
pdflatex -interaction=nonstopmode -halt-on-error cv_ats_moderno_jpha.tex
pdflatex -interaction=nonstopmode -halt-on-error cv_ats_moderno_jpha.tex
