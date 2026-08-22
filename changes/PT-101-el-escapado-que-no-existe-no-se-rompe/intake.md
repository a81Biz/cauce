# Intake — BUG · `PT-101` · el escapado que no existe no se rompe

```yaml
---
id: PT-101
type: BUG
severity: S2
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

> Termina cuando: el marco cuenta sus roturas de escapado **en un solo sitio** y algo puede
> ponerse rojo **antes** de que una se escriba, en vez de cazarla después.

---

## 1. Qué está pasando `[HUMANO]`

Observación del firmante, 2026-08-21:

> «en ésta sesión en particular has tenido muchos problemas con los escapes, se supone que ya
> existe un formato para evitar que se rompa y algo que lo revisa y corrige, si no, deberíamos
> pensar en normalizar todas las instrucciones de alguna forma, que sigan un patrón y pasen por
> un normalizador.»

---

## 2. Comportamiento esperado `[HUMANO]` — obligatorio

**El escape que no existe no se rompe.** Este repositorio ya lo sabe y lo aplica en sitios
concretos —`String.fromCharCode(10)` en vez de un salto escapado, regex literales en vez de
construidos desde cadenas—, pero lo aplica **por costumbre**, no por comprobación.

Y un aviso repetido no es una defensa. Si el marco lleva la cuenta de un fallo, esa cuenta debe
estar **en un sitio**, y algo debe poder **impedirlo**, no solo detectarlo cuando ya ocurrió.

---

## 3. Comportamiento observado `[HUMANO]`

**El marco ya lo sabe, y lo apunta mal.** Cuatro archivos llevan la cuenta por separado, en
comentarios:

```
build-core.mjs:463       «Montar estos patrones desde strings ha fallado CINCO veces aqui»
verify-ptsa.mjs:108      «montarlos desde strings ha fallado CINCO veces en este proyecto»
revisar-secretos.mjs:36  «Montarlos desde strings ha fallado SIETE veces en este proyecto»
audit.mjs:375            caza el byte 0x08 YA ESCRITO — POSTERIOR, no preventivo
```

**Nadie suma.** Cada archivo dice «cinco» o «siete» por su lado; el total es **diecisiete**, y
ninguno de los cuatro lo ve. Es `SUITE-R38` —un hecho, una fuente— aplicado a una cifra.

**Y `audit` llega tarde por diseño.** Detecta el byte `0x08` cuando ya está en el archivo: el
daño ocurrió, y lo que hace es encontrarlo.

**Las ocho roturas de esta sesión no las cazó ninguno**, porque rompieron en la **vía** —un
`heredoc` de bash, un `replace` de Python, una plantilla de texto transformada— y no en el
destino. El marco protege el archivo y no el camino por el que se escribe.

---

## 4. Reproducción `[HUMANO]`

```
1. escribir un archivo con un heredoc que contenga una comilla simple
2. el shell no llega a ejecutarlo: «unexpected EOF while looking for matching»
3. audit no lo ve: el archivo nunca se escribio
```

- [x] Reproducible siempre siguiendo los pasos
- [ ] Intermitente
- [ ] Ocurrió una vez y no he podido reproducirlo

---

## 5. Entorno `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Entorno | las herramientas de la suite y la vía por la que se editan |
| Build o commit | rama `chore/alberto-martinez/PT-097-apertura` · suite `11.0.0` |
| Rol de usuario | firmante (`Alberto Martínez`) |
| Fecha y hora del suceso | 2026-08-21 |

---

## 6. Impacto `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Usuarios afectados | quien edite las herramientas del marco |
| Volumen estimado | **diecisiete** contadas en comentarios · **ocho** más en esta sesión |
| ¿Hay pérdida de datos? | no |
| ¿Existe workaround? | sí, y es el que el repositorio ya usa: no escribir el escape |
| Impacto de negocio | dos de las roturas produjeron **código que compila y miente** — un regex que no casa nada falla en silencio |

---

## 7. Evidencia adjunta `[HUMANO]` `[OPCIONAL]`

Las ocho de esta sesión, por vía:

```
heredoc de bash con comilla simple      3   el archivo NO se escribe · falla visible
replace de Python sobre un regex        2   queda un regex sin cerrar · no compila
plantilla de texto transformada         1   comillas invertidas rotas · no compila
saltos de linea escapados que se        2   el fixture cambia de forma · falla el caso
  convirtieron en saltos reales
```

---

## 8. Out of scope `[HUMANO]` — obligatorio

```
OUT: cambiar la capa de escapado del agente
     No esta en el repositorio y no se puede tocar desde aqui. Lo que SI se puede es que el
     marco no dependa de ella.

OUT: prohibir los heredocs
     No se puede: son la via normal de escribir un archivo desde una consola. Lo que se
     arregla es que el marco NO EXIJA pasar texto largo por ahi.

OUT: reescribir los comentarios historicos
     SUITE-R09 · lo escrito es historia. Se ANADE una fuente unica; no se borran las cuentas
     que cada archivo lleva, que son el rastro de como se descubrio.

OUT: contar las roturas de sesiones pasadas
     Se cuentan las DECLARADAS en comentarios (diecisiete) y las de esta sesion (ocho).
     Decir un total historico seria afirmar sin medir.
```

---

## 9. Criterios de aceptación del arreglo `[HUMANO]`

```
- que la cuenta de roturas viva en UN sitio, no en cuatro comentarios
- que algo pueda ponerse rojo ANTES de que una se escriba, no despues
- que el marco no exija pasar texto largo por una capa de escapado
- que no rompa lo que ya funciona
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

> **Base**, escrita por el agente (`INTAKE-R06`): la observación literal del firmante del
> 2026-08-21 y la medición de los cuatro comentarios que llevan la cuenta por separado.
> `SUITE-R27`: contrastable, no probada.

---

---

# A partir de aquí lo completa el agente

## 11. Criterios de aceptación — versión canónica `[AGENTE]`

```
AC-01: la cuenta de roturas de escapado vive en UN sitio —patrones.mjs, que es donde este
       repositorio pone lo que no puede divergir— y los cuatro comentarios la CITAN en vez
       de llevar cada uno la suya (SUITE-R38).

AC-02: audit detecta las CONSTRUCCIONES FRAGILES, no solo el byte ya escrito: un regex
       montado desde una cadena en una herramienta de la suite es un aviso, con su ruta.

AC-03: el aviso dice QUE HACER, no solo que hay un problema: la forma que este repositorio
       ya usa —regex literal, String.fromCharCode— va en el mensaje.

AC-04: AVISA y no falla, con RIGE_DESDE. Hay construcciones frágiles escritas antes de la
       regla y SUITE-R09 no retrofecha.

AC-05: la bateria falla SIN el arreglo, con el negativo que impide que un regex literal
       —que es lo correcto— se marque como frágil.
```

## 12. Complejidad propuesta `[AGENTE]`

```
Complejidad: STANDARD
Justificación: una cifra que se centraliza y una comprobación que se añade a `audit`. Lo
delicado es el negativo: distinguir un regex construido de uno literal sin marcar los buenos.
```

## 13. Verificación de duplicados `[AGENTE]`

```
BACKLOG.md consultado:        sí
PTs vivos relacionados:       ninguno vivo. PT-102, PT-103 y PT-104 están DONE
HISTORY.log — PTs similares:  PT-095 puso el byte 0x08 DENTRO del comentario que avisaba
                              sobre el byte 0x08. audit:375 nació de ahí. Ninguno atacó la VÍA
Roadmap — R-NNN relacionado:  ninguno
```

## 14. Observaciones del agente `[AGENTE]` — obligatorio

- **La cifra dispersa es el hallazgo, no el síntoma.** Que tres archivos digan «cinco», «cinco» y
  «siete» sin que nadie sume es exactamente el defecto que `SUITE-R38` describe — y estaba
  ocurriendo **dentro de los comentarios que avisan de otro defecto**.

- **`audit` no está mal: está en el sitio equivocado del tiempo.** Caza el byte `0x08` ya
  escrito. Es útil y se queda. Lo que falta es una comprobación **anterior**.

- **La vía no se puede arreglar desde aquí, y no hace falta.** No se puede cambiar cómo escribe
  un agente; sí se puede hacer que el marco **no dependa** de ello. Ese es el desplazamiento que
  propone el firmante: **normalizar en vez de advertir**.

- **Ocho roturas en la sesión que abrió esta tarea**, incluidas dos escribiendo la documentación
  de tareas que hablan de este mismo problema. La tercera vez en este repositorio que un defecto
  aparece dentro de su propio arreglo.

- **Lo que este intake NO establece:** cuántas roturas ha habido en total. Se cuentan las
  declaradas en comentarios y las de esta sesión. Un total histórico sería afirmar sin medir.

## 15. Resultado de la compuerta `G1` `[AGENTE]`

```
DoR-01 tipo declarado                    [x]  BUG
DoR-02 severidad declarada por el humano [x]  S2 · rompe la vía, no el producto
DoR-03 firma humana presente             [x]  §10
DoR-04 out-of-scope declarado            [x]  cuatro entradas
DoR-05 PT asignado desde REGISTRY.json   [x]  PT-101
DoR-06 no duplica trabajo vivo           [x]  §13
DoR-07 observaciones registradas         [x]  §14 · cinco
DoR-B1 comportamiento esperado humano    [x]  §2
DoR-B2 comportamiento observado          [x]  §3 · con las cuatro cuentas medidas
DoR-B3 reproducción                      [x]  §4
DoR-B4 entorno identificado              [x]  §5
DoR-B5 frecuencia declarada              [x]  siempre, por esa vía
DoR-B6 impacto y usuarios declarados     [x]  §6

VEREDICTO: PASS
Firmado por: Alberto Martínez (delegada · constancia en SESSION_LOG.md)
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).


---

## Revisión 1 — 2026-08-22 · el alcance se amplió, y se declara tarde
> `SUITE-R09` · append-only. Esta revisión **no reescribe** el intake: dice qué se hizo **fuera**
> de lo que firmó y por qué, que es lo que debió escribirse **antes**.

### Lo que pasó, sin adornos

El intake firmado declara cinco criterios: **centralizar la cuenta**, que `audit` detecte la
construcción frágil, que el mensaje diga qué hacer, `RIGE_DESDE`, y que la batería falle sin el
arreglo.

**Se hizo eso y además dos cosas que no estaban:**

1. **`SUITE-R59`**, una regla `HARD` nueva.
2. **Un normalizador** en `patrones.mjs` —`comoPalabra`, `comoLiteral`, `CLASE`, `CAR`— y tres
   herramientas cambiadas para usarlo.

**Lo decidí sobre la marcha.** No hubo `G2` sobre ese alcance, ni viabilidad registrada antes de
empezar, ni escenarios escritos. Lo señaló el firmante:

> «lo corregiste y aumentaste una regla, pero te saltaste toda la metodología, no tiene `PT` que
> indique alcance, ni costes, ni pruebas… simplemente decidiste»

### Por qué la ampliación es correcta, y por qué eso no la excusa

El intake mide bien el defecto —veintisiete roturas contadas en cinco comentarios sin sumar— y
propone **detectarlo**. Al ejecutarlo apareció lo que el intake no vio: **la regla no existe como
regla**.

```
RULES.md         0 reglas sobre escapado
LEXICON.md       0
PHASES.md        0
EXECUTION-MODES  0
comentarios      27 roturas, 5 cuentas distintas
```

Un defecto que solo vive en comentarios **se arregla de uno en uno**, porque nada lo exige al caso
siguiente. Eso es lo que el firmante venía diciendo, y es la causa — no el síntoma.

**Y detectar sin ofrecer alternativa repite el error.** Durante veintisiete roturas el marco decía
«no montes patrones desde cadenas» y **no daba con qué hacerlo**. Por eso el normalizador.

**Nada de esto justifica haberlo decidido sin declararlo.** El alcance de una tarea lo fija su
intake, y ampliarlo es una decisión que se escribe **antes**, no una que se cuenta después. Es la
misma avería que `PT-103` describe —cumplir el marco exigiendo saltárselo— cometida por elección,
no por falta de herramienta.

### Criterios que se añaden, y que estaban sin declarar

```
AC-06: SUITE-R59 existe en RULES.md, con RIGE_DESDE, y la citan PHASES y FDGE-Prompts —
       una regla que solo vive en el codigo no la ve quien trabaja en MANUAL (lo exigio
       audit en PT-100 y vale igual aqui).

AC-07: el normalizador existe y NINGUNA de sus funciones lleva una barra invertida escrita
       dentro de una cadena. Esa es su unica propiedad y es la que importa: lo que no se
       escribe no se puede perder al pasar por un shell, un heredoc o un replace.

AC-08: las tres construcciones fragiles encontradas quedan arregladas, y son defectos
       REALES con efecto medido, no higiene.
```

### Lo que la comprobación encontró en su primera corrida

Tres construcciones frágiles, **todas silenciosas**:

| Dónde | Qué hacía |
|:---|:---|
| `patrones.mjs:1226` | `(^|\s)${h}\s` con barra simple → compila a `(^|s)…s` · **ningún helper se detectaba nunca** |
| `verify-fdge:680` | igual → un campo de estado con sangría **no se detectaba** |
| `verify-fdge:685` | igual |

**Ninguna fallaba.** Devolvían vacío, que es el fallo que el propio repositorio describe en sus
comentarios: «el regex compila y no casa nada — el fallo es silencioso».

### Y dos errores míos durante el arreglo

- **Los tres primeros aciertos de la comprobación eran comentarios** que advertían de este mismo
  defecto. Tercera vez en la sesión que mis comentarios rompen mi comprobación.
- **Escribir el filtro que los excluye fue la novena rotura de escapado** de la sesión: los saltos
  escapados se convirtieron en saltos reales al pasar por una transformación. Se reescribió sin
  transformar nada.

### Lo que esta revisión NO establece

- **Que no queden más construcciones frágiles de otra forma.** Se detecta `new RegExp` sobre una
  cadena con barra simple ante una letra de clase. Una escrita de otro modo no aparecería.
- **Que el normalizador se use.** Existe y tres herramientas lo usan; que el siguiente caso lo use
  no lo garantiza nada — lo mismo que `EP-007` dejó escrito sobre los comandos.
