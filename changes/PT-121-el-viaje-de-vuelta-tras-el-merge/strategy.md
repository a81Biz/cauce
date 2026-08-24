# Estrategia — `PT-121`   `PHASE 3`

> `FDGE-R54`: viabilidad **`SAFE`**, registrada.

---

## Por qué un comando y no una instrucción mejor escrita

`PHASE 9` ya lo mandaba. Lo que faltaba no era claridad: era que **algo lo hiciera**. Una
instrucción que se cumple a mano en dos sitios diverge, y divergió — `main` declarando `DRAFT` un
lote con diecisiete tareas en `DONE`.

## Un solo acto, y el orden importa

```
1  el YAML del intake      reversible
2  el registro             y sólo si el primero salió bien
```

Al revés quedaría un registro diciendo `INTEGRATED` sobre un intake que dice otra cosa: **la
divergencia que esto viene a cerrar**. Es el mismo contrato que ya usan `avanzar` (`PT-053`) y
`abrir` (`PT-132`): lo reversible primero, lo irreversible al final.

## `DONE` es la única entrada, y se dice por qué

`FDGE-R34` exige `DONE` para `G4`, y `G4` es lo que acaba de pasar. Un estado distinto significa
que `G4` **no** ha pasado — o que ya se integró. **No se adivina cuál** (`RULE-06`): se falla y se
dice.

Y un `BUG` en `VALIDATION_PENDING` **no** entra: lo cierra una persona (`FDGE-R26`, `SUITE-R06b`).

## `firmar`: la firma se contrasta, y no prueba lo que no puede probar

`SUITE-R27` es explícita: la lista de firmantes **no prueba que firmara una persona** —el agente
escribe el archivo— pero convierte la firma en una **afirmación contrastable**. Un nombre que no
está en la lista falla, y quien aparece en ella responde de lo que lleva su nombre.

## Ninguno de los dos exige plataforma

Escriben el **registro** y el **YAML**, los dos locales. Exigirles credencial repetiría lo que
`PT-133` acaba de arreglar en `parada`: pedir acceso remoto para escribir un archivo del
repositorio, y dejar sin viaje de vuelta al proyecto que no declara tablero — el caso que
`SUITE-R22` declara soportado.

## La rama de un lote: se usa la de tarea, y se declara por qué

`AC-02` admite las dos salidas. Gana **usar la forma de tarea**, con el `type` del propio lote:
abrir un `EP`, publicar sus paradas y cerrarlo ocurren **una vez por lote** sobre la misma rama
efímera, y darles un cuarto nivel añadiría vocabulario para un caso que la forma existente ya
cubre (`LEX-R23`).

**Lo que no se hereda es la unidad del commit.** El asunto sigue pidiendo un `PT`, y si el trabajo
de lote debe poder citar el `EP` es la pregunta que `PT-127` midió —15 commits— y que **no** se
resuelve aquí.

## Lo que NO se hace

- **No se automatiza el merge.** `G4` sigue siendo humana en los tres modos (`EXEC-R04`).
- **No se crean tags históricos.** Fecharlos hoy sería inventar cuándo se selló cada versión.
- **No se cierra el issue en `integrar`.** Eso es `cerrar`, y va **después**: el estado terminal
  tiene que estar ya en la rama por defecto (`SUITE-R46`).
