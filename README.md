# SCaD Comunidad

Prototipo base de la aplicación **SCaD Comunidad**.

SCaD Comunidad es un producto neutral y configurable para comunidades organizadas. El frontend vive en GitHub; la autenticación, autorización, datos, validaciones y administración se integrarán con Wix Members, Wix/Velo y CMS.

## Estado

Versión inicial: `v0.1.0`

La interfaz actual es navegable y utiliza datos de demostración. No contiene todavía conexiones productivas con Wix.

## Módulos base

- **Programación**: calendario, filtros, tarjetas de evento y detalle. Los usuarios deberán ver sólo los eventos con los que estén vinculados.
- **Mensajería**: usuario ↔ usuario, usuario ↔ administración, sistema → usuario y administración → grupos.
- **Capacitación**: acceso a contenidos; integración prevista con Wix Members y Wix Pricing.
- **TV Comunidad**: selector configurable de canales, incluyendo TV Digital Internet 24/7 y canal de comunidad cuando corresponda.

Los módulos adicionales de cada implementación se consideran extensiones, no parte del núcleo estándar.

## Arquitectura prevista

```text
Frontend PWA (GitHub)
        │
        │ HTTPS / API
        ▼
Wix / Velo
  ├── Wix Members
  ├── Validaciones de acceso
  ├── CMS de SCaD Comunidad
  └── Panel administrativo Wix
```

## Archivos actuales

```text
index.html      UI principal
styles.css      sistema visual responsive
app.js          interacción y módulos demo
manifest.json   configuración PWA
sw.js           caché/service worker base
README.md       documentación
```

## Criterios del prototipo

1. Mobile-first.
2. Identidad neutral; sin terminología específica de un tipo de comunidad.
3. Módulos desacoplados para habilitar/deshabilitar por implementación.
4. Frontend independiente del CMS.
5. Wix/Velo será la capa de autorización y datos, no se expondrá lógica sensible en el navegador.
6. El prototipo debe poder evolucionar sin introducir un framework hasta que la complejidad real lo justifique.

## Siguiente capa recomendada

Crear el contrato de datos/API entre GitHub y Wix antes de sustituir los datos demo. Como mínimo:

- `GET /usuario/me`
- `GET /configuracion`
- `GET /programacion`
- `GET /mensajes`
- `GET /capacitacion`
- `GET /tv/canales`

La nomenclatura final de endpoints y colecciones CMS debe definirse junto con la construcción del backend Velo.
