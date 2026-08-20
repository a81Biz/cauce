# PT-084 — Estrategia   `PHASE 3`

## La decisión, y las tres que descarté

| Opción | Por qué no |
|:---|:---|
| Hacer la plataforma **obligatoria** | Rompe `SUITE-R22`, que declara soportado el equipo de una persona. Es una promesa del marco, no un detalle |
| Relajar `FDGE-R52` y no exigir `--nota` | La nota **es** la razón del comando: «el acto que se olvida». Quitarla resuelve el síntoma destruyendo el valor |
| Permitir avanzar y **perder** la nota | Un cambio de fase sin rastro es exactamente lo que `FDGE-R52` existe para impedir |
| **La nota vive en un ledger cuando no hay tablero** | ✅ `FDGE-R52` intacta, `SUITE-R22` cumplida, y el rastro existe |

## Por qué un ledger y no otra cosa

`SESSION_LOG.md` estuvo cerca: ya es append-only y ya guarda hechos sin plataforma. Se descartó
porque **mezcla dos cosas de granularidad distinta** —sesiones y transiciones de fase— y buscar
una transición entre entradas de sesión sería peor que no tenerla.

`TRANSICIONES.log`, append-only por `SUITE-R09`, con el **mismo cuerpo** que iría al issue. Que
sea el mismo cuerpo importa: si un día el proyecto declara plataforma, lo que ya está escrito
sigue siendo legible y comparable.

## Lo que NO cambia, y es la mitad del trabajo

**Con plataforma declarada, nada cambia.** La nota va al issue como siempre, el espejo sincroniza
etiquetas, y los casos existentes siguen verdes. Un arreglo que cambiara el camino bueno para
arreglar el malo habría costado más de lo que resuelve.

## El texto de `migrate` también miente, y se corrige

«**Sin ella no cambia nada**» era falso y ahora es cierto — pero no por arte: es cierto **porque
esta tarea lo hace cierto**. El texto pasa a decir qué se pierde de verdad: consultar el estado
sin abrir el repositorio.

Corregir sólo el texto habría sido documentar la limitación en vez de quitarla.
