# `PT-197` · `test-scenarios.md`

## `TS-01` — el Dictamen existe como componente **declarado**, sin tocar herramienta   → `AC-01`

```
DADO   LEXICON, RULES y CASOS-DE-USO
CUANDO se busca el septimo componente
ENTONCES esta declarado, con su nombre y su trigger, y verify-suite lo acepta
```

`PT-149` ya dejó probado que un componente se da de alta así. Esta tarea **usa** ese mecanismo; no
lo construye.

## `TS-02` — tiene especificación, trigger y sitio en `CASOS-DE-USO`   → `AC-02`

```
DADO   RULES.md
CUANDO se buscan sus reglas
ENTONCES DICT-R01, DICT-R02 y DICT-R03 estan definidas, con severidad y criterio
```

## `TS-03` — el orden de las tres secciones es **parte de la regla**   → `AC-02`

```
DADO   DICT-R03
CUANDO se lee
ENTONCES dice que la decision va DESPUES, y por que
```

**Sin esto, «las tres secciones» se cumple con las tres en cualquier orden** — y la decisión
primero es exactamente el defecto que un entregable ejecutivo comete con más facilidad: una
recomendación buscando datos que la sostengan.

## `TS-04` — produce **un** entregable sobre este repositorio   → `AC-03`

```
DADO   docs/implementation/DICTAMEN.md
CUANDO se lee
ENTONCES tiene las tres secciones, y §1 da veredicto de los CUATRO productos declarados
```

## `TS-05` — y ningún límite conocido queda sin nombrar   → `AC-03`

```
DADO   la §2 del Dictamen
CUANDO se compara con lo que el marco sabe que no garantiza
ENTONCES estan las reglas sin verificador, las firmas certificadas y las paradas abiertas
```

**Es el criterio de `DICT-R02`**, y el que impide que el Dictamen sea propaganda: un documento
ejecutivo que sólo cuenta lo entregado es exactamente lo que nadie debería firmar.

## Lo que NO se cubre, y consta   `SUITE-R26`

- **Que el Dictamen SIRVA.** Lo dice el firmante — `AC-03` lo reserva desde el intake, y es la
  única evidencia posible de que el componente vale.
- **Ningún generador**: se decide con el dato de haberlo hecho a mano.
- **El Dictamen de un proyecto DESTINO**: este repositorio es el único caso disponible y
  `SUITE-R41` lo hace representativo **de la fuente**, no del destino.
- **`PTSA` no cambia**: audita contra la Declaración de Valor; el Dictamen la **presenta**.
