#!/bin/bash
# Levanta el portafolio en un servidor local y lo abre en el navegador.
#
# Hace falta servirlo por HTTP: abriendo el index.html con doble clic (file://)
# el navegador bloquea los iframes entre archivos locales y los tres proyectos
# se verían en blanco.
#
# Para apagarlo: Ctrl+C aquí, o simplemente cerrar esta ventana de Terminal.

cd "$(dirname "$0")" || exit 1

# Primer puerto libre a partir del 8787, por si otra cosa ya lo está usando.
PUERTO=8787
while lsof -i :"$PUERTO" >/dev/null 2>&1; do
  PUERTO=$((PUERTO + 1))
  [ "$PUERTO" -gt 8807 ] && { echo "No hay puertos libres entre 8787 y 8807."; exit 1; }
done

URL="http://localhost:$PUERTO/"

echo ""
echo "  Portafolio corriendo en:  $URL"
echo "  Carpeta:                  $(pwd)"
echo ""
echo "  Para apagarlo: Ctrl+C, o cierra esta ventana."
echo "  ─────────────────────────────────────────────────────────"
echo ""

# El servidor primero, el navegador un instante después, para que no
# llegue antes de que el puerto esté escuchando.
( sleep 1; open "$URL" ) &

python3 -m http.server "$PUERTO" --bind 127.0.0.1
