# PT-001 — Estrategia   `PHASE 3`

## Objetivo

Que `SUITE-R35` deje de depender de que alguien se acuerde: que el espejo se ejecute en las
compuertas, que `FDGE-R52` lea el reanclaje donde `CORE.md` manda escribirlo, y que la
ausencia de credencial sea una precondición visible y no un rojo que se aprende a ignorar.

## La decisión de terreno, resuelta

Criterio humano del 2026-08-13: la credencial tiene que estar **desde antes** (`FND-R30`).
Confirmado el 2026-08-13 el reparto para los dos casos que el proyecto no controla:

> **El espejo bloquea donde la credencial es exigible y se declara ausente donde no puede
> estarlo.**

| Dónde | Sin credencial |
|:---|:---|
| `npm run verify` del repositorio propio | **falla** — es la máquina de quien opera |
| CI, `push` a `main` | **falla** — el token es del repositorio |
| `G4` (`verify-fdge --gate G4`) | **falla** — es la compuerta del merge |
| CI, PR desde un **fork** | `SIN EVALUAR` — GitHub no entrega los secretos a un fork, por diseño |
| `cauce verify` en máquina ajena | `SIN EVALUAR` — quien acaba de instalar aún no ha hecho `gh auth login` |

`SIN EVALUAR` **no aprueba**: dice que nadie miró, y dice cómo mirar (`RULE-06`, `RULE-07`).
Es la misma forma que `PT-004` introdujo para la fase no declarada, aplicada al acceso.

## Solución propuesta

**1 · `tracker` distingue «sin plataforma» de «con plataforma y sin acceso».**

Hoy las dos salen con `2`, y son decisiones opuestas: la primera es una elección legítima del
proyecto, la segunda una precondición incumplida. El código de salida es el contrato que
consumen las compuertas, así que tiene que distinguirlas.

```
0  el espejo cuadra
1  divergencia — hay trabajo vivo sin issue, o issue sin trabajo
2  sin plataforma declarada          → no aplica
3  plataforma declarada, sin acceso  → precondición incumplida (FND-R30)
```

El acceso se comprueba **al arrancar**, antes de leer el registro, que es lo que `FND-R30`
pide: descubrirlo a mitad es perder la sesión.

**2 · Las compuertas lo ejecutan.** `npm run verify`, `verificacion.yml` y `cauce verify`. En
CI, el paso del espejo se salta con `if:` cuando el PR viene de un fork, y ahí se declara.

**3 · `FDGE-R52` lee donde `CORE.md` manda.** Con plataforma declarada, el reanclaje son
comentarios del issue. `verify-fdge` **no habla con GitHub**: se lo pregunta a `tracker`, que
es quien tiene el adaptador. La regla la hace cumplir el verificador; el acceso a la
plataforma lo encapsula la herramienta que ya lo tiene.

```
verify-fdge  --(node tracker.mjs notas PT-NNN)-->  tracker  --(gh)-->  GitHub
```

Sin plataforma, sigue leyendo `bitacora.md` exactamente como hoy. Sin acceso, `SIN EVALUAR`.

**4 · `tracker abrir` prepara el terreno que necesita.** Crea las etiquetas si faltan, o dice
el comando exacto. `abrir` ya escribe y lo declara en su nombre, así que no rompe `RULE-05`.

## Alternativas evaluadas

**A · Que `verify-fdge` hable con `gh` directamente.** **Rechazada:** duplica el adaptador de
plataforma en dos herramientas. `tracker.mjs` declara en su cabecera que el adaptador habla
CLI y por qué; tener un segundo cliente de GitHub en `verify-fdge` es la divergencia que este
repositorio existe para eliminar, y obligaría a implementar Azure dos veces.

**B · Cablear el espejo solo en CI.** **Rechazada:** deja `npm run verify` mintiendo en local
—verde con el espejo roto— y el defecto se descubriría en el push, tarde. Es parte de lo que
hizo invisible este mismo defecto: `npm run verify` tampoco ejecuta `verify-fdge`.

**C · Que la ausencia de credencial siempre falle, sin excepciones.** Es la lectura literal de
«las credenciales necesitan estar desde antes». **Rechazada tras confirmarlo contigo:** en un
PR desde un fork la credencial no puede estar por diseño de GitHub, así que la compuerta
quedaría en rojo permanente para todo colaborador externo — y una compuerta siempre roja
enseña a saltársela, que es el razonamiento de `SECRETOS-EXCEPCIONES.md` en 5.2.2. El criterio
se respeta donde tú operas; donde no puede cumplirse, se declara en vez de mentir.

**D · Copiar el intake al issue para no depender de la plataforma.** **Rechazada:** `SUITE-R35`
lo prohíbe explícitamente.

## Ampliación de alcance respecto al intake   `FDGE-R21`

El intake declaraba cuatro archivos. La solución necesita dos más:

| Archivo | Por qué |
|:---|:---|
| `docs/methodology/tools/tracker.mjs` | los códigos de salida, la acción `notas` y las etiquetas |
| `bin/cauce.mjs` | mapear el código `3` en `cauce verify` |

No es desvío de complejidad: es el mismo trabajo declarado, en los archivos donde vive. Queda
registrado como Revisión 1 del intake y actualizado en `tasks.md`, que es lo que fija el scope
lock (`FDGE-R20`).

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Riesgo | Mitigación |
|:---|:---|:---|
| El código `2` cambia de significado para quien lo consumiera | Bajo | Nadie lo consume: ninguna compuerta ejecuta `tracker` hoy. Es literalmente el defecto |
| `FDGE-R52` deja de comprobarse en proyectos con plataforma y sin acceso | **Medio** | Es el caso `SIN EVALUAR`. Visible, no silencioso. Y en `G4` con credencial exigible, falla |
| `verify-fdge` pasa a depender de un proceso externo | Medio | Solo cuando hay plataforma declarada. Sin ella, cero cambios. Si `tracker` revienta, se declara `SIN EVALUAR`, no se asume verde |
| Proyectos destino sin plataforma | Ninguno | Todas las ramas nuevas están detrás de `tracker.plataforma` declarada |
| Los 188 casos del arnés | Bajo | El fixture no declara plataforma: cae en la rama de hoy. Se añaden casos para las ramas nuevas |
| Tiempo de CI | Bajo | Una llamada a `gh` por PT con issue, solo en `--gate G4` y `--all` |

## Criterios de éxito derivados de los AC

1. Una allocation viva sin issue hace fallar `npm run verify` y el job de CI (`AC-01`, `AC-03`).
2. Un issue abierto que nadie reclama hace fallar igual (`AC-02`).
3. `verify-fdge --gate G4` enumera el espejo entre las precondiciones (`AC-04`).
4. Sin credencial: falla donde es exigible, `SIN EVALUAR` donde no puede estar (`AC-05`).
5. Un proyecto sin `tracker.plataforma` no cambia de comportamiento en nada (`AC-06`).
6. Con plataforma, el reanclaje en el issue satisface `FDGE-R52`; sin ella, sigue exigiendo
   `bitacora.md` (`AC-07`). Esto desbloquea `G4` de `PT-004`.
7. `tracker abrir` no falla por etiquetas inexistentes (`AC-08`).

## Autorrevisión

- ¿Contradice el intake? No; lo amplía en archivos, registrado como Revisión 1.
- ¿Dependencias faltantes? `gh` en CI para el `push` a `main`: hay que confirmar que el
  `GITHUB_TOKEN` por defecto alcanza para `issue list`. Se verifica en `PHASE 5`, no se supone.
- ¿`RULE-nn` en riesgo? `RULE-04` — `gh` se invoca como proceso, igual que `git` hoy. No entra
  ninguna dependencia de `node_modules`.
- ¿Algún AC sin cubrir? Ninguno. `AC-06` de `PT-004`, que quedó `PARCIAL`, lo cierra el `AC-07`
  de aquí.
