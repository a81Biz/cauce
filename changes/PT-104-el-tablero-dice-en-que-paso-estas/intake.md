# Intake — FEATURE · `PT-104` · el tablero dice en qué paso estás

```yaml
---
id: PT-104
type: FEATURE
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

> Termina cuando: el cuerpo del issue dice **en qué paso está** la tarea, **qué la dejó entrar**,
> **qué tiene que ocurrir para salir** y **a dónde va después** — sin que nadie ejecute nada.

---

## 1. Qué está pasando `[HUMANO]`

Petición del firmante, 2026-08-21:

> «cuando publicas en Github y plasmas todo lo que se debe hacer, se supone que debería servir
> como una máquina de estados que diga en cada paso a dónde ir, cuál es la regla de entrada y
> cuál es la de salida, así en github publicas lo que será, la investigación, cuando es necesario
> graphify, la propuesta, el resultado esperado y el resultado obtenido y los hallazgos
> encontrados… en eso habíamos quedado para obligarte a seguir siempre la metodología»

**Y estaba acordado desde el 2026-08-13.** `REGISTRY.json:172` guarda la petición original:
«usarlo hasta de **máquina de estados** para saber qué va cuándo».

---

## 2. Comportamiento esperado `[HUMANO]` — obligatorio

El tablero es lo que **se mira sin acordarse de nada**. Si el procedimiento solo está en un
comando, depende de que alguien lo ejecute — y el propio `EP-007` cerró diciéndolo: «un comando
no puede exigir haber sido llamado».

El cuerpo del issue debe decir, **derivado y sin que nadie lo escriba**:

```
en que PASO esta          y como se llama
que la dejo ENTRAR        la regla de entrada
que tiene que pasar para SALIR   la regla de salida, y su compuerta
a donde va DESPUES
que produce cada paso     y cuales de esos artefactos EXISTEN ya
```

---

## 3. Comportamiento observado `[HUMANO]`

Lo que el cuerpo publica hoy, medido sobre `cuerpoDeIssue`:

```
LLEVA     tipo · severidad · lote
          veredicto de viabilidad (FDGE-R54)
          enlace a changes/ con ref durable (SUITE-R56)
          en que rama vive el contenido

NO LLEVA  en que fase esta
          la regla de ENTRADA de esa fase
          la regla de SALIDA
          a donde va despues
          la investigacion · la propuesta
          el resultado esperado · el obtenido · los hallazgos
```

**`FASES` ya declara las tres piezas** —`nombre`, `produce`, `cierra`— y `queSigue` ya las
deriva. Nada de eso llega al tablero: vive en `tracker siguiente`, que hay que acordarse de
ejecutar.

---

## 4. Motivación `[HUMANO]`

El firmante lo dice sin rodeos: **«para obligarte a seguir siempre la metodología»**.

Y la sesión que abre esta tarea le da la razón con datos: el registro se escribió a mano cinco
veces (`PT-103`), el grafo llevaba `SUSPECT` seis tareas sin que nadie lo mirara, y los
señalamientos que lo destaparon fueron los tres del firmante, no una comprobación.

---

## 5. Impacto `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Usuarios afectados | todo proyecto con plataforma declarada |
| ¿Hay pérdida de datos? | no |
| ¿Existe workaround? | `tracker siguiente` — y **es** el problema: hay que acordarse |
| Impacto de negocio | el marco existe para que el procedimiento no dependa de la memoria de quien trabaja |

---

## 6. Out of scope `[HUMANO]` — obligatorio

```
OUT: copiar el CONTENIDO de changes/ al issue
     SUITE-R35 lo prohibe y con razon: dos copias del mismo texto divergen. Lo que se
     publica es ESTADO DERIVADO —en que paso, que regla, que artefactos existen—, no el
     texto de la investigacion ni de la propuesta. El «que dice» sigue en el repositorio;
     el issue dice DONDE esta y SI esta.

OUT: rehacer las fases o sus reglas
     FASES ya declara nombre, produce y cierra. Se PUBLICA lo que ya existe.

OUT: obligar a que el agente lo lea
     No se puede — EP-007 y EP-008 ya lo establecieron: un comando no puede exigir haber
     sido llamado, y un artefacto que el agente escribe sobre si mismo no prueba nada.
     Lo que esto consigue es que el paso siguiente este ESCRITO donde se mira, y que
     saltarselo sea visible para una persona.

OUT: publicar el grafo dentro del issue
     Se dice CUANDO hace falta regenerarlo y si esta al dia (FDGE-R43), que es el dato
     accionable. El grafo vive en graphify-out/.

OUT: los issues ya cerrados
     SUITE-R09 · lo terminado no se retrofecha. El cuerpo se resincroniza en «abrir
     --aplicar» para los vivos.
```

---

## 7. Criterios de aceptación `[HUMANO]`

```
- que el issue diga en que paso esta la tarea, sin ejecutar nada
- que diga que regla la dejo entrar y cual tiene que cumplir para salir
- que diga a donde va despues
- que diga que artefactos deberia haber producido y cuales EXISTEN
- que no copie el contenido de changes/
```

---

## 8. Firma `[HUMANO]` — obligatorio

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-21
Confirmo que el comportamiento esperado, la severidad y el out-of-scope reflejan mi
intención: SÍ

Firmado por lote: EP-019
```

> **Base**, escrita por el agente (`INTAKE-R06`): la petición literal del firmante del
> 2026-08-21, la petición original registrada el 2026-08-13 (`REGISTRY.json:172`) y lo que
> `EP-007` dejó declarado como no entregado. `SUITE-R27`: contrastable, no probada.

---

---

# A partir de aquí lo completa el agente

## 9. Criterios de aceptación — versión canónica `[AGENTE]`

```
AC-01: el cuerpo publica la FASE actual con su nombre, derivada de la allocation.

AC-02: publica la regla de SALIDA de esa fase —el «cierra» que FASES ya declara— y la
       compuerta que la cierra, si la tiene.

AC-03: publica la regla de ENTRADA: el «cierra» de la fase anterior, que es lo que tuvo que
       cumplirse para llegar aqui. Una maquina de estados sin transicion de entrada no dice
       de donde vienes.

AC-04: publica A DONDE VA: la fase siguiente con su nombre.

AC-05: publica los ARTEFACTOS que la fase produce y CUALES EXISTEN ya — derivado del arbol,
       no declarado. Es lo que convierte «deberia» en «esta».

AC-06: publica los BLOQUEOS y AVISOS que «queSigue» ya deriva, que es la respuesta a «que me
       impide avanzar».

AC-07: NO copia contenido de changes/ (SUITE-R35). Solo estado derivado y rutas.

AC-08: la bateria falla sin el arreglo, con el negativo que impide que un cuerpo vacio pase.
```

## 10. Complejidad propuesta `[AGENTE]`

```
Complejidad: STANDARD
Justificación: `FASES` y `queSigue` ya tienen los datos. Lo que falta es publicarlos en el
cuerpo derivado y comprobar que no se copia contenido.
```

## 11. Verificación de duplicados `[AGENTE]`

```
BACKLOG.md consultado:        sí
PTs vivos relacionados:       PT-101 (L-9) y PT-103. Ninguno toca «cuerpoDeIssue»
HISTORY.log — PTs similares:  EP-007 (PT-030, PT-031) entregó `tracker siguiente` y declaró
                              explícitamente que NO entrega esto. EP-008 (PT-033, PT-034)
                              hizo que CORE.md abra con la consulta al tablero — pero el
                              tablero no responde lo que hace falta
Roadmap — R-NNN relacionado:  ninguno
```

## 12. Observaciones del agente `[AGENTE]` — obligatorio

- **Estaba acordado hace ocho días y lo que se entregó fue otra cosa.** `EP-007` se llama «el
  tablero como máquina de estados» y entregó **un comando**. Su propio cierre lo dice: «un
  comando no puede exigir haber sido llamado». El hueco quedó escrito y nadie volvió a él.

- **`SUITE-R35` no lo impide, y conviene decir por qué.** Prohíbe **copiar contenido** —dos
  copias del mismo texto divergen—. Publicar **estado derivado** es lo contrario: no hay segunda
  copia porque no hay texto propio, se recalcula de la allocation y del árbol en cada
  `abrir --aplicar`.

- **La distinción que hace esto útil es «debería» contra «está».** Publicar que `PHASE 4` produce
  seis archivos no vale nada; publicar **cuáles de los seis existen** convierte el issue en algo
  que puede contradecir a quien lo escribe.

- **No obliga a nadie y no puede.** `EP-007` y `EP-008` ya lo establecieron. Lo que consigue es
  que el paso siguiente esté escrito **donde se mira sin acordarse**, y que saltárselo sea
  visible para una persona — que es exactamente lo que ha ocurrido tres veces en esta sesión, y
  las tres las vio el firmante, no una herramienta.

- **Lo que este intake NO establece:** que publicarlo cambie la conducta del agente. Eso no es
  comprobable y no se va a afirmar.

## 13. Resultado de la compuerta `G1` `[AGENTE]`

```
DoR-01 tipo declarado                    [x]  FEATURE
DoR-02 severidad declarada por el humano [x]  S1
DoR-03 firma humana presente             [x]  §8
DoR-04 out-of-scope declarado            [x]  cinco entradas
DoR-05 PT asignado desde REGISTRY.json   [x]  PT-104 · con «tracker asignar» completo (SUITE-R58)
DoR-06 no duplica trabajo vivo           [x]  §11
DoR-07 observaciones registradas         [x]  §12 · cinco

VEREDICTO: PASS
Firmado por: Alberto Martínez (delegada · constancia en SESSION_LOG.md)
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).
