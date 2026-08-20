# PT-071 — Estrategia   `PHASE 3`

## Copiar los comandos **al carácter**

| Opción | Por qué no |
|:---|:---|
| Extraer un workflow reutilizable | Más correcto en abstracto y más difícil de auditar: habría que leer dos archivos para saber qué corre cada uno |
| Que `publicar` llame a `verificacion` | Acopla la publicación a que el otro workflow no cambie de nombre ni de disparador |
| **Las tres comprobaciones, con la invocación idéntica** | ✅ Cada workflow se lee entero y solo, y la paridad se comprueba derivando los comandos de los dos |

**Idéntica de verdad.** Escribí `npm run verify:espejo` donde `verificacion.yml` pone
`node docs/methodology/tools/tracker.mjs espejo`, y el comparador las contó como distintas. Tenía
razón: dos formas de invocar lo mismo pueden divergir el día que una de las dos cambie.

## Lo que este arreglo no puede garantizar

Que las dos sigan iguales mañana. La comprobación de paridad es un caso del arnés que deriva los
comandos de los dos archivos y exige que no falte ninguno — **eso** es lo que impide la próxima.
Sin él, esta tarea arregla el desfase de hoy y deja el mecanismo intacto.
