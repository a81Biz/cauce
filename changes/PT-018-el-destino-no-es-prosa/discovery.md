# PT-018 — Discovery   `PHASE 2` · análisis `2-B`

## Los dos agujeros son uno

`PT-013` los declaró por separado:

1. La heurística es una **lista de palabras**: «posterior», «siguiente», «futuro». Se le escapó
   el plural en la primera versión y se le escapará cualquier redacción nueva.
2. **Citar cualquier identificador satisface la regla**: `PT-012` citaba `PT-013`, que no iba a
   hacer ese trabajo, y pasaba.

**Los dos salen de que el destino es prosa libre.** Con prosa, la comprobación tiene que
adivinar si significa «aplazado» y si el sitio al que apunta sirve. Ninguna de las dos cosas es
adivinable, así que las dos se hacen mal.

## Lo que el marco ya sabe de esto

Es exactamente lo que `PTSA-R77` resuelve para las auditorías: «toda celda lleva `PASS` ·
`FAIL` · `NO_APLICA` · `NO_EVALUADA`. **No existe la celda en blanco**: es indistinguible de
una que nadie miró». Vocabulario cerrado, sin prosa, sin heurística.

El marco se lo exige a PTSA y no se lo exige a sus propios out-of-scope.

## Conclusión

No hay que mejorar el detector: hay que quitarlo. El destino pasa a ser vocabulario cerrado
—`—` o una cita— y la cita, recíproca. Sin prosa no hay nada que adivinar.

Confianzas: RootCause 100 % · Architecture 95 % · Solution 90 %.
