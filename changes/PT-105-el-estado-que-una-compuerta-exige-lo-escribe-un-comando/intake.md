# Intake — BUG · `PT-105` · el estado que una compuerta exige lo escribe un comando

```yaml
---
id: PT-105
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

> Termina cuando: ningún estado que una compuerta exige queda sin comando que lo escriba.

---

## 1. Qué está pasando `[HUMANO]`

Hallazgo salido de **aplicar `PT-103`**. Al cerrar `PT-104` —un `FEATURE`— se vio que llegaba a
`PHASE 8` y **seguía en `DRAFT`**, mientras `FDGE-R34` exige `DONE` para pasar `G4`.

Es la **misma familia que `PT-103`**: cumplir el marco exige saltarse la herramienta.

---

## 2. Comportamiento esperado `[HUMANO]` — obligatorio

**Un estado que una compuerta exige tiene que poder escribirse con un comando.** Si la única
forma de llegar a `DONE` es editar `REGISTRY.json`, la compuerta no comprueba un hecho: comprueba
que alguien se acordó de escribirlo.

Y el estado debe escribirse **cuando el hecho ocurre** —al cerrar Validación con `G3`—, no antes
ni en una fase posterior a la compuerta que lo pide.

---

## 3. Comportamiento observado `[HUMANO]`

```
avanzar --a 7   BUG      -> VALIDATION_PENDING   correcto: cerrar un BUG es humano (SUITE-R06b)
avanzar --a 8   FEATURE  -> sigue en DRAFT       nadie escribe DONE
avanzar --a 10  cualquiera -> DONE o INTEGRATED  POSTERIOR a G4

G4 (PHASE 9)    exige DONE (FDGE-R34)            incumplible sin escribir el registro a mano
```

`estadoDeFase` tiene **dos peldaños** —`PT-099` puso la parada de un `BUG`, `PT-098` el terminal
final— y **le falta el de en medio**: un no-`BUG` que sale de Validación con `G3` firmada.

**Y lo confirma el histórico:** los quince `FEATURE` anteriores llegaron a `INTEGRATED` sin que
ningún comando escribiera el `DONE` intermedio.

---

## 4. Reproducción `[HUMANO]`

```
1. tracker asignar PT --slug x --tipo FEATURE --severidad S1
2. avanzar hasta PHASE 8
3. mirar el estado en REGISTRY.json          -> DRAFT
4. verify-fdge --gate G4 PT-NNN              -> exige DONE
```

- [x] Reproducible siempre siguiendo los pasos
- [ ] Intermitente
- [ ] Ocurrió una vez y no he podido reproducirlo

---

## 5. Entorno `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Entorno | `tracker avanzar` y `verify-fdge --gate G4` |
| Build o commit | rama `chore/alberto-martinez/PT-097-apertura` · suite `11.0.0` |
| Rol de usuario | firmante (`Alberto Martínez`) |
| Fecha y hora del suceso | 2026-08-21 |

---

## 6. Impacto `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Usuarios afectados | toda tarea que no sea un `BUG` |
| Volumen estimado | **quince** `FEATURE` históricos, todos integrados sin ese `DONE` escrito por comando |
| ¿Hay pérdida de datos? | no |
| ¿Existe workaround? | sí, y **es** el problema: escribir el registro a mano |
| Impacto de negocio | una compuerta que solo se puede pasar rodeando la herramienta no comprueba nada |

---

## 7. Evidencia adjunta `[HUMANO]` `[OPCIONAL]`

```
docs/implementation/SESSION_LOG.md   la excepcion de PT-104, declarada ANTES de aplicarla
```

---

## 8. Out of scope `[HUMANO]` — obligatorio

```
OUT: que un BUG llegue solo a DONE
     NO. FDGE-R26 y LEX-R08 dicen que un BUG se DETIENE en VALIDATION_PENDING y solo una
     persona lo mueve (SUITE-R06b). Eso esta bien y no se toca: es el peldaño que PT-099
     puso a proposito.

OUT: retrofechar los quince FEATURE historicos
     SUITE-R09 · llegaron a INTEGRATED y eso es un hecho del arbol. Lo que faltaba era el
     estado intermedio, y reescribirlo ahora seria inventar una historia que no ocurrio.

OUT: cambiar lo que FDGE-R34 exige
     La regla esta BIEN: G4 debe exigir un estado terminal apuntado ANTES del merge
     (SUITE-R46). Lo que falta es el comando que lo escriba.

OUT: revisar si hay mas estados sin comando
     Se mide este. Los demas quedan declarados y sin medir.
```

---

## 9. Criterios de aceptación del arreglo `[HUMANO]`

```
- que un no-BUG llegue a DONE por comando al cerrar Validacion
- que un BUG siga deteniendose en VALIDATION_PENDING
- que no se toque un estado que ya sea terminal
- que no juzgue lo escrito antes de la regla
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

> **Base**, escrita por el agente (`INTAKE-R06`): el hallazgo al cerrar `PT-104`, la excepción
> declarada en `SESSION_LOG.md` y la medición de los quince `FEATURE` históricos. `SUITE-R27`:
> contrastable, no probada.

---

---

# A partir de aquí lo completa el agente

## 11. Criterios de aceptación — versión canónica `[AGENTE]`

```
AC-01: `estadoDeFase` gana el peldaño que falta: un no-BUG que ENTRA en Persistencia —es
       decir, que cerro Validacion con G3— pasa a DONE. Es el estado que FDGE-R34 exige
       para G4, y G4 es la fase SIGUIENTE.

AC-02: un BUG NO pasa a DONE: sigue deteniendose en VALIDATION_PENDING (FDGE-R26, LEX-R08).
       El peldaño de PT-099 se respeta entero.

AC-03: un estado YA terminal no se toca —REJECTED, DEFERRED, INTEGRATED—: FDGE-R53 dice que
       la tarea declara como termina, y el comando no lo decide por ella.

AC-04: se DICE lo que se escribio y por que, como hace el peldaño del BUG. Un estado que
       cambia en silencio es el que luego nadie sabe quien puso.

AC-05: la bateria falla SIN el arreglo, con los DOS negativos: el BUG que no debe pasar y el
       estado terminal que no debe tocarse.
```

## 12. Complejidad propuesta `[AGENTE]`

```
Complejidad: STANDARD
Justificación: un peldaño más en una escalera que ya tiene dos, en la función que `PT-098` y
`PT-099` construyeron para esto. Lo delicado son los negativos, no el caso feliz.
```

## 13. Verificación de duplicados `[AGENTE]`

```
BACKLOG.md consultado:        sí
PTs vivos relacionados:       PT-101 (L-9). No toca `estadoDeFase`
HISTORY.log — PTs similares:  PT-098 derivó el estado terminal del árbol y PT-099 hizo que la
                              transición de un BUG la aplicara el COMANDO. Los dos pusieron un
                              peldaño de esta misma escalera; este es el tercero
Roadmap — R-NNN relacionado:  ninguno
```

## 14. Observaciones del agente `[AGENTE]` — obligatorio

- **Sale de aplicar `PT-103`, no de leer código.** `PT-104` fue la primera tarea creada entera
  desde el comando, y al llegar a `PHASE 8` se quedó en `DRAFT`. El defecto llevaba quince
  `FEATURE` sin verse porque **siempre se había tapado escribiendo el registro a mano**.

- **La escalera estaba a medias y no lo parecía.** `PT-098` puso el peldaño de arriba y `PT-099`
  el de abajo; entre los dos quedó un hueco que ninguno de los dos podía ver, porque cada uno
  resolvía su propio caso.

- **Los dos negativos son la parte delicada.** Que un `BUG` **no** pase a `DONE` es una regla
  deliberada (`SUITE-R06b`), y que un estado terminal no se toque también (`FDGE-R53`). El caso
  feliz es de una línea; lo que hay que probar es que no rompe esos dos.

- **Lo que este intake NO establece:** si hay más estados que una compuerta exige y ningún
  comando escribe. Se mide este.

## 15. Resultado de la compuerta `G1` `[AGENTE]`

```
DoR-01 tipo declarado                    [x]  BUG
DoR-02 severidad declarada por el humano [x]  S1 · una compuerta incumplible sin rodear
DoR-03 firma humana presente             [x]  §10
DoR-04 out-of-scope declarado            [x]  cuatro entradas
DoR-05 PT asignado desde REGISTRY.json   [x]  PT-105 · con `tracker asignar` completo (SUITE-R58)
DoR-06 no duplica trabajo vivo           [x]  §13
DoR-07 observaciones registradas         [x]  §14 · cuatro
DoR-B1 comportamiento esperado humano    [x]  §2
DoR-B2 comportamiento observado          [x]  §3 · con la escalera medida
DoR-B3 reproducción                      [x]  §4 · cuatro pasos
DoR-B4 entorno identificado              [x]  §5
DoR-B5 frecuencia declarada              [x]  siempre, para todo lo que no sea un BUG
DoR-B6 impacto y usuarios declarados     [x]  §6

VEREDICTO: PASS
Firmado por: Alberto Martínez (delegada · constancia en SESSION_LOG.md)
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
