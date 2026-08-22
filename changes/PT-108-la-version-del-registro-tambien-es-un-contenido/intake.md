# Intake — BUG · `PT-108` · la versión del registro también es un contenido

```yaml
---
id: PT-108
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

> Termina cuando: `version.mjs` no deja fuera ninguna declaración de versión que exista en el
> proyecto, o dice cuál no mira.

---

## 1. Qué está pasando `[HUMANO]`

Encontrado **al sellar la `12.0.0`**. `version.mjs` alineó los veintiún documentos y el
`CLAUDE.md` del proyecto, dijo «Todo declara 12.0.0», y **`REGISTRY.json` se quedó en `11.0.0`**.

Lo destapó `verify-fdge`, que puso el proyecto en **modo restringido** (`SUITE-R17`).

---

## 2. Comportamiento esperado `[HUMANO]` — obligatorio

Lo mismo que `PT-102` estableció: **una herramienta que alinea versiones no puede dar por
alineado lo que no sabe leer.** Y `REGISTRY.json` no es un documento cualquiera: es donde el
marco guarda el estado.

---

## 3. Comportamiento observado `[HUMANO]`

```
$ node docs/methodology/tools/version.mjs docs/methodology --aplicar
Todo declara 12.0.0.

$ node -e "...REGISTRY.suite_version..."     -> 11.0.0
$ node docs/methodology/tools/verify-fdge.mjs PT-107
  ✗ SUITE-R17   El proyecto declara suite_version 11.0.0 y la vigente es 12.0.0.
                Modo restringido.
```

**Es la tercera forma de declarar la versión.** `PT-102` encontró dos —`Suite version: **X.Y.Z**`
y `suite_version: X.Y.Z` en Markdown— y declaró explícitamente lo que no establecía: «cuántas
formas más existen». Esta es la respuesta: **una más, y en `JSON`.**

---

## 4. Reproducción `[HUMANO]`

```
1. subir la version en CHANGELOG.md
2. node tools/version.mjs docs/methodology --aplicar   -> «Todo declara X»
3. node tools/verify-fdge.mjs <PT>                      -> modo restringido
```

- [x] Reproducible siempre siguiendo los pasos
- [ ] Intermitente
- [ ] Ocurrió una vez y no he podido reproducirlo

---

## 5. Entorno `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Entorno | `version.mjs` · `REGISTRY.json` |
| Build o commit | rama `chore/alberto-martinez/PT-097-apertura` · suite `12.0.0` |
| Rol de usuario | firmante (`Alberto Martínez`) |
| Fecha y hora del suceso | 2026-08-22 |

---

## 6. Impacto `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Usuarios afectados | todo proyecto que suba de versión |
| Volumen estimado | **una** declaración, y bloquea el proyecto entero |
| ¿Hay pérdida de datos? | no |
| ¿Existe workaround? | editar el registro a mano — lo que `SUITE-R58` acaba de desaconsejar |
| Impacto de negocio | sellar una versión deja el proyecto en modo restringido hasta que alguien lo note |

---

## 7. Out of scope `[HUMANO]` — obligatorio

```
OUT: buscar la version en cualquier JSON del proyecto
     REGISTRY.json es el estado del marco y tiene su campo declarado. Rastrear cualquier
     «version» en cualquier JSON casaria con dependencias y con datos ajenos.

OUT: que version.mjs escriba el REGISTRO por su cuenta sin cerrojo
     PT-107 acaba de poner un cerrojo en tracker. Escribir el registro desde otra herramienta
     sin pasar por el devolveria el defecto que PT-107 arreglo.

OUT: rehacer como se numera la suite
     Se arregla la LECTURA, como en PT-102.
```

---

## 8. Criterios de aceptación del arreglo `[HUMANO]`

```
- que version.mjs vea la version declarada en REGISTRY.json
- que no toque ningun otro campo del registro
- que no lo escriba sin el cerrojo que PT-107 introdujo
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

> **Base**, escrita por el agente (`INTAKE-R06`): el bloqueo por `SUITE-R17` al sellar la
> `12.0.0`, y lo que `PT-102` dejó declarado como no establecido. `SUITE-R27`: contrastable, no
> probada.

---

---

# A partir de aquí lo completa el agente

## 10. Criterios de aceptación — versión canónica `[AGENTE]`

```
AC-01: version.mjs lee y alinea el «suite_version» de REGISTRY.json.

AC-02: NO toca ningun otro campo del registro: se reescribe el archivo entero y un descuido
       aqui borraria allocations (PT-107 lo vivio).

AC-03: la escritura pasa por el mismo cerrojo que PT-107 introdujo, o se DECLARA por que no.

AC-04: la bateria falla sin el arreglo, con el negativo que impide tocar otros campos.
```

## 11. Complejidad propuesta `[AGENTE]`

```
Complejidad: STANDARD
Justificación: una lectura y una escritura más. Lo delicado es que el archivo es el registro:
`PT-107` acaba de demostrar lo que cuesta escribirlo mal.
```

## 12. Verificación de duplicados `[AGENTE]`

```
BACKLOG.md consultado:        sí
PTs vivos relacionados:       PT-101, PT-109
HISTORY.log — PTs similares:  PT-102 arregló las dos formas en Markdown y declaró que no sabía
                              cuántas más había. Esta es la tercera
Roadmap — R-NNN relacionado:  ninguno
```

## 13. Observaciones del agente `[AGENTE]` — obligatorio

- **Es la confirmación de un «no establecido».** `PT-102` escribió: «cuántas formas más de
  declarar una versión existen. Se conocen dos». Declararlo sirvió: cuando apareció la tercera,
  había dónde encajarla en vez de parecer un defecto nuevo.

- **Y apareció al sellar, no al programar.** El sello es la única operación que toca todas las
  declaraciones a la vez, y por eso es donde una que falta se nota.

- **Escribir el registro desde `version.mjs` no es trivial ahora.** `PT-107` puso un cerrojo en
  `tracker`; una segunda herramienta que escriba el mismo archivo sin pasar por él reabre el
  defecto. Hay que decidirlo, no darlo por hecho.

- **Lo que este intake NO establece:** si hay una cuarta forma. Se conocen tres.

## 14. Resultado de la compuerta `G1` `[AGENTE]`

```
DoR-01 tipo declarado                    [x]  BUG
DoR-02 severidad declarada por el humano [x]  S2 · bloquea el proyecto, no pierde datos
DoR-03 firma humana presente             [x]  §9
DoR-04 out-of-scope declarado            [x]  tres entradas
DoR-05 PT asignado desde REGISTRY.json   [x]  PT-108 · con `tracker asignar` completo
DoR-06 no duplica trabajo vivo           [x]  §12
DoR-07 observaciones registradas         [x]  §13 · cuatro
DoR-B1 comportamiento esperado humano    [x]  §2
DoR-B2 comportamiento observado          [x]  §3
DoR-B3 reproducción                      [x]  §4
DoR-B4 entorno identificado              [x]  §5
DoR-B5 frecuencia declarada              [x]  siempre que se suba de versión
DoR-B6 impacto y usuarios declarados     [x]  §6

VEREDICTO: PASS
Firmado por: Alberto Martínez (delegada · constancia en SESSION_LOG.md)
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
