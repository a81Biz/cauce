# PT-079 — Diseño   `PHASE 4`

## 1 · `SUITE-R56`, la regla

> `SUITE-R56` · **HARD** · **El rastro de una tarea sobrevive a la rama que lo produjo.** El
> enlace que la plataforma publica apunta a un **ref durable** —la rama de integración si el
> contenido ya está ahí, y si no el **commit** que lo contiene—, nunca a la rama efímera de la
> tarea, que `FDGE-R19` borra al fusionar. Si no hay ninguno de los dos, **se dice**: una URL
> inventada es peor que ninguna (`RULE-06`). Y al integrar se **publica la proyección**
> `cauce/<usuario>`, que registra el SHA de cada tarea: es el agregado que permite reconstruir
> dónde estaba cada cosa cuando las ramas ya no existen. Existe porque la proyección estaba
> diseñada desde `PT-054`, tenía `--publicar`, y **nunca se ejecutó** — y porque el día que se
> midió, **14 de los 16 enlaces del tablero daban 404**.

## 2 · El enlace durable, en `cuerpoDeIssue`

```
antes    ramaDelEnlace = (viva && ramaTrabajo) ? ramaTrabajo : (rama ?? 'main')
         └── la rama en la que corre el ESPEJO, no la de la tarea

despues  1. el directorio existe en la rama de integracion  -> /tree/<integracion>/<dir>
         2. si no, hay un commit que lo contiene            -> /tree/<sha>/<dir>
         3. si no hay ninguno                               -> sin enlace, y se dice
```

El paso 1 va primero porque es **legible**: quien abra el issue ve `trabajo`, no un hexadecimal.
El 2 es la red permanente. El 3 es `RULE-06`, y `PT-036` ya lo dejó escrito.

El SHA se deriva: `git log -1 --format=%H -- changes/PT-NNN-slug`. No se recuerda.

## 3 · Lo que FALLA — `verify-fdge`

```
para cada allocation VIVA con issue:
    rama = extraer del enlace del cuerpo
    si rama existe en el remoto            -> ok
    si no                                  -> fail SUITE-R56 con el numero de issue
```

Hoy 14 de 16 lo dispararían. Es la diferencia entre arreglarlos una vez y que no vuelvan.

## 4 · La proyección registra el SHA del contenido

`ESTADO.md` tiene hoy la columna `SHA` vacía para las tareas sin rama. Pasa a derivarse del
**último commit que tocó su directorio**, que existe desde `PHASE 1`.

Y publicarla entra en `PHASE 9`, citada por `SUITE-R56`. **No se rediseña nada más**: sigue
siendo derivada, la escribe sólo la herramienta y cada commit lleva `cauce:proyeccion`.

## 5 · Las tres guardas del arnés

```bash
# B-1 · ABORTA. Una inversa que no revierte certifica lo contrario de lo que pretende.
inversa() {   # $1 archivo · $2 patron · $3 reemplazo
  grep -qF -- "$2" "$1" || { echo "INVERSA NO APLICA: el patron no casa en $1"; exit 1; }
  ...
}

# B-2 · AVISA. Una asercion anclada SOLO en un identificador, sin marca de veredicto.
#        Hay casos legitimos: se enumeran con su linea, no se prohiben.
patron es ^(PT|EP)-[0-9]+$  y no contiene ✗ ✓ ! ni dos palabras  -> sospechosa

# B-3 · AVISA. Un caso que invoca un helper definido MAS ABAJO.
#        Se manifiesta como «la herramienta revento» y apunta al arreglo, no a la colocacion.
linea_del_caso < linea_de_definicion_del_helper  -> sospechosa
```

**`B-1` aborta y las otras dos avisan**, y la diferencia es deliberada: una inversa que no
revierte **siempre** es un error; una aserción sobre un ID **a veces** es correcta. Convertir las
dos últimas en error pondría rojos casos válidos, y un arnés que nace rojo se apaga.

## 6 · Los cinco sitios

| Sitio | Qué entra |
|:---|:---|
| `RULES.md` | `SUITE-R56` |
| `PHASES.md` `PHASE 9` | la cita y el comando |
| `FDGE-Prompts.md` | lo exigirá `SUITE-R20` — pasó igual con `FDGE-R54` |
| `CASOS-DE-USO.md` | `A5` gana el paso · caso nuevo en `C`: «¿sigo pudiendo rastrear una tarea cerrada?» |
| `MANUAL.md` | el paso en el recorrido de una tarea |

`CORE.md` se **regenera**, no se edita (`SUITE-R16`).

## 7 · Lo que NO cambia

| Pieza | Por qué |
|:---|:---|
| `FDGE-R19` | La rama efímera **debe** morir. Lo que no debe morir es el enlace |
| La proyección como **derivada** | Es lo que la hace fiable: sólo la escribe la herramienta |
| Los ~130 casos de aserción | Se **enumeran**; revisarlos es otra tarea |
| Los issues **cerrados** | Su enlace ya apunta a la rama por defecto |

## Delta respecto a la estrategia

Ninguna. `SUITE-R56` es la regla única que la estrategia anticipó.
