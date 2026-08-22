# Intake — BUG · `PT-112` · «--forzar» no es una compuerta

```yaml
---
id: PT-112
type: BUG
severity: S1
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

> Termina cuando: ninguna compuerta se puede pasar sin dejar constancia de quién la pasó.

---

## 1. Qué está pasando `[HUMANO]`

`L-8` del lote: **lo que una compuerta no puede exigir sin contradecir a otra.**

`cauce install --forzar` sobrescribe `docs/methodology/` del proyecto destino. Eso es lo que
`SUITE-R06e` dice que **no se automatiza**, y `SUITE-R31` dice que decidir quién tiene razón —el
proyecto que corrigió, o `cauce` que avanzó— es **humano**.

**El flag saltaba las dos sin dejar nada.**

---

## 2. Comportamiento esperado `[HUMANO]` — obligatorio

Una compuerta que se pasa **sin rastro no es una compuerta: es una puerta.**

No se trata de prohibir `--forzar`: un proyecto que ya decidió necesita poder aplicarlo. Lo que
no puede es hacerlo **sin que conste quién lo decidió y qué se sobrescribió** — que es lo mismo
que `EXEC-R04a` exige de `G4`.

---

## 3. Comportamiento observado `[HUMANO]`

```
bin/cauce.mjs:43    const FORZAR = resto.includes('--forzar');
bin/cauce.mjs:143   if (... && !FORZAR) { ...avisa y para... }

con --forzar        sobrescribe
                    sin nombre · sin registro · sin fecha
```

El aviso que se salta dice literalmente: *«Sobrescribir puede revertir correcciones que ese
proyecto hizo bajo sus propios `PT`: ha estado a punto de pasar»*.

---

## 4. Reproducción `[HUMANO]`

```
1. un proyecto con docs/methodology/ modificado
2. cauce install --forzar
3. el marco queda sobrescrito y NADA registra quien lo decidio
```

- [x] Reproducible siempre siguiendo los pasos
- [ ] Intermitente
- [ ] Ocurrió una vez y no he podido reproducirlo

---

## 5. Entorno `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Entorno | `bin/cauce.mjs` · instalación en un proyecto destino |
| Build o commit | rama `chore/alberto-martinez/PT-097-apertura` · suite `12.0.0` |
| Rol de usuario | firmante (`Alberto Martínez`) |
| Fecha y hora del suceso | 2026-08-22 |

---

## 6. Impacto `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Usuarios afectados | todo proyecto destino que reinstale |
| Volumen estimado | **una** puerta sin registro, sobre `docs/methodology/` |
| ¿Hay pérdida de datos? | **SÍ, potencialmente**: sobrescribe correcciones hechas bajo los `PT` del destino |
| ¿Existe workaround? | no usar el flag, que nada impone |
| Impacto de negocio | `SUITE-R06e` y `SUITE-R31` se pueden incumplir con un flag y sin rastro |

---

## 7. Out of scope `[HUMANO]` — obligatorio

```
OUT: prohibir «--forzar»
     Un proyecto que YA decidio necesita poder aplicarlo. Prohibirlo obligaria a copiar
     archivos a mano, que es peor: mismo efecto y sin ningun rastro.

OUT: INC-007 e INC-013
     Sus descripciones viven en el INCIDENTS.log de la CALCULADORA, que NO ESTA en esta
     maquina —el mismo «find» que PT-109 dejo escrito no encuentra ninguno—. Se declaran.

OUT: hacer que «--forzar» pida confirmacion interactiva
     Un prompt no deja constancia y rompe la instalacion no interactiva. Lo que hace falta
     es el REGISTRO, no la pregunta.

OUT: revisar si otros flags saltan una compuerta
     Se mide «--forzar», que es el que L-8 nombra. Los demas quedan declarados.
```

---

## 8. Criterios de aceptación del arreglo `[HUMANO]`

```
- que «--forzar» exija quien lo decide
- que deje constancia de que se sobrescribio, cuando y que archivos
- que si no puede registrarlo, NO sobrescriba
- que no rompa la instalacion de un proyecto nuevo
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

> **Base**, escrita por el agente (`INTAKE-R06`): el reparto del lote (`L-8`) y la medición de
> `bin/cauce.mjs`. `SUITE-R27`: contrastable, no probada.

---

---

# A partir de aquí lo completa el agente

## 10. Criterios de aceptación — versión canónica `[AGENTE]`

```
AC-01: «--forzar» exige un nombre y sin el NO sobrescribe.

AC-02: deja constancia en docs/implementation/INSTALL.log: quien, cuando, la version, y
       que archivos difieren o sobran.

AC-03: si NO puede escribir la constancia, NO sobrescribe (RULE-06). Sobrescribir sin poder
       registrarlo es exactamente lo que esto impide.

AC-04: una instalacion NUEVA no se toca: no hay divergencia que decidir.

AC-05: INC-007 e INC-013 quedan DECLARADOS sin arreglar, con su motivo.
```

## 11. Complejidad propuesta `[AGENTE]`

```
Complejidad: STANDARD
Justificación: una guarda y un registro. Lo delicado es no romper la instalación nueva, que no
tiene divergencia que decidir.
```

## 12. Verificación de duplicados `[AGENTE]`

```
BACKLOG.md consultado:        sí
PTs vivos relacionados:       ninguno
HISTORY.log — PTs similares:  PT-103 y PT-105 son la misma familia — cumplir el marco exigía
                              saltárselo. Aquí es al revés: saltárselo era demasiado fácil
Roadmap — R-NNN relacionado:  ninguno
```

## 13. Observaciones del agente `[AGENTE]` — obligatorio

- **Es la imagen invertida de `PT-103`.** Allí cumplir el marco **exigía** saltarse la herramienta;
  aquí saltarse la regla era **un flag**. Las dos son la misma avería: la distancia entre lo que
  la regla dice y lo que la herramienta permite.

- **No se prohíbe, se registra.** Prohibirlo obligaría a copiar archivos a mano — mismo efecto y
  **sin ningún rastro**, que es peor.

- **Usa `SUITE-R59` sin que nadie lo recuerde.** El salto de línea del registro va por
  `String.fromCharCode`, que es la regla que `PT-101` acaba de crear. Es la primera vez que se
  aplica en la tarea siguiente.

- **Lo que este intake NO establece:** si otros flags saltan una compuerta. Se mide `--forzar`.

## 14. Resultado de la compuerta `G1` `[AGENTE]`

```
DoR-01 tipo declarado                    [x]  BUG
DoR-02 severidad declarada por el humano [x]  S1 · puede sobrescribir correcciones ajenas
DoR-03 firma humana presente             [x]  §9
DoR-04 out-of-scope declarado            [x]  cuatro entradas
DoR-05 PT asignado desde REGISTRY.json   [x]  PT-112 · con `tracker asignar` completo
DoR-06 no duplica trabajo vivo           [x]  §12
DoR-07 observaciones registradas         [x]  §13 · cuatro
DoR-B1 comportamiento esperado humano    [x]  §2
DoR-B2 comportamiento observado          [x]  §3 · con las líneas citadas
DoR-B3 reproducción                      [x]  §4
DoR-B4 entorno identificado              [x]  §5
DoR-B5 frecuencia declarada              [x]  siempre que se use el flag
DoR-B6 impacto y usuarios declarados     [x]  §6

VEREDICTO: PASS
Firmado por: Alberto Martínez (delegada · constancia en SESSION_LOG.md)
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
