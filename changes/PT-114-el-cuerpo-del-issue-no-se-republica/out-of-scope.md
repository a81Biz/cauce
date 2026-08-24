# Fuera de alcance — `PT-114`

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| Republicar desde el espejo | Informar y actuar son cosas distintas. `abrir --aplicar` ya repara; lo que faltaba era que algo lo exigiera | — |
| Un hook de git que republique tras el push | `SUITE-R06` no automatiza actos contra la plataforma, y un hook local se desactiva sin que nadie lo note | — |
| Cambiar la decisión de `PT-096` | Sin ref durable se sigue publicando la ruta sin enlace y diciendo por qué. Es correcta | — |
| Que el enlace **resuelva** | Depende de la plataforma, no del texto. Se comprueba que el cuerpo lo lleve | — |
| Que `verify-fdge` vea esto en CI | Sin credencial no puede. El espejo sí la lleva en los dos workflows | PT-120 |
| Que el cuerpo se republique al cambiar el registro | Otro caso: aquí el disparador es la **ref durable**, no el contenido | — |
