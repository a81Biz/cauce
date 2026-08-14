# PT-028 — Diseño   `PHASE 4` · `FDGE-R21`

`compararEspejo(vivas, issues, todas)` — tercer parámetro **opcional**: sin él cae en `vivas` y
se comporta como antes, así que los casos que ya existían siguen midiendo lo mismo.

La divergencia de cierre pendiente lleva `pendienteDeCierre: true`, y `espejo()` la manda a
`notas` en vez de a `fail`. **La marca viaja en el dato, no en el mensaje**: buscar una frase en
un texto para decidir si algo bloquea es la clase de acoplamiento que se rompe al reescribir una
línea.
