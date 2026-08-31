# DICTAMEN — cauce   ·   `2026-08-30`

> **Para quien decide, no para quien construye.** Tres secciones, y el orden es parte del criterio
> (`DICT-R01`…`DICT-R03`): primero lo que hay, después lo que falta, y sólo entonces la decisión.
>
> Producido por el componente **DICTAMEN** (`[START DICTAMEN]`, `PT-197`) sobre este repositorio.
> `SUITE-R41` · cauce se mantiene bajo cauce, así que **este Dictamen se audita a sí mismo**.

---

## §1 · Qué se entregó, contra lo prometido   `DICT-R01`

La Declaración de Valor firmada declara **cuatro productos**, cada uno con su condición de validez.
Veredicto de los cuatro:

### `P-001` · Marco normativo — **CUMPLE**

> *VÁLIDO si: cada regla tiene ID estable, severidad y un único documento propietario, y ninguna
> se define dos veces.*

**247 reglas** en `RULES.md` · `LEXICON.md` · `EXECUTION-MODES.md`, con `CORE.md` compilado a partir
de ellas. Lo comprueba `verify-suite`: `SUITE-R38` falla si un ID se define en dos documentos, y
`build-core` no genera si el compilado diverge de sus fuentes. **Hoy: sin errores de coherencia.**

### `P-002` · Procedimiento ejecutable — **CUMPLE**

> *VÁLIDO si: un agente puede ejecutar una fase completa sin abrir un documento que `CORE.md` no le
> remita.*

`PHASES.md` da el procedimiento por fase y `avanzar` (`FDGE-R52`) es la única vía de cambiar de
fase, exigiendo el artefacto de cada una. **Evidencia de esta jornada: diecisiete tareas ejecutadas
de `PHASE 1` a `PHASE 8` sin salir de `CORE.md` y sus remisiones.**

Y dos huecos del procedimiento se cerraron dentro del propio lote: `PT-196` dio dueño a los seis
actos posteriores a `G4`, y `PT-205` a lo que rompe en CI y no en local.

### `P-003` · Verificación mecánica — **CUMPLE PARCIALMENTE, y la parte que no está medida**

> *VÁLIDO si: cada regla HARD que declara comprobación tiene un script que puede fallar, y el fallo
> es distinguible del éxito (`SUITE-R38`).*

**2034 casos** en la batería, **142 de 247 reglas ejecutadas por una compuerta**, y `sellar-bloques`
sólo certifica con el recibo de una corrida completa **en verde** — la palabra de quien lanza el
comando no basta (`PT-191`).

**Lo que no cumple, y está contado:** **105 reglas no las ejecuta ninguna compuerta**, y **126
están sin juzgar** — nadie ha decidido si son mecanizables. Ver `§2`.

### `P-004` · Paquete e instalación — **CUMPLE, con una divergencia declarada**

> *VÁLIDO si: instalar deja el marco anclado a una versión y sincronizar a ciegas es imposible en
> las dos direcciones.*

`bin/cauce.mjs` ancla la versión; `comparar-marco` impide sincronizar a ciegas; `publicar.yml`
publica sólo desde la rama por defecto y sólo a mano.

**La divergencia, medida hoy** (`PT-187`): **npm va por la `13.1.0` y el repositorio por la
`13.4.0`**. Siete versiones tienen tag y no están publicadas. **Eso es legítimo** —`SUITE-R06a`
reserva publicar al firmante— pero hasta hoy **nadie lo contrastaba**. Ahora `tracker versiones` lo
dice.

**Ningún producto declarado queda sin veredicto.**

---

## §2 · Qué queda sin cubrir   `DICT-R02`

Lo que este marco **no garantiza**, dicho por él mismo:

### Lo declarado sin cubrir por las propias tareas

**44 afirmaciones** repartidas en **17 evidencias** de este lote, cada una con su motivo. No son
olvidos: son límites que cada tarea escribió al cerrarse (`SUITE-R26`).

### Reglas que ninguna herramienta ejecuta

```
universo                     247
ejecutadas por una compuerta 142
NO_VERIFICABLE                 6   declaradas con motivo y firma
SIN_JUZGAR                   126   NADIE HA MIRADO si se pueden verificar
```

**126 reglas sobre las que nadie ha emitido juicio.** Y `SUITE-R26` dice de esta cobertura que
«aspira, no exige» — una cláusula honesta que es también la puerta por la que esto lleva lotes
pasando. Desde hoy, **la cobertura no puede bajar en silencio** (`PT-204`).

### Deudas certificadas, con dueño

**26 firmas de lote** en `FIRMAS-DE-LOTE.md`, todas de trabajo cerrado, cada una con firma, fecha y
**dueño: `EP-027`**. Siguen apareciendo en cada corrida: firmar no es silenciar.

### Trabajo abierto que este lote destapó y no hizo

| | Qué | Estado |
|:---|:---|:---|
| `EP-027` #375 | Saldar las 26 firmas certificadas | Abierta, **sin `G1`** |
| `EP-028` | El coste de la verificación: la batería tarda ~30 min por tarea | **Sólo la parada** |
| `EP-029` | Juzgar las 126 sin juzgar | Decidido por `PT-204`, **sin abrir** |
| `PT-207` | Absorbida en `PT-205` | Cerrada |

### Lo que el marco declara que NO puede prometer

- **Que quien firma sea quien dice ser** (`SUITE-R27`). Se promete que la identidad configurada
  **corresponda a alguien declarado**, y desde hoy una compuerta lo lee (`PT-195`).
- **Que la evidencia demuestre utilidad** (`QA-R01`, `SUITE-R22`): se comprueba que la prueba corrió
  y pasó; que eso equivalga a que el usuario **pueda usar** el sistema, no.
- **Que el estado retomable ahorre reconstruir el contexto** (`SUITE-R03`): mide un contrafactual.

**Ningún límite conocido queda sin nombrar.**

---

## §3 · La decisión que esto habilita   `DICT-R03`

**El marco normativo y el procedimiento están terminados y probados; la verificación mecánica está
a poco más de la mitad y nadie ha decidido cuánto de lo que falta es posible.**

Ésa es la decisión que este documento permite tomar y ningún otro: **si el próximo esfuerzo va a
verificación o a alcance.**

### Lo que sostiene esa lectura

Diecisiete tareas en un solo lote, y **cada una encontró algo que su propio intake no veía**:

```
PT-198  decia 3 expresiones   eran 7 sobre 4 campos
PT-203  veia 7 fantasmas      habia 62 miembros invisibles
PT-202  decia que viajaba     no viaja; miente la documentacion
PT-187  decia 3 divergencias  eran 7, 0 y 28
PT-206  decia 71 y 17         eran 76 y 22
```

**Cinco de cinco.** No es casualidad del lote: es lo que pasa cuando se mide antes de arreglar — y
es el argumento más fuerte que este marco tiene a su favor.

Y en contra, el mismo lote: **cinco lecciones nuevas del `HANDOFF` (`-30` a `-34`), todas de reglas
que existían y se incumplieron porque nada las ejecutaba.** El marco declara mucho más de lo que
obliga.

### Lo que recomienda, y lo que no puede decidir

**Verificación antes que alcance**, y con el criterio que `PT-204` dejó escrito: **por frecuencia,
no por severidad** — 55 reglas de `FDGE`/`SUITE`/`EXEC`/`INTAKE` se pisan aquí cada día; 16 de
`QA`/`FIDE`/`FPGE` casi nunca, y su deuda se paga en el destino.

**Y juzgar antes que verificar**: un juicio cuesta un párrafo, un verificador cuesta una tarea. Las
126 sin juzgar no son 126 tareas — son 126 párrafos y un lote sobre lo que sobreviva.

**Lo que este Dictamen no decide:** si eso merece el esfuerzo. Eso lo dice quien paga, y `FND-R24`
lo reserva por escrito.

---

## Constancia

**Producido por el agente, leyendo.** No hay generador: `PT-197` decidió producir uno a mano
primero, porque escribir el generador antes de haber hecho uno sería decidir la forma sin el dato.

**Firma pendiente.** `AC-03` de `PT-197` reserva al firmante decir **si sirve** — la única evidencia
posible de que este componente vale.

```
Leído por:
Fecha:
¿Permite tomar una decisión que otro documento no permitiría?
```
