# PT-024 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`tracker cerrar` se niega a cerrar el issue de una allocation cuyo estado terminal **no está
todavía en la rama por defecto**, y dice el orden correcto. `SUITE-R46`.

```
selftest    299 → 307 casos
cobertura   95/172 reglas
```

## Lo que hice mal, que es el origen de la tarea

Cerré nueve issues desde `trabajo` después de mergear, y `main` seguía diciendo `DONE`. Su CI
sacó nueve divergencias `SUITE-R35` idénticas.

Y lo importante no es el descuido: **es que el orden que usé no puede funcionar nunca.** El
apunte `DONE → INTEGRATED` se escribe después de integrar, en la rama de trabajo, así que solo
llega a la principal en el merge **siguiente**. Con ese orden la CI de `main` fallaría tras cada
merge de este repositorio y de cualquier proyecto que instale la suite. El defecto estaba en el
procedimiento, y yo lo ejecuté al pie de la letra.

Que lo encontrara el usuario mirando la CI y no yo mirando mi propia salida es el dato incómodo:
di el merge por terminado antes de comprobar la compuerta que corre **después** del merge.

## Por qué la guarda va en `cerrar` y no en el espejo

Relajar `SUITE-R35` para tolerar la ventana habría dejado verde el caso real y habría cegado al
detector: «vivo con el issue cerrado» es exactamente lo que distingue un tablero al día de uno
inventado. La herramienta que provoca el daño es la que lo impide.

## Lo que un revisor debería atacar

**1 · `registroDePrincipal()` lee `origin/<rama>` del clon local.** Si `origin` apunta a otro
sitio que el remoto real, o la rama no está traída, devuelve `null` — y entonces **no se cierra
nada**. Es la decisión conservadora y bloquea trabajo legítimo cuando el clon está incompleto.
Preferí eso a un fallo mudo: aquí un fallo mudo vuelve a romper la integración.

**2 · La rama por defecto sale del adaptador de GitHub.** Sin plataforma declarada, `REPO.rama`
es `null` y no se evalúa. Consistente con `SUITE-R35`, pero significa que la protección solo
existe donde hay plataforma.

**3 · No cubre Azure.** El adaptador existe y no hay proyecto que lo use; escribirlo a ciegas
sería código sin ejecución. Va aplazado a `PT-025` con su issue.

**4 · La guarda no obliga a que el orden se cumpla, solo impide el orden malo.** Nadie comprueba
que `INTEGRATED` se apunte antes de mergear; lo que se comprueba es que no se cierre antes de
tiempo. Es más débil de lo que suena la regla, y lo digo aquí en vez de dejar que se lea como
más fuerte.

## Lo que NO he verificado

Que la CI de `main` quede verde tras el próximo merge siguiendo el orden nuevo. Es lo único que
prueba de verdad la tarea, y solo se puede comprobar mergeando.

SELF_REVIEW_COMPLETE
