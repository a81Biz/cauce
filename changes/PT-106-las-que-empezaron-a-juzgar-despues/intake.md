# Intake — BUG · `PT-106` · las que empezaron a juzgar después

```yaml
---
id: PT-106
type: BUG
severity: S1
complexity:
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-21
origin: DIRECT
epic: EP-019
---
```

**Cómo termina, en una línea** (`FDGE-R53`):

> Termina cuando: ninguna regla que llegó después juzga trabajo escrito antes de existir, y
> ninguna que existió siempre lleva una fila que invente una restricción que nunca hubo.

---

## 1. Qué está pasando `[HUMANO]`

`L-5` del lote, causa `C-3`. El reparto lo enunció así:

> «las 151 reglas `HARD` declaran desde cuándo rigen, o no rigen. `RIGE_DESDE` 8/151.»

**Y el enunciado está equivocado por un factor de siete.** Al medirlo, las que lo necesitan son
**veinte**.

---

## 2. Comportamiento esperado `[HUMANO]` — obligatorio

**Una regla no puede juzgar trabajo escrito antes de que ella existiera** (`PT-095`). Pero
tampoco puede llevarse una fila **por si acaso**: una regla que existe desde el primer commit no
tiene nada anterior que juzgar mal, y ponerle un `RIGE_DESDE` inventaría una restricción que
nunca hubo.

Y la cifra tiene que ser **la real**, no una plausible.

---

## 3. Comportamiento observado `[HUMANO]`

```
152  reglas HARD
 87  NO emiten nada          -> no pueden juzgar: no necesitan fila
 65  emiten
   7  ya la declaran
  38  existen desde el PRIMER COMMIT -> nada anterior que juzgar mal
  20  llegaron DESPUES       <- las unicas que la necesitan
```

**Y el método obvio habría mentido.** Derivar la versión del `CHANGELOG` parece razonable: ahí
consta cuándo entró cada regla. Contrastado contra las diez ya escritas a mano, **dos discrepan**:

```
EXEC-R04    consta en la 8.1.0     rige desde la 11.0.0
SUITE-R09   consta en la 4.13.0    rige desde la 11.0.0
```

**El `CHANGELOG` dice cuándo se escribió la regla; `RIGE_DESDE` dice desde cuándo juzga.** No es
lo mismo, y una cifra plausible y falsa es peor que ninguna (`RULE-06`).

---

## 4. Reproducción `[HUMANO]`

```
1. contar las HARD que emiten y no declaran RIGE_DESDE   -> 58
2. buscar en git cuando aparecio cada emision            -> 38 en el primer commit
3. quedan 20, y su version se lee del package.json de ese commit
```

- [x] Reproducible siempre siguiendo los pasos
- [ ] Intermitente
- [ ] Ocurrió una vez y no he podido reproducirlo

---

## 5. Entorno `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Entorno | `patrones.mjs` · `RIGE_DESDE` · la historia del repositorio |
| Build o commit | rama `chore/alberto-martinez/PT-097-apertura` · suite `11.0.0` |
| Rol de usuario | firmante (`Alberto Martínez`) |
| Fecha y hora del suceso | 2026-08-21 |

---

## 6. Impacto `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Usuarios afectados | todo proyecto con trabajo anterior a una regla — el legado mide 113 `PT` |
| Volumen estimado | **veinte** reglas juzgando hacia atrás sin declararlo |
| ¿Hay pérdida de datos? | no |
| ¿Existe workaround? | ninguno: una regla sin fila rige hacia atrás por definición |
| Impacto de negocio | un proyecto instalado hoy vería fallar tareas cerradas bajo reglas que aún no existían |

---

## 7. Evidencia adjunta `[HUMANO]` `[OPCIONAL]`

Las veinte, con el commit donde apareció su comprobación:

```
FDGE-R19   7.7.0    FND-R29    7.7.0    SUITE-R40  5.2.1    SUITE-R46  7.0.0
FDGE-R39   7.7.0    FND-R30    5.2.3    SUITE-R42  5.3.0    SUITE-R47  7.7.0
FDGE-R48   4.14.0   SUITE-R31  8.0.0    SUITE-R43  6.0.0    SUITE-R51  7.3.0
FDGE-R49   4.14.0   SUITE-R33  5.0.0    SUITE-R44  6.0.1
FDGE-R51   4.14.0   SUITE-R34  5.0.0    SUITE-R45  7.0.0
                    SUITE-R35  5.0.0    SUITE-R38  7.7.0
```

---

## 8. Out of scope `[HUMANO]` — obligatorio

```
OUT: poner una fila a las 38 que existen desde el primer commit
     Seria INVENTAR una restriccion que nunca existio. No hay nada anterior a ellas en este
     repositorio, asi que no pueden juzgar mal nada. Hay DOS casos que comprueban la
     AUSENCIA, y son la mitad de la tarea.

OUT: poner una fila a las 87 que no emiten
     Una regla que no puede fallar no juzga nada. RIGE_DESDE gobierna una EMISION.

OUT: derivar la version del CHANGELOG
     MEDIDO Y DESCARTADO: dos de las diez escritas a mano discrepan. El CHANGELOG dice
     cuando se ESCRIBIO la regla; esto dice desde cuando JUZGA.

OUT: revisar las reglas de PTSA
     Tienen su propia numeracion y su propio verificador. Quedan declaradas.

OUT: retrofechar las siete que ya tenian fila
     SUITE-R09 · se decidieron a mano y con motivo. Las dos que discrepan del CHANGELOG son
     precisamente la prueba de que la decision humana era la correcta.
```

---

## 9. Criterios de aceptación del arreglo `[HUMANO]`

```
- que las veinte declaren desde cuando rigen, con la cifra REAL
- que las que existen desde siempre NO lleven fila
- que las que no emiten NO lleven fila
- que ninguna cifra se invente: cada una trazable a su commit
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

> **Base**, escrita por el agente (`INTAKE-R06`): el reparto del lote (`L-5`, causa `C-3`), la
> medición de las 152 reglas `HARD` y el contraste contra las diez filas ya escritas.
> `SUITE-R27`: contrastable, no probada.

---

---

# A partir de aquí lo completa el agente

## 11. Criterios de aceptación — versión canónica `[AGENTE]`

```
AC-01: las VEINTE reglas que empezaron a emitir despues del primer commit declaran su
       RIGE_DESDE, con la version que el proyecto tenia en ese commit.

AC-02: las TREINTA Y OCHO que emiten desde el primer commit NO llevan fila: no hay nada
       anterior que puedan juzgar mal, y ponersela inventaria una restriccion.

AC-03: las OCHENTA Y SIETE que no emiten NO llevan fila: una regla que no puede fallar no
       juzga nada.

AC-04: ninguna cifra sale del CHANGELOG. Cada una se deriva del ARBOL —el commit donde
       aparecio la emision— y es trazable a su sha.

AC-05: las dos que discrepan del CHANGELOG conservan el valor decidido a mano, y hay un
       caso que lo comprueba devolviendo el valor que el CHANGELOG sugeriria.

AC-06: la bateria falla SIN el arreglo, con los dos negativos de AUSENCIA.
```

## 12. Complejidad propuesta `[AGENTE]`

```
Complejidad: STANDARD
Justificación: veinte filas de datos derivados. Lo delicado no es escribirlas: es NO escribir
las otras ciento veinticinco, y demostrar por qué.
```

## 13. Verificación de duplicados `[AGENTE]`

```
BACKLOG.md consultado:        sí
PTs vivos relacionados:       PT-101 (L-9). No toca RIGE_DESDE
HISTORY.log — PTs similares:  PT-095 creó RIGE_DESDE —«una regla nueva no juzga lo escrito
                              antes»— y puso las primeras filas. Esta la completa
Roadmap — R-NNN relacionado:  ninguno
```

## 14. Observaciones del agente `[AGENTE]` — obligatorio

- **El enunciado del lote estaba equivocado, y en la dirección peligrosa.** «Las 151 reglas
  `HARD`» habría producido 151 filas, de las cuales **125 serían restricciones inventadas**. La
  medición no recorta el trabajo: lo corrige.

- **El método obvio miente en silencio.** Derivar del `CHANGELOG` da una cifra para cada regla y
  dos de cada diez son falsas. No habría fallado nada: habría quedado escrito y sería mentira.

- **La mitad de la tarea es lo que NO se toca.** Por eso hay dos casos que comprueban la
  **ausencia** de fila, y una retirada que devuelve el valor equivocado para ver que se caza.

- **Lo que este intake NO establece:** si las reglas de `PTSA` necesitan lo mismo. Tienen su
  numeración y su verificador aparte; quedan declaradas.

## 15. Resultado de la compuerta `G1` `[AGENTE]`

```
DoR-01 tipo declarado                    [x]  BUG
DoR-02 severidad declarada por el humano [x]  S1 · veinte reglas juzgan hacia atrás sin decirlo
DoR-03 firma humana presente             [x]  §10
DoR-04 out-of-scope declarado            [x]  cinco entradas
DoR-05 PT asignado desde REGISTRY.json   [x]  PT-106 · con `tracker asignar` completo (SUITE-R58)
DoR-06 no duplica trabajo vivo           [x]  §13
DoR-07 observaciones registradas         [x]  §14 · cuatro
DoR-B1 comportamiento esperado humano    [x]  §2
DoR-B2 comportamiento observado          [x]  §3 · con las cinco cifras medidas
DoR-B3 reproducción                      [x]  §4 · tres pasos
DoR-B4 entorno identificado              [x]  §5
DoR-B5 frecuencia declarada              [x]  siempre
DoR-B6 impacto y usuarios declarados     [x]  §6

VEREDICTO: PASS
Firmado por: Alberto Martínez (delegada · constancia en SESSION_LOG.md)
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
