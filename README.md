# Portafolio — Sebastián Vivas

Índice para revisar tres proyectos web incrustados y funcionando: **SYN**, **Spotia** y **Nexity**.

## Verlo en local

Doble clic en **`abrir-portafolio.command`**. Levanta un servidor local y abre el navegador.
Para apagarlo, cierra la ventana de Terminal.

Equivalente a mano, desde esta carpeta:

```bash
python3 -m http.server 8787
```

y abrir <http://localhost:8787/>.

> No sirve abrir `index.html` con doble clic: sobre `file://` el navegador bloquea los
> iframes entre archivos locales y los tres proyectos se verían en blanco.

## Enlaces directos

Cada proyecto tiene su propia dirección, así que se puede compartir uno solo:

| Proyecto | Enlace |
|---|---|
| SYN | `#/syn` |
| Spotia — Spotia Makers | `#/spotia/0` |
| Spotia — Maqueta base | `#/spotia/1` |
| Nexity | `#/nexity` |

## Estructura

```
index.html                 el portafolio (portada + visor)
abrir-portafolio.command   arranque en local
.nojekyll                  para GitHub Pages
SYN/web/                   proyecto 1
Spotia/Landing/            proyecto 2 (.dc.html)
Nexity/v3 (publicada)/     proyecto 3 (portada + cinco módulos)
```

Los tres proyectos quedan intactos: el portafolio los incrusta, no los modifica.

## Notas

- **Spotia** son artboards de Claude Design: cargan React desde `unpkg.com`, así que
  necesitan conexión a internet para renderizar.
- **Nexity** usa la tipografía Atyp (Adobe Fonts, kit `kzl0etn`), que solo carga en los
  dominios registrados en el kit. En `localhost` y en `github.io` se verá con la
  tipografía de respaldo hasta registrar esos dominios en fonts.adobe.com.

## Publicar

Repositorio en GitHub → *Settings* → *Pages* → *Deploy from a branch* → rama `main`, carpeta `/ (root)`.
No hace falta cambiar nada más: todas las rutas son relativas.
