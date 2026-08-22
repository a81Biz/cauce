# Intake — BUG · `PT-097` · los umbrales de la certificación

```yaml
---
id: PT-097
type: BUG
severity: S1
complexity:
track: STANDARD
status: DONE
phase: 8
created: 2026-08-21
origin: DIRECT
epic: EP-019
---
```

**Cómo termina, en una línea** (`FDGE-R53`):

> Termina cuando: `PTSA-R08` puede cumplirse sin inventar nada — la función que da la letra está
> escrita en `§24.2` y `§24.4`, un verificador la comprueba, y ninguna banda publicada carece de
> respaldo en la especificación.

---

## 1. Qué está pasando `[HUMANO]`

Transcripción de lo declarado por el firmante al ordenar el lote (`FDGE-R02`, `INTAKE-R01`):

> «`L-6` **PRIMERO**, los umbrales de `PTSA`. (…) Va primero porque `PTSA-R08` exige emitir una
> letra `A/B/C/F`, los umbrales se citan en `§24.2` y `§24.4`, y **esas secciones no existen**.
> Mientras eso siga así, cualquier auditoría que corra durante el lote arrastra el mismo hueco —
> y este lote acabará auditándose.
>
> Y hay una consecuencia que `L-6` tiene que resolver, no esquivar: **`PTSA/RESUMEN.md` de este
> repositorio dice `certificacion: B` y escribe `(75-89)`**, una banda que no aparece en ninguna
> especificación. La inventó el agente que auditó, y esa auditoría fue el argumento con el que se
> publicó la `11.0.0`.»

---

## 2. Comportamiento esperado `[HUMANO]` — obligatorio

**Una regla que exige un entregable tiene que definir qué es ese entregable.** `PTSA-R08` obliga a
emitir una clasificación *«auditable y defendible ante stakeholders»*: defendible significa que
otra persona, con los mismos números, llega a la misma letra.

Y lo que ya está publicado tiene que quedar **contrastable**: o se recalcula con la definición
nueva, o se declara que no lo es. Lo que no vale es dejarlo como está y que parezca respaldado.

---

## 3. Comportamiento observado `[HUMANO]`

```
PTSA-R08     «Emitir una clasificacion de certificacion (A/B/C/F) auditable y defendible»
§24          «Reglas de transicion» — de estado de PRODUCTO, sin subsecciones
§24.2 §24.4  citadas dos veces para los umbrales · NO EXISTEN
```

Y en el repositorio:

```
PTSA/RESUMEN.md:16    certificacion: B
PTSA/RESUMEN.md:80    «A requiere Health >= 90»
PTSA/RESUMEN.md:195   «certificacion sigue siendo B (75-89)»
PTSA/score-history.json   "certificacion": "B"     <- ya propaga a la siguiente auditoria
CHANGELOG.md:65       «certificación B · Health 79.9»
```

El proyecto legado, ante el mismo hueco, hizo lo correcto: **publicó los tres scores y no emitió
letra**.

---

## 4. Reproducción `[HUMANO]`

```
1. grep -nE "^#{2,4} 24" docs/methodology/PTSA/PTSA-V3-Especificacion-Oficial.md
   -> una sola linea: «## 24. Reglas de transicion»
2. sed -n '569p;744p' del mismo archivo
   -> las dos citas a §24.4 y §24.2
3. grep -c "certificac" docs/methodology/tools/verify-ptsa.mjs
   -> 0
```

- [x] Reproducible siempre siguiendo los pasos
- [ ] Intermitente
- [ ] Ocurrió una vez y no he podido reproducirlo

Reproducible en **las dos versiones**: `4.12.0` del proyecto legado y `11.0.0` de aquí.

---

## 5. Entorno `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Entorno | la especificación de `PTSA`, y la auditoría `PTSA-2026-08-20` de este repositorio |
| URL o host | — |
| Build o commit | `497cf40` · rama `trabajo` · suite `11.0.0` |
| Rol de usuario | firmante (`Alberto Martínez`) |
| Navegador / cliente | — |
| Fecha y hora del suceso | encontrado el 2026-08-21, presente desde la `4.12.0` |

---

## 6. Impacto `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Usuarios afectados | todo proyecto que ejecute `PTSA` — y quien lea su certificación |
| Volumen estimado | **2 de 2** auditorías conocidas: una inventó la banda, la otra no emitió letra |
| ¿Hay pérdida de datos? | no |
| ¿Existe workaround? | sí, el del legado: publicar los tres scores y **no** emitir letra |
| Impacto de negocio | una certificación no contrastable fue el argumento con el que se publicó la `11.0.0` |

---

## 7. Evidencia adjunta `[HUMANO]` `[OPCIONAL]`

`INC-007` del proyecto legado, abierto el 2026-08-21, con su medición sobre las dos versiones:

```
$ grep -nE "^#{2,4} 24" docs/methodology/PTSA/PTSA-V3-Especificacion-Oficial.md
958:## 24. Reglas de transicion
$ grep -nE "^#{2,4} 24" node_modules/@a81biz/cauce/docs/methodology/PTSA/...
958:## 24. Reglas de transicion
```

---

## 8. Out of scope `[HUMANO]` — obligatorio

```
OUT: reauditar el marco con PTSA          -> §5 del lote. Auditar contra una especificacion
     que cita secciones inexistentes reproduce el defecto. Se audita DESPUES

OUT: INC-008 · el multiplicador x4 satura -> el Risk saturado es otro hallazgo del legado.
     L-6 define los umbrales de la LETRA; recalcular Risk de paso es alcance que crece

OUT: cambiar los pesos de las dimensiones -> PTSA-R26 los declara fijos, y tocarlos
     cambiaria el Health de toda auditoria pasada

OUT: retirar una certificacion ya emitida -> SUITE-R09 es append-only. Se RECALCULA con la
     definicion nueva, y si el resultado difiere se dice; no se borra
```

---

## 9. Criterios de aceptación del arreglo `[HUMANO]`

```
- que exista la funcion que da la letra, y que dos personas con los mismos numeros
  lleguen a la misma
- que no me invente ninguna cifra que no este ya en el documento
- que nuestra propia «B» quede contrastable, o declarada como no contrastable
- que algo lo compruebe, porque hoy no lo comprueba nada
```

---

## 10. Firma `[HUMANO]` — obligatorio

```
Reportado por: Alberto Martínez
Fecha: 2026-08-21
Confirmo que los comportamientos esperado y observado, la severidad y el out-of-scope
reflejan mi intención: SÍ

Firmado por lote: EP-019
```

> **Base de esta firma**, escrita por el agente porque `INTAKE-R06` no le permite firmar: el texto
> transcrito en §1, del reparto del lote, más *«Comienza en orden y todo de acuerdo al marco de
> trabajo»* y la delegación autónoma del 2026-08-21. `SUITE-R27`: contrastable, no probada.

---

---

# A partir de aquí lo completa el agente

## 11. Criterios de aceptación — versión canónica `[AGENTE]`

```
AC-01: §24.2 existe y define la clasificacion BASE en funcion de Health, usando solo
       cifras que la especificacion ya declara.

AC-02: §24.4 existe y consolida los CUATRO topes que hoy estan dispersos, cada uno
       citando la regla o seccion que lo establece.

AC-03: la funcion es DETERMINISTA y esta escrita: mismos (Health, Risk, Confidence,
       health_unstable, freshness, hallazgos) -> misma letra, sin juicio del auditor.

AC-04: PTSA-R08 admite NO emitir letra cuando falta un dato, y lo dice. Es la salida
       que el proyecto legado tomo por su cuenta y que hoy no esta autorizada.

AC-05: verify-ptsa comprueba la letra publicada contra la funcion. Hoy no mira ninguna.

AC-06: la bateria falla SIN el arreglo, con un caso por cada tope y por cada banda.

AC-07: nuestra «B» queda RECALCULADA con la definicion nueva y su banda inventada
       retirada, sin borrar lo publicado (SUITE-R09). Si la letra cambiara, se dice.

AC-08: CORE-PTSA.md se regenera, porque lleva PTSA-R08 y PTSA-R30 (SUITE-R25).
```

## 12. Complejidad propuesta `[AGENTE]`

```
Complejidad: STANDARD
Justificación: dos secciones nuevas en la especificación, una función en verify-ptsa con su
batería, y una corrección a un documento publicado. No cambia ningún peso, ninguna fórmula ni
ninguna regla existente: escribe lo que dos reglas ya citan y no encuentran.
```

## 13. Verificación de duplicados `[AGENTE]`

```
BACKLOG.md consultado:        sí — sin entrada sobre umbrales de certificación
PTs vivos relacionados:       PT-096 (DONE, otro archivo) · PT-025 (DEFERRED)
HISTORY.log — PTs similares:  ninguno toca PTSA/. PT-092 lo EJECUTÓ por primera vez
Roadmap — R-NNN relacionado:  R-004 (segunda auditoría PTSA) depende de que esto exista
```

## 14. Observaciones del agente `[AGENTE]` — obligatorio

`INTAKE-R07`:

- **Parecía que había que inventar una cifra, y no.** Hacen falta cuatro letras y la
  especificación sólo declara dos anclas —`60` en el cap de dominio de `§13.3`, `90` en `§15.6`—.
  La salida no es inventar la tercera frontera: **`C` no es una banda, es un techo.** `PTSA-R30`
  dice *«no puede clasificarse por encima de C»* y `§26` dice que un `CRÍTICO` *«bloquea
  certificación ≥ B»*: las dos reglas que nombran la `C` la usan como **límite**, ninguna como
  rango. Con eso, la función sale entera de lo ya escrito.

- **Nuestra `B` sobrevive al recálculo, y eso hace el arreglo honesto en vez de disruptivo.**
  Medido: `Health 79.9` → base `B`; `health_unstable: true` → techo `B`; `Confidence 94` no
  bloquea; freshness conocida y **ningún hallazgo `CRÍTICO`** —el máximo activo es `H-003`, `Alto
  × Probable = 9`, nivel `ALTO`— así que no hay techo `C`. **Resultado: `B`.** Lo que no
  sobrevive es la banda `(75-89)`.

- **`PTSA-R24` da el patrón para los valores por defecto**, y conviene seguirlo: *«Los umbrales
  DEBEN declararse en `PHASE 0`; los de esta tabla son los valores por defecto»*. Se comprobó que
  nuestro `PHASE 0` **no declara ninguno**, así que ni siquiera esa vía respaldaba la banda.

- **`verify-ptsa` no contiene la cadena `certificac`.** `PTSA-R08` es la única regla `HARD` de
  `PTSA` que exige un entregable y no tiene comprobación. Por eso una letra inventada pasó en
  verde y nadie lo notó hasta que otro proyecto tropezó con lo mismo.

- **Lo que este intake NO establece:** que la función propuesta sea la única correcta. Establece
  que **se deriva sin añadir cifras**, que es un criterio más fuerte que «me parece razonable», y
  que la actual —inexistente— no lo es.

## 15. Resultado de la compuerta `G1` `[AGENTE]`

```
DoR-01 tipo declarado                    [x]  BUG
DoR-02 severidad declarada por el humano [x]  S1 · el firmante la puso PRIMERA del lote
DoR-03 firma humana presente             [x]  §10, con su base
DoR-04 out-of-scope declarado            [x]  cuatro entradas con motivo
DoR-05 PT asignado desde REGISTRY.json   [x]  PT-097
DoR-06 no duplica trabajo vivo           [x]  §13
DoR-07 observaciones registradas         [x]  §14 · cinco
DoR-B1 comportamiento esperado humano    [x]  §2
DoR-B2 comportamiento observado          [x]  §3 · citado literal
DoR-B3 reproducción                      [x]  §4 · en las DOS versiones
DoR-B4 entorno identificado              [x]  §5
DoR-B5 frecuencia declarada              [x]  siempre · 2 de 2 auditorías
DoR-B6 impacto y usuarios declarados     [x]  §6

VEREDICTO: PASS
Firmado por: Alberto Martínez (delegada · constancia en SESSION_LOG.md)
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
