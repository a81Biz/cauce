# Intake — BUG · `PT-109` · una compuerta no es una revisión sorpresa

```yaml
---
id: PT-109
type: BUG
severity: S2
complexity:
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-22
origin: DIRECT
epic: EP-019
---
```

**Cómo termina, en una línea** (`FDGE-R53`):

> Termina cuando: ningún aviso puede convertirse en error en una compuerta sin haberlo dicho, y
> ninguna mención de un identificador cuenta como su declaración.

---

## 1. Qué está pasando `[HUMANO]`

`L-7` del lote: **cinco defectos de forma, que son los que se cuelan.**

De los cinco `INC` que el reparto nombra, **dos tienen descripción accesible** —`INC-010` e
`INC-015`— y los otros tres viven en el `INCIDENTS.log` de la calculadora, que **no está en esta
máquina**. Se declaran, no se inventan.

---

## 2. Comportamiento esperado `[HUMANO]` — obligatorio

**Un aviso tiene que decir en qué se va a convertir.** Si una regla avisa hoy y bloquea el merge
mañana, el aviso de hoy debe decirlo — o la compuerta es una revisión sorpresa.

**Y una mención no es una declaración.** Nombrar un identificador en una frase no lo convierte en
un candidato del roadmap con obligaciones.

---

## 3. Comportamiento observado `[HUMANO]`

```
INC-010   5 reglas cambian de severidad segun la compuerta:
          SUITE-R35 · FDGE-R19 · FDGE-R52  ->  avisan, y FALLAN en G4
          FDGE-R54                          ->  avisa, y FALLA en G2
          El aviso NO lo dice. «Cada compuerta es una revision sorpresa.»

INC-015   FPGE-R01 casaba /^.*\b(R-\d+)\b.*$/ — CUALQUIER linea que lo nombre.
          Una cita en prosa contaba como candidato y se le exigia evidencia.
```

---

## 4. Reproducción `[HUMANO]`

```
1. node tools/verify-fdge.mjs PT-NNN            -> avisos, parece que va bien
2. node tools/verify-fdge.mjs --gate G4 PT-NNN  -> los mismos, ahora en rojo
3. escribir «como se decidio en R-007» en ROADMAP.md
4. node tools/verify-qa.mjs                     -> exige evidencia a una frase
```

- [x] Reproducible siempre siguiendo los pasos
- [ ] Intermitente
- [ ] Ocurrió una vez y no he podido reproducirlo

---

## 5. Entorno `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Entorno | `verify-fdge.mjs` · `verify-qa.mjs` |
| Build o commit | rama `chore/alberto-martinez/PT-097-apertura` · suite `12.0.0` |
| Rol de usuario | firmante (`Alberto Martínez`) |
| Fecha y hora del suceso | 2026-08-22 |

---

## 6. Impacto `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Usuarios afectados | todo proyecto: los dos verificadores viajan en el paquete |
| Volumen estimado | **cinco** reglas con severidad variable · **una** regex que cuenta menciones |
| ¿Hay pérdida de datos? | no |
| ¿Existe workaround? | correr siempre con `--gate G4`, que no es lo que la herramienta pide |
| Impacto de negocio | un aviso que se vuelve rojo sin avisar enseña a desconfiar de los avisos |

---

## 7. Out of scope `[HUMANO]` — obligatorio

```
OUT: igualar las severidades de las cinco reglas
     Seria endurecer cada revision de paso hasta hacerla inutil, o ablandar G4. Que una
     precondicion de merge sea mas estricta esta BIEN: lo que falta es DECIRLO.

OUT: INC-003, INC-005 e INC-014
     Sus descripciones viven en el INCIDENTS.log de la CALCULADORA, que no esta en esta
     maquina —«find» sobre todo el arbol de proyectos no encuentra ninguno—. Inventarlas
     seria exactamente lo que este lote persigue. Del INC-003 se sabe lo que el lote dice:
     «se registro el 2026-08-20, se escribio reportado a cauce y nadie abrio el PT» — un
     defecto de PROCEDIMIENTO que se cierra abriendolo, que es lo que este lote hace.

OUT: rehacer el formato del ROADMAP
     Se arregla el reconocimiento, no el documento.
```

---

## 8. Criterios de aceptación del arreglo `[HUMANO]`

```
- que un aviso diga en que compuerta se convierte en error
- que no se le pegue esa coletilla a una regla que no cambia
- que FPGE-R01 mire la fila del roadmap y no cualquier mencion
- que la bateria falle sin el arreglo
```

---

## 9. Firma `[HUMANO]` — obligatorio

```
Reportado por: Alberto Martínez
Fecha: 2026-08-22
Confirmo que los comportamientos esperado y observado, la severidad y el out-of-scope
reflejan mi intención: SÍ

Firmado por lote: EP-019
```

> **Base**, escrita por el agente (`INTAKE-R06`): el reparto del lote (`L-7`) y la medición de
> las cinco reglas con severidad variable. `SUITE-R27`: contrastable, no probada.

---

---

# A partir de aquí lo completa el agente

## 10. Criterios de aceptación — versión canónica `[AGENTE]`

```
AC-01: todo aviso de una regla que FALLA en una compuerta lleva «AVISO AHORA, ERROR EN <G>».

AC-02: una regla que NO cambia de severidad NO lleva la coletilla. Si la llevara, dejaria de
       significar nada — que es como un aviso se vuelve ruido.

AC-03: FPGE-R01 reconoce un candidato por su FILA en la tabla del roadmap, no por que su
       identificador aparezca en la linea.

AC-04: la bateria falla SIN el arreglo, con el negativo de AC-02.

AC-05: INC-003, INC-005 e INC-014 quedan DECLARADOS con su motivo, no arreglados a ciegas.
```

## 11. Complejidad propuesta `[AGENTE]`

```
Complejidad: STANDARD
Justificación: una tabla, una envoltura de `warn` y una regex. Lo que la hace parte del lote no
es el tamaño: son defectos de FORMA, que son los que se cuelan.
```

## 12. Verificación de duplicados `[AGENTE]`

```
BACKLOG.md consultado:        sí
PTs vivos relacionados:       PT-101, PT-108
HISTORY.log — PTs similares:  PT-100 arregló EXACTAMENTE la misma forma en este mismo archivo
                              para los tipos de caso QA: un patrón que reconoce el NOMBRE en vez
                              del SITIO donde el nombre significa algo
Roadmap — R-NNN relacionado:  ninguno
```

## 13. Observaciones del agente `[AGENTE]` — obligatorio

- **`INC-015` es literalmente el defecto de `PT-100`, en el mismo archivo.** Aquel arregló el
  vocabulario de los tipos de caso `QA`; este, el reconocimiento de un candidato. Los dos
  confundían **nombrar** con **declarar**.

- **`INC-010` no se arregla igualando severidades.** Que `G4` sea más estricta que una revisión de
  paso es correcto y deliberado. Lo que faltaba es que el aviso **dijera en qué se convierte** —
  un aviso que no lo dice es una sorpresa aplazada.

- **Tres de los cinco `INC` están bloqueados y se declaran.** Sus descripciones no están en esta
  máquina. Arreglar «algo parecido» sería inventar el defecto y su arreglo a la vez.

- **Lo que este intake NO establece:** si hay más reglas que cambian de severidad. Se midieron
  cinco con un `grep` sobre `gate ===`; una escrita de otra forma no aparecería.

## 14. Resultado de la compuerta `G1` `[AGENTE]`

```
DoR-01 tipo declarado                    [x]  BUG
DoR-02 severidad declarada por el humano [x]  S2 · enseña a desconfiar de los avisos
DoR-03 firma humana presente             [x]  §9
DoR-04 out-of-scope declarado            [x]  tres entradas, una de ellas DECLARA lo bloqueado
DoR-05 PT asignado desde REGISTRY.json   [x]  PT-109 · con `tracker asignar` completo
DoR-06 no duplica trabajo vivo           [x]  §12
DoR-07 observaciones registradas         [x]  §13 · cuatro
DoR-B1 comportamiento esperado humano    [x]  §2
DoR-B2 comportamiento observado          [x]  §3 · con las cinco reglas medidas
DoR-B3 reproducción                      [x]  §4 · cuatro pasos
DoR-B4 entorno identificado              [x]  §5
DoR-B5 frecuencia declarada              [x]  siempre
DoR-B6 impacto y usuarios declarados     [x]  §6

VEREDICTO: PASS
Firmado por: Alberto Martínez (delegada · constancia en SESSION_LOG.md)
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
