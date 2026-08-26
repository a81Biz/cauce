# PT-148 · `scope.md` — `PHASE 2` Analysis (`2-R`)

## 1. Qué cambia

Tras `PT-144`..`PT-147` el mecanismo **existe y está probado por cuatro consumidores**. Lo que no
existe es la forma de usarlo sin leer el código.

```
LEXICON          el contrato de componente como VOCABULARIO: sus campos y que significa cada uno
RULES.md         la regla que obliga: un componente se declara, y ninguna herramienta lo nombra
CASOS-DE-USO.md  dos filas en «E · Publicar y mantener»: dar de alta y dar de baja
CORE.md          regenerado, no editado (SUITE-R16)
```

## 2. El hueco es doble, y sólo la mitad es de esta tarea

**Hoy no hay procedimiento escrito** para dar de alta o de baja un componente: se buscó en toda la
metodología y no hay una sola coincidencia. Los seis entraron cada uno a su manera.

Pero además `CASOS-DE-USO.md` declara su propio contrato de cobertura:

> *«Un caso que no esté aquí es un **hueco declarado**, no un silencio.»*

Y este caso **no está ni en los casos ni en `## Huecos declarados`**. Es un silencio contra el
propio contrato del catálogo — igual que el que `EP-023` encontró para `DICTAMEN`.

**La mitad que sí es de esta tarea**: escribir las dos filas y la regla. La otra mitad —que el
catálogo pueda **detectar** un caso no declarado— no lo es, y se declara.

## 3. Qué NO debe cambiar

```
No cambia — el contrato. PT-144..PT-147 lo dejaron; aqui se DESCRIBE, no se toca.
No cambia — ninguna regla existente. La nueva se anade; ninguna se relaja (SUITE-R00).
No cambia — CORE.md a mano. Se regenera (SUITE-R16), y build-core --check lo mide.
No cambia — LEXICON 3 ni LEX-R15. Sus huecos son PT-156 y PT-158, no esta tarea.
```

## 4. Barra de calidad

| Métrica | Actual | Objetivo | Cómo |
|:---|:---|:---|:---|
| Filas de alta/baja en `CASOS-DE-USO` | **0** | **2**, con Entrada · Recorrido · Fin · Humano | lectura contra el formato |
| Regla que obligue a declarar el componente | **0** | **1**, con ID, severidad y propietario único | `regla.mjs <ID>` la resuelve |
| Campos del contrato descritos en `LEXICON` | **0** | **los ocho de `COMPONENTES` + los cuatro de `FAMILIAS`** | `verify-suite` sin vocabulario derogado |
| `CORE.md` | — | regenerado y sincronizado | `build-core --check` |

## 5. La regla nueva: qué puede prometer

`RULES.md` es explícito sobre la diferencia entre `HARD` y `CHECK`:

> *«Marcar `CHECK` una regla que ningún script verifica es una promesa falsa: si quieres exigirla,
> escribe el chequeo.»*

**El chequeo ya existe en tres sitios** y se escribió en `PT-144`..`PT-147`: `verify-patrones`
comprueba el contrato, y `verify-suite`, `build-core` y `audit` lo consumen sin literales. Lo que
la regla nueva añade es **el enunciado que hoy no está escrito en ningún sitio** — y por tanto
puede nacer `CHECK`, no `HARD`.

**Y hay una comprobación que falta y que la regla necesita**: que **ninguna herramienta nombre un
componente literalmente**. Hoy es cierto porque `PT-145`..`PT-147` lo dejaron así, pero **nada lo
impide mañana**. Sin eso, la regla sería `HARD` con un chequeo parcial.

## 6. Riesgo de regresión

```
RC-01  CORE.md y CORE-PTSA.md IDENTICOS salvo por la regla nueva y el vocabulario nuevo.
       Test: build-core --check tras regenerar · el diff se lee, no se supone.

RC-02  Ninguna regla existente cambia de enunciado ni de severidad.
       Test: verify-suite, que rechaza definiciones duplicadas (SUITE-R14).

RC-03  El vocabulario nuevo de LEXICON no colisiona con nada.
       Test: verify-suite · vocabulario derogado y nombres duplicados.

RC-04  La regla nueva PUEDE FALLAR.
       Test: NUEVO — un literal de componente en una herramienta la hace fallar.
       Sin esto es CHECK sobre una promesa.
```

## 7. Out of scope

```
OUT: que CASOS-DE-USO detecte un caso no declarado. Es la otra mitad del hueco y merece
     tarea propia: hoy su «contrato de cobertura» lo cumple quien escribe, no una
     comprobacion. Se declara y se abre.
OUT: LEXICON 3 sin FPGE (PT-156) y LEX-R15 sin FIDE (PT-158). Son de EP-024.
OUT: reescribir como se instala o se retira FIDE. FIDE-R01 ya lo declara; esta tarea
     describe el ALTA EN EL MARCO, no como se disena un componente.
OUT: escribir el procedimiento de como se DISENA un componente —sus fases, sus prompts,
     su especificacion—. Eso es contenido de metodologia, no del contrato.
```

## 8. Complejidad

```
Complejidad: STANDARD
```

Toca tres documentos normativos y añade una regla. `FDGE-R54` dio **`SAFE`** —el primero del
lote—: ya hay `CHORE` cerrados con los que comparar.
