# Diseño — `PT-127`   `PHASE 4`

> La propuesta completa. Es lo que `G2` resuelve.

---

## 1 · Dónde vive cada cosa

| Pieza | Dónde | Por qué ahí |
|:---|:---|:---|
| `RUTAS_GOBERNADAS` | `tools/patrones.mjs` | es un patrón crítico compartido (`SUITE-R38`) |
| `TIPOS_DE_COMMIT` | `tools/patrones.mjs` | la lista de `FDGE-R19` vivía **suelta** dentro de una expresión regular; ahora vive una sola vez |
| `commitSinAllocation(commit, vivoEn)` | `tools/patrones.mjs` | **pura**: recibe el commit ya leído y quien decide si el ID vive |
| `clasificaRodeo(hallazgo, ledger, regla)` | `tools/patrones.mjs` | **pura**: recibe el texto del ledger, no lo lee |
| `checkTrabajoSinAllocation()` | `tools/verify-fdge.mjs` | es quien toca git y disco, y quien agrupa e informa |

**La pureza no es estética.** Es lo que hace que los diez casos de batería puedan ejercer la
lógica **sin git y sin disco** — la lección de `PT-048`, `PT-097` y `PT-101`.

## 2 · Las cinco clases de hallazgo

```
SIN_FORMATO   el asunto no sigue «<type>: PT-NNN» con type ∈ los seis de FDGE-R19
SIN_ID        tiene tipo pero no cita ningún identificador
NO_ES_PT      cita «EP-NNN»: un lote no es la unidad de trabajo
NO_VIVO       cita un PT que el registro no conoce
SIN_EVALUAR   no se pudo decidir. RULE-06: no saber no es permiso
```

Y **tres salidas limpias**, que son las que evitan el ruido:

- más de un padre ⇒ es un merge, es integración, `null`
- no toca ninguna ruta gobernada ⇒ `null`
- cita un `PT` vivo ⇒ `null`

## 3 · Cómo se informa: agrupando

La primera versión escribió **34 líneas** para 34 commits, y las tres eran el mismo texto. Eso no
es enumerar: es tapar las demás comprobaciones.

Se agrupa por `clase + id + motivo`, y **cada grupo nombra sus commits uno a uno** en una línea:

```
! FDGE-R19  15 commit(s): cita «EP-020», que no es un PT … · b79e75fb 2304bc80 829cb381 …
! FDGE-R19  18 commit(s): cita «EP-019», que no es un PT … · SESSION_LOG.md declara una excepción …
! FDGE-R19   1 commit(s): el asunto no sigue «<type>: PT-NNN» …
```

El recuento **más** los identificadores. Contar sin nombrar es lo que `PT-128` acaba de corregir
en el cursor; no se repite aquí.

## 4 · La ventana, y por qué no es la historia entera

`rigeGlobal('FDGE-R19')` corta por versión (`SUITE-R09`: una regla nueva no juzga trabajo
anterior) y la lectura se limita a **60 commits**. Los 200+ anteriores se escribieron cuando esto
no se exigía, y marcarlos sería retrofechar la regla.

## 5 · Los dos límites que se declaran   `AC-05` · `SUITE-R26`

1. **«Vivo» se decide con el registro de HOY.** Un `PT` abierto *después* del commit que lo cita
   sale verde aquí. Reconstruir el registro de cada commit es arqueología, no verificación — y
   ese caso lo cazan `FDGE-R52` y `SUITE-R08` por otra vía.
2. **`FORZADO` observa co-ocurrencia, no intención.** Que el identificador, la regla y la palabra
   «excepción» caigan en la misma entrada del ledger es un indicio declarado, no una prueba de
   que el marco obligara. Una forma más estricta necesitaría un campo estructurado en el
   ledger — que es justo lo que `PT-125` va a construir.

Los dos van al inventario de `audit` como hueco **medido**, no como promesa.

## 6 · Lo que la comprobación NO hace

- **No bloquea.** Avisa, y `AVISA_AHORA_FALLA_EN` la mapea a `G4`.
- **No reescribe nada.** `SUITE-R06f`.
- **No borra ni corrige commits.** Los nombra.
