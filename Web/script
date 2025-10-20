#!/bin/bash
set -e # Salir inmediatamente si un comando falla

# --- CONFIGURACIÓN ---
ENCODER_TYPE="CPU"
TARGET_SIZE_KB=50
# --- FIN DE LA CONFIGURACIÓN ---

# --- LÓGICA DE RUTAS (NO MODIFICAR) ---
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
INPUT_DIR="$SCRIPT_DIR/assets/img"
OUTPUT_DIR="$SCRIPT_DIR/webp_comprimidos"

# --- VERIFICACIÓN INICIAL ---
if [ ! -d "$INPUT_DIR" ]; then
    echo "❌ Error: No se pudo encontrar el directorio de entrada en la ruta:"
    echo "   $INPUT_DIR"
    exit 1
fi

mkdir -p "$OUTPUT_DIR"
echo "⚙️  Usando el CPU (máxima compresión)..."
echo "📂 Directorio de entrada: $INPUT_DIR"
echo "📂 Directorio de salida:  $OUTPUT_DIR"

# --- BUCLE DE PROCESAMIENTO ---
find "$INPUT_DIR" -type f -iname "*.gif" | while read input_file; do
    
    echo "========================================================"
    echo "Procesando archivo: $input_file"
    
    filename=$(basename -- "$input_file")
    base_name="${filename%.*}"
    output_file="$OUTPUT_DIR/${base_name}.webp"

    duration=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$input_file")
    target_bitrate=$(LC_NUMERIC=C printf "%.0f" "$(echo "$TARGET_SIZE_KB * 8 / $duration" | bc -l)")

    echo "   Duración: ${duration}s | Bitrate: ${target_bitrate}k"
    echo "   Ejecutando compresión..."

    # ✅ CORRECCIÓN FINAL: Se añade un filtro de video (-vf) para corregir dimensiones y formato de color.
    VIDEO_FILTERS="scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p"

    if [ "$ENCODER_TYPE" = "CPU" ]; then
        # Para archivos WebP, usamos libwebp
        ffmpeg -y -i "$input_file" -c:v libwebp -b:v "${target_bitrate}k" -vf "$VIDEO_FILTERS" -loop 0 -an "$output_file" -v error < /dev/null
    else
        echo "La compresión por GPU no está configurada en este momento."
    fi

    echo "✅ ¡Completado! -> $output_file"
done

# Limpiar los archivos de registro
rm -f ffmpeg2pass-0.log ffmpeg2pass-0.log.mbtree

echo "========================================================"
echo "🎉 ¡Proceso finalizado!"
echo "========================================================"