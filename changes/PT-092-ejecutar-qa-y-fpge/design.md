# PT-092 — Diseño   `PHASE 4`

## El roadmap, y la forma que el verificador impone

`FPGE-R01` se comprueba así:

```js
const items = [...roadmap.matchAll(/^.*\b(R-\d+)\b.*$/gm)].map((m) => [m[1], m[0]]);
for (const [id, linea] of items) {
  if (!RE_EVIDENCIA.test(linea.replace(id, ''))) fail('FPGE-R01', …);
}
```

**Toda línea que nombre un `R-NNN` debe citar evidencia**, incluidas las de prosa y las de los
Top-3. La primera versión citaba `TD-15`, `QA-R01` y `COVERAGE.md` —fuentes reales pero sin
identificador reconocido— y cayeron doce.

Se reescribió para que cada mención lleve su `H-NNN`, `PT-NNN` o `INC-NNN`. **Es más rígido de lo
que parece necesario y es correcto**: una fila que dice «esto es prioritario» sin un identificador
al lado es una opinión con número, que es literalmente lo que el mensaje dice.

## Las cifras, y cuál de ellas es un hecho

```
Priority = (EvidenceWeight x ScoreImpact x Urgency x DomainMultiplier x Confidence) / Effort
```

| Factor | ¿De dónde sale? |
|:---|:---|
| `EvidenceWeight` | **observable**: declarada, medida o incidente |
| `Urgency` | **observable en parte**: `FPGE-R05` da `+1.0` a un incidente abierto sin PT |
| `DomainMultiplier` | **observable**: `1.5` si el hallazgo es `D1` |
| `Confidence` | **observable**: `0.7` si la única evidencia es QA — aquí nunca |
| `ScoreImpact` · `Effort` | **juicio del agente** |

Dos de seis son juicio, y los dos multiplican. Por eso §7 del roadmap existe: **publicar ocho
números con decimal sin decirlo los haría parecer un cálculo.**

`INC-001` lleva `EvidenceWeight 16` —el máximo— porque su evidencia es un **incidente observado**.
Es la única entrada del roadmap cuyo peso no depende de mi juicio.

## `QA`: la forma de declarar un hueco

Va a `CASOS-DE-USO.md` §Huecos declarados, con la misma estructura que los otros seis: **qué no
cubre y por qué**.

Y lleva una frase que la distingue de los demás: *«no aplica, y no es lo mismo que "no probado"»*.
Sin ella, la fila se leería como los otros huecos —cosas que faltan— cuando ésta es una cosa que
**no existe** para este sistema.

## `TD-15`: dos hechos que no debían sumarse

```
antes   «Tres de los seis componentes no se han ejecutado nunca»
ahora   uno PENDIENTE (FIDE) y uno que NO APLICA (QA)
```

Contarlos juntos hacía que el número bajara por dos motivos distintos y que nadie pudiera saber
cuál. **Es la misma distinción que `PT-058` fijó para las cifras** —`null` no es cero— aplicada a
una deuda.
