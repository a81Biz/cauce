# Tareas — `PT-130`   `PHASE 5`

| # | Qué | Dónde | Estado |
|:---|:---|:---|:---|
| 1 | `contradiceElRegistro` ancla la línea `tarea:` a su **sujeto** | `tools/patrones.mjs` | ✔ |
| 2 | La guarda que no acusa al texto que **acierta** | `tools/patrones.mjs` | ✔ |
| 3 | `SUJETOS['SUITE-R34']`: qué establece y qué **no** | `tools/patrones.mjs` | ✔ |
| 4 | `lecturasDeAlcanceAmplio`: las once, derivadas | `tools/patrones.mjs` | ✔ |
| 5 | Los catorce casos | `tools/selftest.sh` | ✔ |

---

## Los dos defectos que aparecieron construyéndolo

**1 · El enumerador midió cero, y el cero parecía una medición.** `BS_D` ya contenía el punto y yo
le añadía otro: la expresión buscaba `\..includes` y no casaba nada, en un árbol donde `grep`
encuentra cuatro a simple vista. **Un cero que no se contrasta con nada es indistinguible de un
cero real** — y es la razón por la que la función devuelve `null` cuando no puede mirar.

Es la decimotercera rotura de escapado de la sesión, y la respuesta fue la de `SUITE-R59`.

**2 · La prueba inversa tenía una mutación infiel.** La primera versión de «sin anclar al sujeto»
cambiaba **qué** identificador es el sujeto, no el **alcance** de la lectura — así que tumbaba un
escenario distinto del que decía. Una supresión que no reproduce el defecto que suprime no prueba
nada, aunque salga roja.

Rehecha para restaurar el comportamiento anterior de verdad —el bucle sobre todos los
identificadores de la línea— y con un escenario que **sólo** el anclaje salva: mencionar una
cerrada **sin decir** que lo está.
