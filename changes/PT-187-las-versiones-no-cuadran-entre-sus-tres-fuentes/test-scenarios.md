# `PT-187` · `test-scenarios.md`

## `TS-01` — la divergencia se enumera, con dirección   → `AC-01`

```
DADO   un repositorio con tags, CHANGELOG y una lista de versiones publicadas
CUANDO corre «tracker versiones»
ENTONCES dice que hay en cada direccion, y no solo «no coinciden»
```

## `TS-02` — sin acceso a npm **se dice**, y no se da por cuadrado   → `AC-02`

```
DADO   que la consulta a npm falla
CUANDO corre «tracker versiones»
ENTONCES el bloque de npm sale SIN EVALUAR
```

**Reproducido en vivo al medir esta tarea.** El `catch` dejó el conjunto vacío y salieron
**veinte divergencias inventadas** con aspecto de hallazgo. El fallo va en **las dos
direcciones** —dar por cuadrado, o inventar— y la segunda es peor porque parece trabajo.

## `TS-03` — …y aun así dice lo que **sí** puede   → `AC-02`

```
DADO   el mismo fallo de red
CUANDO corre
ENTONCES las tres comparaciones que NO necesitan npm se siguen dando
```

**Sin `TS-03`, `TS-02` lo cumple una herramienta que se apague entera.** `SUITE-R22` declara
soportado el proyecto sin red: apagar lo que sí se podía decir es el otro extremo del mismo error.

## `TS-04` — una diferencia legítima **no** se presenta como defecto   → `AC-03`

```
DADO   un tag que existe y no esta publicado
CUANDO corre
ENTONCES aparece en su categoria, y esa categoria dice que puede ser legitimo
```

`SUITE-R06a` reserva publicar al firmante: un tag puede esperar. Presentar las cuatro divergencias
como «errores» a secas convertiría lo legítimo en alarma, y una alarma que suena por lo correcto
enseña a ignorarla.

## `TS-05` — las cifras se **derivan**, no se transcriben   → `AC-01`

```
DADO   que cambian los tags o el CHANGELOG
CUANDO se vuelve a correr
ENTONCES las cifras cambian solas
```

Las del intake venían del `HANDOFF` de una medición anterior y **estaban las tres mal**: `CE-010`.
Una cifra escrita en un documento describe un pasado.

## Lo que NO se cubre, y consta   `SUITE-R26`

- **No se publica, no se etiqueta y no se retrofecha nada** (`SUITE-R06a`, `SUITE-R06g`).
- **No se promete que las cuatro coincidan**: sólo que la diferencia sea visible y contable.
- **Las 28 del `CHANGELOG` sin tag no se juzgan**: son de la historia temprana (`CE-014`).
- **No entra en `npm run verify`**: consultar la red en cada corrida cambia el coste de algo que
  hoy no lo tiene. Dónde se invoca se decide con el dato delante.
