---
auditoria: PTSA-2026-08-20
auditoria_estado: COMPLETE
sistema: cauce — marco de gobernanza para desarrollo asistido por IA
version_auditada: 10.0.0
rama: trabajo
commit: b67dc92
auditor: Claude Opus 5 (Auditor Principal, PTSA-R59)
firmante: Alberto Martinez
freshness: 2026-08-20
audit_due: 2026-09-20
coverage: 0.89
health: 79.9
risk: 73
confidence: 0.94
certificacion: B
health_unstable: true
---

# RESUMEN — auditoria PTSA de cauce 10.0.0

> **Primera ejecucion de PTSA sobre este repositorio.** `TD-15` declaraba tres de los seis
> componentes nunca ejecutados; esta corrida cierra uno de los tres.

---

## Dictamen en una linea

**Publicar es decision del firmante. Lo que lo bloqueaba esta corregido y pendiente de validar.**

`H-001` era un defecto **del acto de publicar**: el tarball incluia un artefacto local con rutas
absolutas del disco del mantenedor, y la misma version producia 57 o 58 archivos segun quien la
publicara. **Corregido durante la auditoria** y verificado con el artefacto recreado a proposito:
57 archivos en los dos casos. Queda en `VALIDATION_PENDING` porque cerrar un `BUG` es de una
persona (`PTSA-R44`).

Lo demas —incluido el hallazgo del proxy que motivo esta auditoria— **no bloquea publicar**: son
deuda declarada con nombre, dimension y severidad, que es exactamente el estado en el que el marco
dice que se puede convivir con un defecto.

**Lo que sigue sin estar demostrado, y es lo que deberia pesar en la decision:** dos de los seis
componentes que el marco publica —`QA` y `FPGE`— no se han ejecutado nunca (`H-008`), y
`migrate --apply` tampoco. Publicar la `10.0.0` significa publicar eso, dicho.

---

## Los cuatro numeros, con su cobertura   `PTSA-R21`

Un score sin cobertura declarada es nulo. Aqui esta la cobertura primero:

```
coverage = 0.89      175 de 196 celdas del universo evaluadas
                      51 elementos x 4 dimensiones, menos 8 celdas NO_APLICA justificadas
                      las 21 NO_EVALUADA llevan motivo y coste en COVERAGE.md seccion 3
```

| | Score | Penalizaciones que lo bajan |
|:---|---:|:---|
| **D1 · dominio** | **60** | `H-002` 15 · `H-003` 15 · `H-008` 5 · `H-009` 5 |
| **D2 · tecnica** | **80** | `H-001` 15 · `H-005` 5 |
| **D3 · observabilidad** | **95** | `H-004` 5 |
| **D4 · documental** | **94** | `H-007` 5 · `H-006` 1 |

```
Health_calculado = (D1x0.30)+(D2x0.30)+(D3x0.30)+(D4x0.10) = 79.9
D1 = 60, que NO es menor que 60  ->  Multiplicador Global NO APLICA
Health = 79.9
```

**Se declara que el multiplicador se evaluo y no aplico** (`PTSA-R27`). D1 quedo *exactamente* en
el umbral: una sola penalizacion `MEDIA` mas y `Health` habria caido a 55.

```
Risk = min(100, Sum(Impacto x Probabilidad) x 4)
       Sum = 15.29 sobre nueve hallazgos, +3 por una metrica D5 en Rojo (PTSA-R28)
       Risk = 73
Confidence = cobertura x0.40 + freshness x0.25 + validez x0.20 + autonomia x0.15
           = 0.89 x0.40 + 1.00 x0.25 + 0.90 x0.20 + 1.00 x0.15 = 0.94
```

**Certificacion `B`** — `A` requiere Health >= 90; con una metrica `D5` en Rojo el techo es `B`
de todos modos.

### La escala, declarada porque `PHASE 0` no la fijo   `PTSA-R24`

`PTSA-R28` calibra la escala al decir que una metrica `D5` en Rojo equivale a un hallazgo
Alto/Probable y suma **+3**. De ahi:

```
Impacto       Alto 3 · Medio 2 · Bajo 1
Probabilidad  Probable x1.00 · Posible x0.66 · Improbable x0.33
```

Sin esta declaracion el mismo hallazgo daria 9 o 3 segun quien multiplicara, y `Risk` saturaria
en 100 con cualquier auditoria de mas de cinco hallazgos.

### `D5` en un sistema determinista   `PTSA-R10` · `PTSA-R23`

cauce **es para** desarrollo asistido por IA, pero sus productos —documentos y herramientas— no
generan con un LLM en tiempo de ejecucion. Por tanto `Hallucination Rate` se marca `NO_APLICA` y
`D5` se evalua solo con estabilidad y reproducibilidad:

| Metrica | Estado | Medida |
|:---|:---|:---|
| Reproducibilidad de la bateria | **Verde** | 1118 casos, cero fallos, deterministas |
| Reproducibilidad de `CORE.md` | **Verde** | `build-core --check` compara por hash de cuerpo |
| **Reproducibilidad del tarball** | **Rojo** | 57 archivos desde CI, 58 desde esta maquina (`H-001`) |

---

## Los nueve hallazgos

| | Dim | Sev | Tipo | Estado | Que dice |
|:---|:---|:---|:---|:---|:---|
| `H-001` | D2 | ALTA | BUG | OPEN | El tarball lleva un artefacto local con rutas absolutas. **Bloquea publicar** |
| `H-002` | D1 | ALTA | DOMAIN | OPEN | `SUITE-R01`, `SUITE-R09` y `EXEC-R04` no las emite ningun verificador |
| `H-003` | D1 | ALTA | DOMAIN | OPEN | Cinco comprobaciones miran un proxy en vez del hecho; cuatro gobiernan compuertas |
| `H-004` | D3 | MEDIA | BUG | OPEN | 17 divergencias registro/YAML, y la herramienta usa el YAML |
| `H-005` | D2 | MEDIA | BUG | OPEN | El grafo esta en `.gitignore`: `FDGE-R43` solo da `FRESH` en una maquina |
| `H-006` | D4 | BAJA | BUG | OPEN | `CLAUDE.md` dice 15 herramientas y 4 comandos; son 16 y 7 |
| `H-007` | D4 | MEDIA | BUG | OPEN | 8 de 16 cifras del inventario ya eran falsas un dia despues de generarlo |
| `H-008` | D1 | MEDIA | DOMAIN | **IN_REVIEW** | `QA` y `FPGE` no se han ejecutado nunca |
| `H-009` | D1 | MEDIA | INVESTIGATION | OPEN | `G4` es un registro contrastable, no una prevencion |

**Ninguno se cierra aqui.** `PTSA-R44` reserva el cierre de `BUG` y `DOMAIN` a una persona, y
`PTSA-R43` exige evidencia post-correccion observada en la fuente real.

---

## Roadmap priorizado   `PTSA-R41`

`D1` antes que el resto: supremacia del dominio.

| Orden | Hallazgo | Por que ahi |
|---:|:---|:---|
| **1** | `H-001` | Es `D2`, pero **bloquea publicar** y cuesta una linea. Lo unico que se salta el orden |
| 2 | `H-003` | `D1` ALTA · el patron que se reproduce. Ya decidido para la epica siguiente |
| 3 | `H-002` | `D1` ALTA · empezar por `SUITE-R09`, que es mecanicamente comprobable hoy |
| 4 | `H-008` | `D1` MEDIA · ejecutar `QA` y `FPGE`. Ya solo faltan dos de seis |
| 5 | `H-009` | `D1` MEDIA · decision humana: declararlo como `SUITE-R27` declara el limite de las firmas |
| 6 | `H-004` | `D3` MEDIA · elevar a error la divergencia con estado terminal |
| 7 | `H-005` | `D2` MEDIA · elegir entre las tres salidas de `TD-17` |
| 8 | `H-007` | `D4` MEDIA · derivar las cifras del inventario en vez de transcribirlas |
| 9 | `H-006` | `D4` BAJA · dos numeros en `CLAUDE.md` |

---

## Que hace bien este sistema, medido

Una auditoria que solo enumera defectos describe al auditor, no al sistema.

```
cero dependencias           dependencies {} y devDependencies {} — sin superficie de suministro
cero execSync               las 50 llamadas a proceso son execFileSync o spawnSync, sin shell:true
sin shell:true              ninguna ocurrencia en las 16 herramientas ni en el binario
un solo git push            detras de --publicar, explicito, sin --force en ningun sitio
sin force push ni borrado   main y trabajo, con enforce_admins: true
secretos                    arbol e historia limpios; los 6 hallazgos son fixtures firmados
rollback transaccional      tracker avanzar respalda 4 rutas conocidas y restaura si algo falla
guarda de sobrescritura     cauce install se niega ante un destino divergente y sale con 2
1118 casos                  cero fallos, corrida completa sobre el arbol auditado
224 reglas                  0 sin ID, 0 sin severidad, 0 en dos documentos, 0 definidas dos veces
```

---

## Lo que esta auditoria NO prueba   `PTSA-R14`

| | Por que |
|:---|:---|
| Que las 21 celdas `NO_EVALUADA` esten bien | No se miraron. Su motivo y su coste estan en `COVERAGE.md` §3 |
| Que `migrate --apply` funcione | **Nunca se ha ejecutado.** `PT-019` valido el informe, no la ejecucion |
| Que el auditor sea imparcial consigo mismo | El auditor es el mismo agente que escribio buena parte del codigo auditado. `PTSA-R14` pide evidencia, y toda afirmacion de aqui la tiene — pero **que hallazgos NO se buscaron** no es contrastable desde dentro |
| Que `Health 79.9` signifique «listo para produccion» | Significa lo que dice la formula sobre las celdas que se evaluaron, y nada mas |

El tercero es el limite serio, y es el mismo que `SUITE-R27` declara sobre las firmas: hay un
nombre asociado a la afirmacion, no una garantia de independencia.

---

## Revision — 2026-08-20 · dos hallazgos corregidos dentro de la auditoria

| | Estado | Evidencia post-correccion |
|:---|:---|:---|
| `H-001` | `VALIDATION_PENDING` | [[E-011]] · tarball de 57 archivos, y **sigue siendo 57 con el artefacto recreado** |
| `H-006` | `VALIDATION_PENDING` | [[E-011]] · las dos cifras de `CLAUDE.md` coinciden con `ls` y con el binario |

**Los scores NO cambian.** `PTSA-R52` calcula sobre hallazgos **activos**, y
`VALIDATION_PENDING` lo es: la correccion existe, la validacion humana no.

Cuando una persona valide los dos y los cierre, quedaria:

```
D2  80 -> 95      se retira la penalizacion ALTA de H-001
D4  94 -> 95      se retira la BAJA de H-006
Health 79.9 -> 84.4        certificacion sigue siendo B (75-89)
Risk 73 -> 62              se retira tambien la metrica D5 en Rojo: el tarball ya es reproducible
```

**`A` seguiria fuera de alcance**, y esa es la informacion util: el techo no lo pone `H-001`, lo
ponen los tres hallazgos `D1` —`H-002`, `H-003` y `H-008`— que son trabajo de la epica siguiente.

---

## Firma

```
Auditoria ejecutada por: Claude Opus 5, Auditor Principal (PTSA-R59)
Fecha: 2026-08-20
Evidencia: 10 capturas de primera mano por shell, sin pedir un solo comando al usuario (PTSA-R61)
Estado: COMPLETE — la matriz esta completa (PTSA-R79), coverage 0.89

Pendiente de una persona:
  - validar y cerrar los hallazgos BUG y DOMAIN (PTSA-R44)
  - decidir H-009, que es INVESTIGATION y no tiene arreglo obvio
  - autorizar o no la publicacion, sabiendo que H-001 la bloquea hoy
```

---

## Revisión 1 — 2026-08-21 · la certificación, recalculada contra `§24.2` y `§24.4`

> `SUITE-R09` · append-only. **No se ha tocado una sola línea de lo anterior.** Lo único que cambia
> arriba es el frontmatter, que gana `health_unstable: true` — un dato que este documento ya
> declaraba en su prosa y que `PTSA-R82` ahora exige publicar.

### Qué pasaba

Cuando se emitió esta auditoría, `PTSA-R08` obligaba a publicar una letra `A/B/C/F` y **los
umbrales no existían**: `§24.2` y `§24.4` se citaban desde `§15.6` y `§13.4`, y `§24` era —y sigue
siendo, ahora como `§24.1`— la tabla de transiciones de estado de un producto.

Ante eso, este documento escribió:

```
:80    «A requiere Health >= 90»
:195   «certificacion sigue siendo B (75-89)»
```

**La banda `(75-89)` no aparece en ninguna especificación.** Se inventó para poder cumplir una
regla que exigía un entregable sin definirlo. Y `«A requiere Health >= 90»` se escribió como si
constara: consta **desde ahora**, no constaba entonces.

Lo midió también otro proyecto, de forma independiente, y ante el mismo hueco tomó la decisión
contraria: publicar los tres scores y **no emitir letra** (`INC-007` del proyecto legado).

### El recálculo

`PT-097` escribió `§24.2` y `§24.4` **sin añadir ninguna cifra**: `C` no es una banda sino un
techo, que es lo que dicen las dos únicas reglas que la nombran.

```
base       60 <= 79.9 < 90                          ->  B     §24.2
topes      health_unstable: true                    ->  B     §13.4
           Confidence 94 >= 90                      ->  no bloquea A (irrelevante, ya es B)
           freshness 2026-08-20, conocida           ->  sin techo C
           riesgo maximo activo = 9 (H-003, ALTO)   ->  sin techo C, no llega a CRITICO
letra = min(...)                                        B     PTSA-R81
```

### Veredicto

```
certificacion: B      SIN CAMBIO
```

**Y precisamente por no cambiar hay que decir esto:** la letra anterior **no era contrastable**
cuando se emitió. Que coincida con la derivada **no la valida retroactivamente** — coincidió, no
se dedujo. Callarlo dejaría escrito que inventar una banda salió bien.

### Lo que esta revisión retira

```
la banda «(75-89)»              no existe en ninguna especificacion. §24.2 no tiene banda B
                                por rango bajo: tiene 60 <= Health < 90, que es otra cosa
«A requiere Health >= 90»       cierto AHORA, por §24.2. No lo era cuando se escribio
```

### Lo que **no** cambia

`Health`, `Risk`, `Confidence`, `coverage` y `freshness` se quedan como están. Esta revisión toca
**la letra y su justificación**, no los números.

> **Y un límite declarado:** el `Risk 73` publicado se calculó con `H-001` y `H-006` todavía
> activos; hoy están `CLOSED` y los hallazgos activos son siete. Recalcularlo **no es de esta
> tarea** —la letra no depende de `Risk` (`§24.2`, `§24.4`)— y arrastra `INC-008` del proyecto
> legado: el multiplicador `×4` satura con `Σ ≥ 25`, así que el `Risk` deja de discriminar a partir
> del cuarto hallazgo. Queda anotado en el `## Cierre del lote` de `EP-019`.

```
Revisión escrita por: el agente, en PT-097
Fecha: 2026-08-21
Firmada por: Alberto Martínez (delegada · constancia en SESSION_LOG.md)
```
