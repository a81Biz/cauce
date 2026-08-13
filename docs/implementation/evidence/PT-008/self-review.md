# PT-008 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`SUITE-R43`: si el issue de un PT tiene un comentario del humano posterior a la última nota del
agente, el PT no avanza. Se distingue por **marca de procedencia**, no por autor.

```
selftest  234 → 241 casos, 0 fallos
audit     92/169 reglas con verificador ejecutado por compuerta
```

## Lo que el análisis tumbó, y es lo importante

`AC-03` decía «se distingue por autor». **No se puede**, y se midió antes de decidir nada: el
agente comenta con la credencial de la persona, así que los dos comentarios llevan el mismo
login. Exigir cuentas separadas sería imponer infraestructura que `SUITE-R22` descarta
explícitamente al declarar soportado al equipo de una sola persona.

## Lo que un revisor debería atacar

**1 · La marca es falsificable.** Cualquiera puede pegar `<!-- cauce:agente -->` en un
comentario y la compuerta lo dará por respondido. Está declarado en la regla, en el diseño y
aquí. Es la misma limitación que `SUITE-R27` reconoce en las firmas, y no tiene arreglo sin
cuentas separadas.

**2 · Los comentarios ya escritos no llevan marca.** Los nueve issues de esta sesión salen
`SIN EVALUAR` hasta que el agente escriba una nota marcada. Es deliberado —`RULE-06`— pero
significa que **la regla nace sin morder** en este repositorio, y hay que saberlo.

**3 · Una llamada a `gh` por PT vivo con issue.** Sumada a la de `FDGE-R52`, son dos por PT en
cada `verify-fdge --all`. Con nueve va sobrado; conviene mirarlo antes de que sean cien.

**4 · Comprueba que exista respuesta, no que sea buena.** Es lo declarado, y aun así conviene
repetirlo: esta compuerta no garantiza que el agente haya entendido nada.

## Lo que NO he verificado

- **El ciclo completo contra GitHub**: escribir un comentario sin marca, ver fallar la
  compuerta, responder y verla pasar. Lo cubren los casos sobre la función pura; el ciclo real
  necesita que alguien escriba en un issue y hoy no hay ninguno pendiente.

SELF_REVIEW_COMPLETE
