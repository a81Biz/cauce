# Tareas — `PT-121`   `PHASE 5`

| # | Qué | Dónde | Estado |
|:---|:---|:---|:---|
| 1 | `tracker integrar` — `DONE -> INTEGRATED` en registro y YAML, en un acto | `tools/tracker.mjs` | ✔ |
| 2 | `tracker firmar` — el estado que produce `G1`, con la firma contrastada | `tools/tracker.mjs` | ✔ |
| 3 | Los dos entran en `SIN_PLATAFORMA` | `tools/tracker.mjs` | ✔ |
| 4 | `--firmante` y `--compuerta` en `CON_VALOR` | `tools/tracker.mjs` | ✔ |
| 5 | `sellar` comprueba los dos tags, con tres desenlaces para el anterior | `tools/tracker.mjs` | ✔ |
| 6 | `FDGE-R19` declara la rama del trabajo de lote, y por qué | `RULES.md` | ✔ |
| 7 | `PHASES.md` declara el viaje de vuelta, con artefacto y salida | `PHASES.md` | ✔ |
| 8 | …y `FDGE-Prompts.md` lo lleva copiable | `FDGE-Prompts.md` | ✔ |
| 9 | Los veinte casos | `tools/selftest.sh` | ✔ |

---

## Los tres defectos que aparecieron construyéndolo

**1 · Los dos comandos exigían plataforma.** Escriben el registro y el YAML —los dos locales— y
aun así el arnés los cortaba con «el proyecto no declara plataforma». **Es exactamente lo que
`PT-133` acababa de arreglar en `parada`**: pedir credencial para escribir un archivo del
repositorio. Añadidos a `SIN_PLATAFORMA`.

**2 · `--firmante` y `--compuerta` no estaban en `CON_VALOR`.** Sin eso, su valor se toma por la
raíz del proyecto: es `CE-003`, la clase con **siete** instancias declaradas. Entraron al
escribirlas, no después de tropezar.

**3 · Los casos de `sellar` iban contra el repositorio real y salían a la red.** El bloque se
quedó sin terminar dentro del tiempo, y es **exactamente** lo que `PT-126` había enseñado horas
antes. Rehechos sobre un fixture con **sus propios tags** —`v4.13.0`, `v9.0.0`, `v10.0.0`,
`v12.0.0`—, que además es lo único que permite medir el orden: son los cuatro que hacen que el
alfabeto y la versión den respuestas distintas.

## Y una expectativa mía que era falsa

Un caso esperaba que «trabajo DE LOTE» llegara a `CORE.md`. **No llega, y está bien**: el núcleo
condensa cada regla a ~210 caracteres (`SUITE-R15`), así que una declaración al final de una regla
de 5387 no lo alcanza por defecto — el documento completo se abre cuando `CORE` lo remite. El caso
se corrigió para exigir lo que sí tiene que llegar: la **regla**.
