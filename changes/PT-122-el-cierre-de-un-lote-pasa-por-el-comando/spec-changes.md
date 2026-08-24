# `PT-122` — Cambios de especificación   `PHASE 4`

> `SUITE-R06e`: modificar `docs/methodology/` **no se automatiza**.

---

## Ningún documento normativo cambia su obligación

`SUITE-R43` ya dice lo que hay que decir: la distinción es por **marca de procedencia** y **no por
autor**, porque el agente comenta con la credencial de una persona. `SUITE-R09` ya prohíbe editar
lo escrito.

Lo que faltaba era **el comando** —y, con él, que producir un cierre sin marca deje de ser la única
opción— más **el límite escrito donde protege**.

Es un caso de `P-003` de la Declaración de Valor, no de `P-001`.

## Lo que sí cambia, y no es normativo

| Dónde | Qué |
|:---|:---|
| `tools/tracker.mjs` | `comentarioDeCierreDeLote` — puro, exportado, con la marca por construcción y los tres desenlaces del tag |
| `tools/tracker.mjs` | la acción `cierre`, que deriva y publica; sin `--aplicar` no exige plataforma |
| `tools/tracker.mjs` | el mensaje de `SUITE-R43` declara su límite |
| `tools/patrones.mjs` | `SUJETOS['SUITE-R43']` — qué establece y qué **no** |

## Por qué el límite va en el mensaje y no sólo en `SUJETOS`

`SUITE-R38` lo exige y **lo cazó**: un límite declarado que no aparece en ningún mensaje de las
herramientas *«protege a quien ya está leyendo el código»*. Quien lee el rojo no está leyendo el
código.

## Autoridad

`SUITE-R43` · la distinción es por marca, no por autor.
`SUITE-R09` · lo escrito no se edita.
`SUITE-R38` · un límite declarado vive donde se lee.
`PT-087` · el registro de sujetos es donde una comprobación declara su alcance.
