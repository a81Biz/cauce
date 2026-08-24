# `PT-117` — Autorrevisión   `PHASE 6`

## Qué hace la tarea

`PT-116` construyó `tracker parada` y **lo dejó sin exigir**. `SUITE-R26` llama a eso *«una
recomendación»*. Aquí `FDGE-R55` pasa a fallar mecánicamente en la parte que la propia regla
declara mecanizable: **toda allocation nueva cita la parada que la produjo**.

```
tracker parada … --desenlace abre --abre PT-NNN
    valida TODO  ->  escribe origen_parada en el registro  ->  publica en el issue
verify-fdge
    allocation alcanzada sin origen_parada  =  error
```

## El mecanismo se estrenó solo, sobre un hallazgo real

No hizo falta un caso de prueba para demostrarlo. Escribiendo esta tarea apareció el defecto de
`PT-133`, y el ciclo corrió entero **sin que nadie lo pidiera**:

```
un caso que no buscaba eso tropieza con el defecto
  -> parada publicada POR EL COMANDO en #235
  -> PT-133 asignado
  -> origen_parada: PT-117 escrito en el registro, en el mismo acto
```

Es exactamente lo que el firmante señaló el 2026-08-22: *«si no te lo digo, no lo harías»*. Esta
vez no hizo falta decirlo.

## El agujero que el diseño tenía, y era el peor posible

`checkPT` deriva el alcance de `intake` → `registro` → `'0.0.0'`. Una allocation **recién creada
no tiene intake**, así que caía a `'0.0.0'` y **ninguna regla nueva la alcanzaba**.

La única allocation que el verificador nunca habría podido cazar era **la recién creada**, que es
justo la que hay que cazar. Habría salido **verde por construcción sobre su propio caso de uso**.
Se tapa donde nace: `asignar` escribe `suite_version`.

## Cuatro apariciones de la misma avería en una sola tarea

| Dónde | Qué era |
|:---|:---|
| `PT-133` | la rama del ledger, escrita pero **inalcanzable** |
| mi `perl` sobre el intake del fixture | un caso montado sobre un cambio **que nunca ocurrió** — `perl` no protesta si no casa |
| `err()` en `verify-fdge` | una comprobación que **no puede ni ejecutarse**: `node --check` pasaba |
| el hook `Stop` | iba a invocar `pendiente --parada`, **una bandera que no existe** |

Las cuatro **pasan todas las comprobaciones existentes**, porque las cuatro son verdes por no
ejecutarse. El caso de `err()` es el que más asusta: sin el caso nuevo se habría integrado, `npm
run verify` en verde, y el verificador habría reventado **la primera vez que sirviera para algo**
— en un proyecto destino, meses después.

La cuarta la paré yo, probando el comando antes de escribirlo en la configuración. **No por una
regla**, y eso también hay que decirlo.

## Lo que se declara y no se promete   `SUITE-R26`

`FDGE-R55` es exigible en **2 de 5** desenlaces, y la cifra se **deriva** de la lista:

```
declarados en LEXICON 8.5   5   continua · abre · cambia-fase · detiene · declara
con rastro                  2   abre · cambia-fase
SIN rastro, NO exigibles    3   continua · detiene · declara
```

Los tres sin rastro no dejan nada contra lo que contrastar: **ningún script puede probar la
ausencia de algo que no se escribe**. Para esos el mecanismo es el hook, que vive en
`.claude/settings.json` —configuración de la máquina, no del repositorio instalado— y **un
proyecto destino que instale cauce no lo recibe**.

Que la cifra sea derivada es la lección de `PT-115`, *«atar una aserción a una cifra que crece»*,
que en esta misma sesión volvió a repetirse.

## Lo que esta tarea **no** cierra

- **Cuántas paradas hubo por clase, y si las seis son las correctas**: `PT-119`.
- **Nada caza la clase «escrito pero inalcanzable» en general.** Cuatro instancias hoy y cero
  detectores. Probablemente no se puede en general — y decirlo es más útil que prometerlo.
