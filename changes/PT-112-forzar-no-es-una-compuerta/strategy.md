# Estrategia — `PT-112`

## La decisión

**A-1 · Se registra, no se prohíbe.**

| | Por qué no |
|:---|:---|
| **Prohibir `--forzar`** | obligaría a copiar archivos a mano: mismo efecto, **sin ningún rastro** |
| **Pedir confirmación interactiva** | un prompt **no deja constancia** y rompe la instalación no interactiva |
| **Avisar más fuerte** | el aviso ya es exacto; lo que falta no es énfasis, es **registro** |

## La forma, tomada de `EXEC-R04a`

`G4` no se resuelve con un flag: deja **constancia con forma fija**. Aquí lo mismo — quién,
cuándo, qué versión, qué archivos.

## Y si no se puede registrar, no se sobrescribe

`RULE-06`. **Sobrescribir sin poder dejar rastro es exactamente lo que esto impide**, así que el
fallo al registrar no puede degradarse a un aviso.

## Termina cuando

`--forzar` exige un nombre, deja constancia, y sin poder registrarla no sobrescribe.
