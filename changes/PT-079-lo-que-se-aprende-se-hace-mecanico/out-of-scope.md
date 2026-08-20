# PT-079 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| Dejar de borrar la rama efímera | — |
| Que la proyección deje de ser derivada | — |
| Reescribir los cuerpos de issues **cerrados** | — |
| Prohibir las aserciones sobre identificadores | — |
| Comprobar que un caso se vio en rojo **antes** del arreglo | `TD-16` |
| Revisar los ~130 casos de aserción existentes | `TD-16` |
| El denominador y el numerador de la cobertura | `PT-067` · `PT-078` |

**La primera lleva `—` y es deliberado.** `FDGE-R19` borra la rama efímera a propósito:
conservarlas dejaría el repositorio con una rama por tarea para siempre. Lo que no debe morir es
el **enlace**, no la rama.

**La segunda:** la proyección es fiable **porque** sólo la escribe la herramienta, cada commit
lleva `cauce:proyeccion` y uno sin la marca se reporta. Permitir escribir en ella la convertiría
en la segunda fuente que existe para impedir.

**La tercera:** un issue cerrado ya pasó `G4` (`SUITE-R46`) y su enlace apunta a la rama por
defecto. No están rotos, y tocarlos sería reescribir historia sin motivo.

**La cuarta:** `AC-08` **avisa**, no bloquea. Hay aserciones legítimas sobre identificadores, y
convertirlo en error pondría rojos casos correctos — un arnés que nace rojo se apaga, y entonces
no protege el día que tiene razón.

**La quinta y la sexta van a `TD-16`, y son la parte honesta de esta tarea.** Que un caso se haya
visto en rojo **antes** del arreglo no deja rastro en el repositorio: no hay forma de saber
cuándo se escribió cada aserción respecto a su código. Y revisar 130 aserciones una a una es
trabajo, no una comprobación.

`PT-023` midió que un verificador equivocado tres de cada cuatro veces **se silencia y ocupa el
sitio del que haría falta**. Así que se declara la cifra y se deja medida, como `TD-08` hizo con
las reglas sin verificador — no se finge que `AC-07`, `AC-08` y `AC-09` cubren la disciplina de
`FDGE-R17`, porque no la cubren: cubren tres de sus síntomas.

**La séptima** es la otra mitad del mismo problema de fondo —confundir mencionar con cumplir—
vista desde `audit`. Van en su propia tarea y después de ésta.
