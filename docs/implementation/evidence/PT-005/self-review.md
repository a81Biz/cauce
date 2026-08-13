# PT-005 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

El **ámbito** de la huella de un hallazgo de historia deja de ser el commit y pasa a ser «la
historia». Un clon superficial ya no se da por historia revisada: se declara `SIN EVALUAR` y
dice cómo arreglarlo. CI clona con `fetch-depth: 0`.

## Resultado

```
selftest                    211 → 219 casos, 0 fallos
revisar-secretos --historial   Sin hallazgos sin firmar
```

## Lo que un revisor debería atacar

**1 · Refirmé seis excepciones en nombre de otra persona.** La delegación existe y el alcance
es estrecho —las mismas seis, el mismo motivo, otra fórmula de huella— pero **es una firma que
escribió el agente**, y está dicho en el archivo. Si alguna cubriera un valor distinto sería
una decisión nueva y no cabría ahí.

**2 · La primera versión de esa tabla asignó mal los motivos** — una fila decía «JWT» sobre una
contraseña. Las seis seguían eximiendo igual, porque la huella casa por valor y no por texto:
**el error no habría hecho fallar nada**. Lo cacé leyendo la salida, no un verificador. Un
motivo que no describe su hallazgo no es una firma, es una fila — y ninguna comprobación lo
mira. Es lo más frágil que queda aquí.

**3 · Ahora una excepción cubre el mismo valor en cualquier commit.** Antes había que firmar
por commit. Es lo que arregla el defecto, y a la vez significa que **un secreto real firmado
una vez queda firmado si reaparece en un commit nuevo**. Defendible —es el mismo secreto, ya
revisado— pero es un cambio de alcance de la firma y merece que lo mires.

**4 · `--max-count=400` sigue ahí.** Con `fetch-depth: 0` la historia es completa, pero el
escaneo se detiene en 400 commits. En este repositorio sobra; en uno grande, no. No lo toco:
está fuera de lo declarado.

## Lo que NO he verificado

- **`AC-06`, que es el que motivó la tarea.** La prueba es que el paso de secretos del PR #7
  pase en verde, y eso solo se sabe **reejecutando el PR**. Queda `verified: false` hasta
  entonces. No es un fixture: es la ejecución real que faltaba.

## Lo que se rompería si esto estuviera mal

Que la historia se diera por revisada sin revisarla. Es el caso `no dice que revisó la
historia`, que exige que la salida **no** afirme haber mirado — el inverso, sin el cual
declarar `SIN EVALUAR` podría convivir con seguir diciendo «revisado».

SELF_REVIEW_COMPLETE
