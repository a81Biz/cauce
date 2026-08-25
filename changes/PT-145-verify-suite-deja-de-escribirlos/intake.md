# PT-145 — `verify-suite` y `comparar-marco` dejan de escribir los componentes

> Tarea dentro de la implementación abierta `EP-022` (`FDGE-R51`). Es la **ligera**: la firma, el
> veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-145
type: REFACTOR
epic: EP-022
track: STANDARD
status: DRAFT
phase: 1
created: 2026-08-24
structural: no
suite_version: 13.1.0
origin: DIRECT
---
```

## 1. Qué se quiere   `[HUMANO]`

Siete de los trece sitios están aquí, y son **los dos peores**.

**Los cinco prefijos literales.** La misma alternancia de diez prefijos, escrita cinco veces en
el mismo archivo:

```
verify-suite.mjs:250   /\b(SUITE|LEX|FDGE|INTAKE|QA|PTSA|FPGE|FND|FIDE|EXEC)-(R|P)\d+\b/g
verify-suite.mjs:254   ^\|\s*`((?:SUITE|LEX|FDGE|INTAKE|QA|PTSA|FPGE|FND|FIDE|EXEC)-R\d+)`
verify-suite.mjs:256   ^`((?:SUITE|LEX|FDGE|INTAKE|QA|PTSA|FPGE|FND|FIDE|EXEC)-R\d+)`\s*·
verify-suite.mjs:289   const PFX = '(SUITE|LEX|FDGE|INTAKE|QA|PTSA|FPGE|FND|FIDE|EXEC)'
verify-suite.mjs:403   /\b(SUITE|LEX|FDGE|INTAKE|QA|PTSA|FPGE|FND|FIDE|EXEC)-(R|P)\d+\b/
```

**Un componente con prefijo nuevo sería invisible a las cinco.** Sus reglas no se recogerían, no
se contrastarían, no se detectarían como citadas-y-no-definidas y no se contarían. **Y no daría
error: pasaría en verde.** Ese es el fallo que este repositorio declara peor, y el que dejó a
`QA` en `0/19` y a `FPGE` en `0/10` (`verify-qa.mjs:7`).

**Los dos `Set(['FIDE'])`.** El mismo hecho —qué componente puede no estar instalado— escrito dos
veces, con dos nombres distintos, en dos herramientas:

```
verify-suite.mjs:425    const COMPONENTES_OPCIONALES = new Set(['FIDE'])
comparar-marco.mjs:39   const OPCIONALES             = new Set(['FIDE'])
```

Van en **la misma tarea** a propósito: son el mismo hecho, y partirlos dejaría la mitad derivando
y la mitad escribiendo durante una integración entera.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | No queda **ningún** literal de componente en `verify-suite.mjs` ni en `comparar-marco.mjs` | `grep` de los diez prefijos y de `'FIDE'` sobre ambos: cero |
| AC-02 | Los cinco patrones de prefijo se construyen desde el contrato de `PT-144` | lectura: una sola construcción, cinco usos |
| AC-03 | El patrón se construye con el normalizador de `patrones.mjs`, sin barras invertidas escritas (`SUITE-R59`) | lectura del código |
| AC-04 | **Comportamiento idéntico**: `verify-suite` y `comparar-marco` dan el mismo resultado que antes, sobre el mismo árbol | ejecución antes/después, salida comparada |
| AC-05 | Un componente declarado en el contrato con prefijo nuevo **es visto** por los cinco sitios | caso de prueba con un componente ficticio en el contrato |
| AC-06 | Un componente declarado opcional y ausente sigue sin contar como enlace roto | el caso de `FIDE/` ausente, que es el que `verify-suite:418` documenta |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: `verify-suite` y `comparar-marco` no nombran ningún componente, y un componente
> declarado en el contrato con un prefijo que no existía antes queda **visible** a las cinco
> comprobaciones, con la misma salida que hoy sobre el árbol actual.

## 4. Qué NO entra   `[AGENTE]`

- OUT: cambiar qué comprueba `verify-suite`. Es un `REFACTOR`: cambia de dónde saca la lista, no
  qué hace con ella. Si algo empieza a comprobarse que antes no se comprobaba, deja de ser
  `REFACTOR` y vuelve a `G1`.
- OUT: declarar opcional ningún componente que hoy no lo sea.
- OUT: `build-core.mjs` y `audit.mjs`. Son `PT-146` y `PT-147`.

## 5. Firma

```
Firmado por lote: EP-022
```

---

## Observaciones del agente   `INTAKE-R07`

- **`AC-05` es el criterio que justifica el lote entero.** Los demás comprueban que nada cambió;
  este comprueba que **algo nuevo es posible**. Sin él, la tarea sería higiene.
- **El comentario de `verify-suite:418` ya explica por qué existe `COMPONENTES_OPCIONALES`** y lo
  llama «deliberadamente estrecho»: solo se perdona si falta el **directorio entero**. Ese
  criterio se conserva tal cual; lo que cambia es de dónde sale la lista.
- **Riesgo real de este `REFACTOR`:** cinco patrones que hoy son literales pasan a construirse.
  `SUITE-R59` avisa de que un escape mal construido no falla, **casa de menos** — y casar de
  menos aquí es exactamente pasar en verde. `AC-03` y `AC-04` existen por eso.
