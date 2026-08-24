# `PT-114` — Autorrevisión   `PHASE 6`

## Lo que esta tarea corrige, y lo que NO

`PT-096` decidió **bien**: sin ref durable no se inventa una URL (`RULE-06`). Esta tarea **no
toca esa decisión**. Lo que cierra es la otra mitad, que `PT-096` dejó escrita y no cerró:

> *«Una vez que un cuerpo está bien, NADA vuelve a mirarlo: la herramienta no comparaba jamás el
> cuerpo que publicó con el derivado.»*

**Séptima instancia de «existe la herramienta y nada la echa en falta».** El propio cuerpo
publicado le pedía a un humano que ejecutara `tracker abrir --aplicar` — un comando que nada
exigía.

## Por qué el espejo y no `verify-fdge`

Medido: `verify-fdge` **no lleva credencial en CI**. La corrida `32600060157` emitió **108 avisos
`SUITE-R43 … SIN EVALUAR` sobre 108 PT** y cerró con «Sin errores». `tracker espejo` sí la lleva,
con `GH_TOKEN` explícito, en los dos workflows.

Y es su territorio: `SUITE-R35` dice que la plataforma **espeja** el registro. Un cuerpo que no
llega a su intake es una divergencia del espejo, no una comprobación nueva.

## Un error mío, cazado antes de ejecutar

Escribí el caso del literal con `patlib` —que carga `patrones.mjs`— llamando a `cuerpoDeIssue`,
que vive en `tracker.mjs`. **Habría fallado por el motivo equivocado**: «la función no existe» en
vez de «el literal divergió». Un caso que falla por el motivo equivocado es peor que uno que
falta — enseña a desconfiar del arnés.

Corregido a `trlib`.

## Y un script que se negó a escribir

Mi script de edición no encontró el texto exacto y **abortó sin tocar nada**. Es el mismo contrato
que `PT-132` acaba de arreglar en `abrir` y que `avanzar` declara desde `PT-053`: **si no se puede
hacer entero, no se hace**. Ha evitado dejar `selftest.sh` a medias tres veces esta sesión.

## Lo que esta tarea **no** establece

- **Que el enlace resuelva.** Depende de la plataforma, no del texto. Se comprueba que el cuerpo
  lo lleve.
- **Que `verify-fdge` vea esto en CI.** Sin credencial no puede. Es `PT-120`.
- **Que el cuerpo se republique al cambiar el registro.** Otro caso: aquí el disparador es la
  **ref durable**, no el contenido.
- **Que alguien ejecute el comando que se le dice.** El espejo bloquea, que es lo más que puede
  hacer una comprobación.
