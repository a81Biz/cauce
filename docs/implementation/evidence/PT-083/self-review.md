# PT-083 — Autorrevisión   `PHASE 6`
## Qué se arregló

**La plantilla del paquete pasa su propio verificador.**

Quien instala el paquete, copia la plantilla que el paquete trae y la rellena, fallaba FDGE-R04. Es el camino que el MANUAL describe.

## La decisión que lo define

severity era el UNICO de seis campos que anclaba en fin de linea. No es una convencion que la plantilla incumple: es un campo incoherente con sus cinco vecinos, y no hay forma de que quien rellena lo adivine.

## Lo que aprendí escribiéndolo

Se arregla quien LEE. Los comentarios en linea son utiles y quitarlos empeoraria la plantilla para acallar al verificador — fabricar un verde por el otro lado.
