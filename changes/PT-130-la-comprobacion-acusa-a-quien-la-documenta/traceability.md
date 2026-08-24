# Trazabilidad — `PT-130`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | `contradiceElRegistro` ancla su lectura al hecho que evalúa —qué tarea está EN CURSO— y no a cualquier identificador de la línea | `TS-01` `TS-03` `TS-04` `TS-06` | `selftest.sh:el sujeto de «tarea:» es el primer identificador` · `…y mencionarla sin decir su estado, tampoco` · `un sujeto TERMINAL presentado en curso SIGUE fallando` | `salidas/casos-130.txt` · `salidas/inversa.txt` |
| AC-02 | Citar una allocation cerrada **para decir que está cerrada** no produce un error | `TS-02` `TS-05` | `selftest.sh:citar una cerrada para decir que lo esta, no falla` · `…y si la linea LO DECLARA terminal, no falla` | `salidas/casos-130.txt` |
| AC-03 | La comprobación declara qué hecho establece y qué no, en el registro de sujetos de `PT-087` | `TS-07` `TS-08` | `selftest.sh:SUITE-R34 declara que establece` · `…y que NO establece` | `salidas/casos-130.txt` |
| AC-04 | Las otras comprobaciones de alcance «todo el archivo» se **enumeran**, aunque no se arreglen aquí | `TS-09` `TS-10` `TS-11` `TS-12` | `selftest.sh:las lecturas de alcance amplio se enumeran` · `…y dicen SOBRE QUE leen y en que linea` · `…y sin fuentes dice null, no cero` | `salidas/alcance-amplio.txt` |
| AC-05 | Ninguna corrección consiste en **evitar la palabra**: se arregla el alcance de la lectura, no el texto que la dispara | `TS-13` `TS-14` | `selftest.sh:el HANDOFF sigue nombrando identificadores en prosa` · `…y SUITE-R34 no lo acusa por nombrarlos` | `salidas/casos-130.txt` |

**Cinco criterios, cinco con `TS`, cinco con evidencia ejecutada.** Ningún Orphan Criterion.

---

## `AC-03` dice «hoy la cobertura de ese registro es del 3 %» y sigue siéndolo

El criterio pide que `SUJETOS` **cubra** `SUITE-R34`, y lo hace. No pide subir la cobertura
general, y no se sube: el registro crece **por adopción declarada**, que es la vía que `PT-087`
eligió y la misma que `RIGE_DESDE`. Queda en `out-of-scope`.

## `AC-04` enumera **once**, y la cifra es de hoy

Se **deriva** de `tools/*.mjs`, así que no caduca: vuelve a medirse cada vez. La lista con archivo
y línea está en `salidas/alcance-amplio.txt`.

Y la heurística se declara: enumera **formas** —una variable cuyo nombre dice que es un archivo o
un cuerpo entero, sobre la que se pregunta `.includes(` o `.test(`— no intenciones. Una lectura
amplia legítima entra igual, y sacarla exige mirarla.

## Lo que esta trazabilidad **no** establece

- **Que las once sean todas.** Son las que la heurística encuentra hoy. Una lectura amplia escrita
  de otra forma no entra, y eso queda dicho.
- **Que las once sean defectos.** No lo son: es una lista de **candidatas a mirar**.
- **Que `CE-017` esté cerrada.** Tiene **una** instancia cerrada y su alcance declarado. Las otras
  diez que el ledger narra siguen ahí, y la matriz las cuenta.
- **Que el trabajo de lote pueda citar el `EP`.** Es la pregunta que `PT-127` dejó, y **no se
  responde aquí**: es sobre `FDGE-R19`. Queda declarada en `out-of-scope` con su medición hecha.
