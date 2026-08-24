# Autorrevisión — `PT-121`   `PHASE 6`

> `FDGE-R23`: la evidencia existe en disco o no existe.

---

## Qué se construyó

El viaje de vuelta, que hasta ahora no tenía comando:

- **`tracker integrar`** — `DONE -> INTEGRATED` en el registro **y** en el YAML del intake, en un
  solo acto y con lo reversible primero.
- **`tracker firmar`** — el estado que produce `G1`, con la firma contrastada (`SUITE-R27`).
- **`FDGE-R19`** declara la rama del trabajo de lote, y por qué.
- **`PHASES.md`** y **`FDGE-Prompts.md`** declaran dónde ocurre, con artefacto y salida.
- **`sellar`** comprueba los dos tags en vez de suponerlos.

## El hueco, medido

`PHASE 9` mandaba «tras el merge: PT→INTEGRATED · intake.md CLOSED» y **ningún comando lo hacía**.
Se escribía a mano en dos sitios y divergían: cerrando `EP-019`, el estado terminal se quedó en la
rama de tarea y `main` declaró el lote `DRAFT` con sus **diecisiete** tareas en `DONE` durante todo
el ciclo de publicación.

`CE-006` por la única razón que lo hace inevitable: **no había comando**.

## Los tres defectos que aparecieron construyéndolo

**1 · Los dos comandos exigían plataforma.** Escriben el registro y el YAML —locales— y el arnés
los cortaba. **Es exactamente lo que `PT-133` acababa de arreglar en `parada`**: pedir credencial
para escribir un archivo del repositorio.

**2 · `--firmante` y `--compuerta` no estaban en `CON_VALOR`.** Su valor se habría tomado por la
raíz del proyecto: `CE-003`, la clase con **siete** instancias. Entraron al escribirlas.

**3 · Los casos de `sellar` iban contra el repositorio real y salían a la red.** El bloque no
terminó dentro del tiempo. **Es lo que `PT-126` había enseñado horas antes**, repetido. Rehechos
sobre un fixture con sus propios tags — que además es lo único que permite controlar **qué** tags
hay, que es justo lo que se mide.

## Y una expectativa mía que era falsa

Un caso esperaba que «trabajo DE LOTE» llegara a `CORE.md`. **No llega, y está bien**: el núcleo
condensa cada regla a ~210 caracteres (`SUITE-R15`), así que una declaración al final de una regla
de 5387 no lo alcanza — el documento completo se abre cuando `CORE` lo remite. El caso exige ahora
lo que sí tiene que llegar.

## `AC-04` está retirado y no se cuenta como cumplido

Lo retiró el propio intake: `git tag -l | tail -5` ordena **lexicográficamente**, y el final de esa
lista da `v9.0.0`. La evidencia muestra las dos ordenaciones una al lado de la otra.

## Lo que esta tarea NO establece

- **Que `integrar` haya corrido sobre una integración real.** Se ejerce sobre un proyecto de
  mentira; la integración real de este lote es `G4`, humana, y no ha ocurrido.
- **Que la lista de firmantes pruebe que firmó una persona.** `SUITE-R27` lo dice: hace la firma
  **contrastable**, no verificada.
- **Que el trabajo de lote pueda citar el `EP` en un commit.** Es la unidad del **commit**, no la
  rama. Queda declarada con su medición hecha.
- **Que existan los tags anteriores a la `8.2.0`.** No existen y se declaran ausentes.

## Estado

| | |
|:---|:---|
| Escenarios | 20 de 20 |
| Prueba inversa | 4 supresiones, 4 escenarios distintos |
| Orphan Criterion | ninguno; `AC-04` retirado en el intake |
| `verify-fdge` | sin errores |
