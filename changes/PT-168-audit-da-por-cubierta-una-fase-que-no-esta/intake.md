# `PT-168` — `audit` da por cubierta la fase de un componente si el número aparece en cualquier sitio

> Tarea dentro de la implementación abierta `EP-024` (`FDGE-R51`). Es la **ligera** (`INTAKE-R08`).

```yaml
---
id: PT-168
type: BUG
epic: EP-024
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.2.0
origin: DIRECT
---
```

## 1. Qué pasa

En `audit.mjs:240`, la función que decide si una fase está cubierta devuelve **cierto** en cuanto
el documento contiene la cadena «PHASE» seguida del número — **sin mencionar el componente**.

Y `PHASES.md` y `CORE.md` documentan las once fases de FDGE, así que **cualquier fase de cualquier
componente entre 0 y 10 está «cubierta» en los dos, siempre**. La comprobación por sigla, que sí
discrimina, se intenta **después** y casi nunca llega a ejecutarse.

**Medido en `PT-149`**, dando de alta un componente de prueba: `audit` declaró cubiertas las tres
fases de un componente cuyo nombre y cuya sigla aparecen **cero** veces en esos dos documentos.

## 2. Por qué es `S1`

No informa mal sobre un detalle: **informa mal sobre cuánto está verificado**, que es la afirmación
sobre la que se decide si algo puede cerrarse. De las **tres** dimensiones que `audit` exige por
fase, **sólo una discrimina** —el archivo de prompts, porque se lee por su ruta—; las otras dos son
decoración.

Y le hace algo a `PT-147`: aquella tarea midió que **dos de los seis componentes no tenían
auditadas sus fases**, y era cierto. Lo que no se vio es que **los otros cuatro** las tenían
auditadas por un contraste **incapaz de dar rojo**. El hueco era mayor de lo medido.

## 3. Criterios de aceptación

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| `AC-01` | Una fase se da por cubierta sólo **para el componente que se audita** | fixture: componente cuyas fases no aparecen → hueco |
| `AC-02` | Un componente cuyas fases **sí** están documentadas sigue en verde | los seis reales |
| `AC-03` | La cobertura de clase `fase` se **recalcula**, y si baja, **baja y se dice** | la cifra antes y después, publicada |
| `AC-04` | Los huecos que aparezcan se **declaran**; arreglarlos no es parte de esta tarea | lista en la evidencia |
| `AC-05` | `audit` sigue distinguiendo `SIN EVALUAR` de `cubierto` y de `hueco` | los tres estados en la salida |

## 4. Cómo termina   `FDGE-R53`

> Termina cuando: dar de alta un componente cuyas fases no están documentadas produce **huecos**,
> los seis componentes reales siguen en verde o su hueco está declarado, y la cifra de cobertura
> publicada es la que de verdad se comprueba.

## 5. Qué NO entra

- **OUT**: **arreglar** los huecos que aparezcan. Esta tarea corrige el **instrumento**; lo que
  mida es trabajo con su propia decisión. Si son muchos, es una tarea nueva; si son pocos, se
  declaran.
- **OUT**: revisar las otras dimensiones de `audit` —reglas, triggers, artefactos— por el mismo
  patrón. Cabe que lo tengan; **no está medido**, y suponerlo sería el mismo error.

## Firma

```
Firmado por lote: EP-024
```

---

## Observaciones del agente   `INTAKE-R07`

- **Esta tarea probablemente hará bajar una cifra**, y ése es el resultado correcto. `AC-03` está
  escrito para que eso no se negocie: si la cobertura real es menor, se publica la menor. Una
  medición que sólo puede subir no es una medición.

- **`AC-04` es el que la mantiene acotada.** La tentación al ver los huecos será cerrarlos en el
  mismo acto — y entonces esta tarea no termina nunca y su evidencia mezcla dos cosas: qué mide el
  instrumento y qué falta en los documentos.

- **Riesgo declarado**: si los huecos son muchos, `npm run verify` se pone en rojo y **bloquea el
  lote entero** hasta decidir qué hacer. Por eso va al principio de su tanda y no al final:
  descubrirlo tarde sería descubrirlo con nueve tareas ya hechas encima.
