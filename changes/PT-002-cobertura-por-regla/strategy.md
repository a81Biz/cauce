# PT-002 — Estrategia   `PHASE 3`

## Objetivo

Que `audit` publique **cuánta de la letra del marco sostiene una máquina**, con su número y su
denominador, en vez de un adjetivo que se lee como más de lo que mide.

## La decisión de criterio, resuelta

Confirmado el 2026-08-13: **se publican las dos cifras.**

```
citada       el identificador de la regla aparece en el texto de alguna herramienta
ejecutada    además, esa herramienta la ejecuta alguna compuerta
```

La diferencia entre ambas **no es ruido: es información**. Son las 8 reglas cuyas herramientas
se invocan por procedimiento —instalación y migración— y no por una compuerta continua. Ese
número, publicado, es lo que habría hecho visible que `SUITE-R35` llevaba desde la 5.0.0 con
herramienta y sin compuerta.

**Y el número no se convierte en umbral.** `SUITE-R26` dice «aspira» y sigue siendo correcta.
Publicar sí, bloquear no: poner hoy un mínimo sería inventar una cifra con aspecto de norma.

## Qué falla hoy y qué falla después

| | Hoy | Después |
|:---|:---|:---|
| Componente con **cero** reglas verificadas | hueco | hueco — **igual** |
| Cobertura por regla | no se mide | se publica: citadas · ejecutadas · total |
| Reglas sin verificador | invisibles | enumerables bajo demanda |
| Frase final con 63 HARD sin script | «Cobertura completa: sin huecos» | la cifra, y el adjetivo solo sobre lo que sí se comprobó |
| Código de salida | 1 si hay huecos | **igual** — la cobertura informa, no bloquea |

## Cómo se decide qué compuerta ejecuta qué

El conjunto de herramientas «con compuerta» **no se escribe a mano** (`RULE-01`): se deriva
leyendo quién las invoca —`package.json`, `.github/workflows/`, `bin/cauce.mjs`— igual que la
versión se deriva del CHANGELOG. Una lista fija se quedaría atrás el día que se añada un paso,
que es la avería que este repositorio arrastra en cada sitio donde alguien copió un hecho.

Es lo que hace que la cifra siga siendo cierta sin que nadie la mantenga.

## Alternativas evaluadas

**A · Publicar solo la cifra estricta (85).** Más simple. **Rechazada:** oculta que hay
herramientas que sí verifican pero que nadie ejecuta continuamente — exactamente el estado en
que vivió `SUITE-R35` durante tres versiones. Esa brecha es el hallazgo, no el residuo.

**B · Convertir la cobertura en umbral que bloquee.** **Rechazada:** `SUITE-R26` dice «aspira»
y hay reglas que ninguna máquina puede comprobar (`INTAKE-R01`, `FDGE-R17`, `QA-R01`). Un
mínimo elegido hoy sería arbitrario, y el efecto práctico sería empujar a citar identificadores
en comentarios para subir la cifra: la métrica corrompida por su propio umbral.

**C · Contar solo reglas `CHECK`.** `RULES.md` marca `CHECK` como «lo verifica un script».
**Rechazada:** describiría lo que el marco *dice* de sí mismo, no lo que hace. Hay reglas HARD
con verificador y `CHECK` sin él; medir la etiqueta en vez del hecho es el error que este PT
corrige.

**D · Sustituir la comprobación por componente.** **Rechazada:** caza un caso real —un
componente entero sin comprobaciones, como el `QA` 0/19 de la 5.2.0— que la cifra global no
caza. Se conservan las dos.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Riesgo | Mitigación |
|:---|:---|:---|
| CI se pone rojo por la cifra nueva | **Alto si ocurre** | La cobertura **no** añade huecos ni cambia el código de salida. Caso explícito |
| La derivación de «quién ejecuta qué» falla y da 0 | Medio | Si no puede derivarse, se declara no evaluable (`RULE-06`), no se asume 0 ni el total |
| La cifra se lee como un objetivo | Medio | Se publica junto al total y con la frase que dice qué mide. No hay umbral |
| Los 202 casos del arnés | Bajo | Se ejecuta la batería completa |
| Proyectos destino | Bajo | `audit` es informativo salvo por los huecos, que no cambian |

## Criterios de éxito derivados de los AC

1. `audit` imprime `citadas · ejecutadas · total` (`AC-01`).
2. Distingue los tres estados: con compuerta · con verificador sin compuerta · sin verificador
   (`AC-02`).
3. Deja de decir «cobertura completa» cuando la cobertura por regla no lo es (`AC-03`).
4. Las reglas sin verificador se pueden enumerar (`AC-04`).
5. La comprobación por componente sigue fallando igual (`AC-05`).
6. El código de salida no cambia por la cifra.

## Autorrevisión

- ¿Contradice el intake? No.
- ¿Dependencias faltantes? Ninguna: `audit` ya lee `RULES.md` y `tools/`. Añade leer
  `package.json`, los workflows y `bin/cauce.mjs`, que están en el repositorio.
- ¿`RULE-nn` en riesgo? `RULE-01` es la que obliga a derivar el conjunto de compuertas en vez
  de escribirlo. `RULE-06` gobierna el caso de no poder derivarlo.
- ¿Algún AC sin cubrir? Ninguno.
