#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sella los CSS y JS con la huella de su contenido para que el navegador
no siga mostrando la version vieja despues de publicar.

Uso:  python3 sellar.py

Cada vez que cambia un archivo cambia su huella, y con ella la direccion
que pide el navegador, asi que baja el nuevo en vez de usar el del cache.
"""
import hashlib
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent


def huella(archivo: Path) -> str:
    return hashlib.md5(archivo.read_bytes()).hexdigest()[:8]


def sellar(pagina: Path) -> int:
    texto = pagina.read_text(encoding="utf-8")
    original = texto
    cambios = 0

    # href="algo.css" o src="algo.js", con o sin ../ delante y con o sin ?v= previo
    patron = re.compile(r'((?:href|src)=")((?:\.\./)?[\w./-]+\.(?:css|js))(?:\?v=[0-9a-f]+)?(")')

    def reemplazo(m):
        nonlocal cambios
        destino = (pagina.parent / m.group(2)).resolve()
        if not destino.is_file():
            return m.group(0)
        cambios += 1
        return f"{m.group(1)}{m.group(2)}?v={huella(destino)}{m.group(3)}"

    texto = patron.sub(reemplazo, texto)
    if texto != original:
        pagina.write_text(texto, encoding="utf-8")
    return cambios


def main():
    paginas = sorted(RAIZ.glob("*.html")) + sorted((RAIZ / "modulos").glob("*.html"))
    total = 0
    for p in paginas:
        n = sellar(p)
        total += n
        print(f"  {p.relative_to(RAIZ)}: {n} referencias selladas")
    print(f"\n{total} referencias en {len(paginas)} paginas")


if __name__ == "__main__":
    main()
