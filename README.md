# Arena — MVP free-to-play

Primera versión navegable de **Arena**, una plataforma para crear y aceptar retos competitivos entre jugadores. Este MVP usa puntos virtuales sin valor monetario: no procesa apuestas, depósitos ni retiros.

## Funcionalidades

- Dashboard responsive con estadísticas y retos destacados.
- Catálogo de retos con filtros por juego y búsqueda por jugador, juego o plataforma.
- Creación local de retos con validación de formulario.
- Confirmación visual al aceptar un reto.
- Ranking de temporada e historial de actividad.
- Modal de ayuda y navegación mobile.
- Arquitectura de producto completa en [`ARQUITECTURA_APP_APUESTAS_ESPORTS.md`](./ARQUITECTURA_APP_APUESTAS_ESPORTS.md).

## Ejecutar localmente

No hay dependencias de producción. Se necesita Python 3 o cualquier servidor HTTP estático:

```bash
python3 -m http.server 4173
```

Luego visita [http://localhost:4173](http://localhost:4173).

> No abras `index.html` directamente con `file://`: la aplicación utiliza módulos ES y necesita servirse por HTTP.

## Estructura

```text
.
├── index.html                              # Layout y vistas
├── styles.css                             # Sistema visual responsive
├── app.js                                 # Interacciones y renderizado
├── data.js                                # Datos demo y lógica testeable
├── tests/data.test.js                     # Pruebas unitarias
└── ARQUITECTURA_APP_APUESTAS_ESPORTS.md   # Arquitectura técnica y de producto
```

## Pruebas

```bash
npm test
```

## Alcance de esta versión

Esta implementación valida experiencia de usuario y navegación. La integración con cuentas de plataforma, verificación automática de resultados, backend, autenticación, KYC, ledger y pagos pertenecen a fases posteriores y requieren acuerdos oficiales y aprobación legal por jurisdicción.
