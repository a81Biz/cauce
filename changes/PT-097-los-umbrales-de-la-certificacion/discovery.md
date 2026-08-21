# Discovery — `PT-097` · `PHASE 2-B`

> Qué · dónde · cuándo · cómo · por qué, con su evidencia.

---

## QUÉ

Una regla `HARD` exige un entregable cuya definición **no existe**.

```
PTSA-R08   «Emitir una clasificacion de certificacion (A/B/C/F) auditable y defendible
            ante stakeholders.»
PTSA-R54   manda CALCULAR f(Health, Risk, Confidence, health_unstable)
§24.2 §24.4  citadas como el sitio donde estan los umbrales · NO EXISTEN
```

---

## DÓNDE

```
docs/methodology/PTSA/PTSA-V3-Especificacion-Oficial.md

:958    ## 24. Reglas de transicion        <- existe, y es de estado de PRODUCTO
                                              PTSA-R38 y PTSA-R39. Sin subsecciones.
:569    «…impide una clasificacion superior a B (§24.4)»
:744    «Un Health A con Confidence < 90 NO obtiene clasificacion A (§24.2)»
```

Y en el repositorio, la consecuencia:

```
PTSA/RESUMEN.md:16      certificacion: B
PTSA/RESUMEN.md:80      «A requiere Health >= 90»
PTSA/RESUMEN.md:195     «certificacion sigue siendo B (75-89)»
PTSA/score-history.json "certificacion": "B"
CHANGELOG.md:65         «certificación B · Health 79.9»
docs/methodology/tools/verify-ptsa.mjs   cero apariciones de «certificac»
```

---

## CUÁNDO

**Desde siempre, en las dos versiones**, y medido por dos proyectos de forma independiente:

```
4.12.0    proyecto legado · INC-007 · 2026-08-21
11.0.0    este repositorio · misma linea 958, mismas dos citas
```

El legado lo encontró **al emitir** su auditoría; aquí no se encontró **al emitirla**, y esa es la
diferencia que importa: nuestra auditoría rellenó el hueco en vez de declararlo.

---

## CÓMO — el mecanismo

**1 · La especificación define cuatro rebajas y ningún suelo.**

```
PTSA-R30   freshness = UNKNOWN            ->  no por encima de C
§13.4      health_unstable = true         ->  no por encima de B
§15.6      Confidence < 90                ->  no obtiene A
§26        hallazgo CRITICO (12-16)       ->  bloquea >= B
```

Cada uno es correcto por separado. Juntos describen **cómo bajar** una letra que nadie dice cómo
se obtiene: son cuatro techos sin suelo.

**2 · Nada lo comprueba.**

```
$ grep -c "certificac" docs/methodology/tools/verify-ptsa.mjs
0
```

`verify-ptsa` comprueba la matriz de cobertura (`PTSA-R76`…`R79`), los productos (`PTSA-R47`,
`R37`) y el `coverage` publicado. **La letra no.** `PTSA-R08` es la única regla `HARD` de `PTSA`
que exige un entregable y no tiene comprobación mecánica.

**3 · Por eso una letra inventada pasa en verde.**

El agente que auditó necesitaba emitir `A/B/C/F` porque `PTSA-R08` lo obliga. Fue a `§24.2`, no
estaba, y **escribió una banda**: `(75-89)`. No hay ningún punto del proceso donde eso falle.

**4 · Y se propaga.**

`score-history.json` guarda `"certificacion": "B"` como línea base de `PHASE 13`, que es
justamente la fase que compara auditorías sucesivas. La siguiente auditoría heredaría la banda sin
saber que fue inventada.

---

## POR QUÉ · la causa, y la salida que parecía no existir

### Causa raíz

**La especificación se escribió describiendo las excepciones antes que la regla.** Los cuatro
topes están redactados desde el caso que preocupaba —«no quiero certificar como `A` un sistema con
comportamiento errático»— y remiten a una sección base que nunca se escribió.

Evidencia: los dos que citan `§24.x` lo hacen **entre paréntesis, al final de la frase**, como
quien remite a algo que da por hecho. `§24` sí existe y trata de transiciones; el número se reusó.

### Por qué no lo cazó nada

`PTSA-R08` exige un **entregable de texto**, y `verify-ptsa` comprueba estructura y cifras. Un
verificador que mira la matriz de cobertura no tiene por qué mirar una letra… salvo que la letra
sea justamente lo que la regla `HARD` exige.

Es la familia de `PT-075`: *«una regla sin verificador no ocurre»*. Aquí ocurre **mal**, que es
peor: la regla se cumple en apariencia y el hueco queda tapado por el propio cumplimiento.

### La salida: `C` no es una banda, es un techo

Hacen falta cuatro letras y la especificación declara **dos** anclas numéricas:

```
60   §13.3 · la linea de fallo de dominio, «Regla del Agua Potable»
90   §15.6 · la linea de excelencia
```

Dos anclas dan tres tramos. Parecía obligado inventar una cuarta frontera — y ahí es donde estaba
el error de lectura.

**Las dos reglas que nombran la `C` la usan como límite superior, no como rango:**

```
PTSA-R30   «NO PUEDE clasificarse POR ENCIMA DE C»
§26        «bloquea certificacion >= B»                (es decir: techo C)
```

Ninguna dice «`C` es de tanto a tanto». Con eso, la función sale entera de lo escrito:

```
BASE, por Health          A   Health >= 90
                          B   60 <= Health < 90
                          F   Health < 60

TOPES, que solo bajan     freshness UNKNOWN         -> techo C
                          hallazgo CRITICO (12-16)  -> techo C
                          health_unstable           -> techo B
                          Confidence < 90           -> no A
```

**`C` es alcanzable sólo por tope**, y eso es coherente con las únicas dos reglas que la nombran.
**Cero cifras nuevas.**

### Comprobación contra la auditoría publicada

```
Health 79.9 · Confidence 94 · freshness 2026-08-20 (conocida) · health_unstable: true
hallazgos activos, max riesgo(h):  H-003 · Alto(3) x Probable(3) = 9  ->  ALTO, no CRITICO

base       60 <= 79.9 < 90            ->  B
techo      health_unstable            ->  B
           Confidence 94 >= 90        ->  no bloquea A (irrelevante, ya es B)
           sin CRITICO, freshness ok  ->  sin techo C
RESULTADO                                 B
```

**La letra sobrevive.** Lo que no sobrevive es su justificación: la banda `(75-89)` no aparece en
ninguna especificación, y `«A requiere Health >= 90»` se escribió como si constara — consta
**ahora**, no constaba entonces.

Eso hace el arreglo honesto sin ser disruptivo: **no se retira una certificación, se retira una
justificación inventada.** El `CHANGELOG` de la `11.0.0` sigue diciendo la verdad.

---

## Complejidad — `FDGE-R04`

```
Complejidad: STANDARD
```

Dos secciones en la especificación, una función pura en `verify-ptsa` con su batería, la
regeneración de `CORE-PTSA.md`, y una revisión al `RESUMEN` publicado. No cambia pesos, fórmulas
ni reglas: **escribe lo que dos reglas ya citan y no encuentran**.

## Lo que este descubrimiento NO establece

- **Que la función propuesta sea la única posible.** Establece que se **deriva sin añadir cifras**,
  y que la actual —inexistente— no permite cumplir `PTSA-R08`.
- **Qué hacer cuando falta un dato.** Es la única decisión no derivable, y va a `PHASE 3`
  (`context.md` §6).
- **Que `Risk` deba entrar en la letra.** Hoy no aparece en ningún tope y tiene sus propias bandas
  en `§14.5`. Meterlo sería añadir criterio.
- **Que el `Risk 73` publicado siga siendo correcto.** Con `H-001` y `H-006` ya `CLOSED`, los
  hallazgos activos son siete y `Σ riesgo(h) = 37`. Recalcularlo **no es de esta tarea**: `INC-008`
  del legado —el multiplicador `×4` satura con `Σ ≥ 25`— es otro hallazgo y otra tarea.
