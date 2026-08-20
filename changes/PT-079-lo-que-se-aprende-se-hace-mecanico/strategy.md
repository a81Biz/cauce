# PT-079 — Estrategia   `PHASE 3`

## Familia A · el enlace durable

| # | Opción | Por qué no / por qué sí |
|:--|:---|:---|
| A1 | Dejar de borrar la rama efímera | **No.** `FDGE-R19` la borra a propósito. Conservarlas deja el repositorio con una rama por tarea para siempre |
| A2 | Enlazar siempre a la rama por defecto | **No.** El contenido no está en `main` hasta `G4`, así que rompería el enlace **durante** el trabajo, que es cuando más se consulta |
| A3 | Enlazar al **commit** que contiene el directorio | **Sí.** Un SHA no se borra, y es exacto |
| A4 | Enlazar a la rama de **integración** cuando el contenido ya está ahí | **Sí, y va antes.** Es legible, permanente, y es donde vive el trabajo integrado |

**Elegidas: A4 con A3 de respaldo.** El orden importa:

```
1. ¿el directorio existe en la rama de integracion?  -> enlazar ahi   (legible y permanente)
2. si no                                             -> enlazar al COMMIT que lo contiene
3. si no hay ni commit                               -> decirlo, no inventar una URL
```

El paso 3 es `RULE-06`: una URL inventada es peor que ninguna, y `PT-036` ya lo dejó escrito
—«no se pudo derivar la URL, así que la ruta va sin enlace: inventar una sería peor»—.

## A.2 · La proyección se publica

**No se rediseña.** `proyectar --publicar` existe y funciona; lo que falta es que algo lo exija.
Dos cambios pequeños:

- `proyectar` registra el **SHA del contenido** de cada tarea, no sólo el de su rama viva. Hoy la
  columna está vacía justo para las que aún no tienen rama, que son las que más lo necesitarán
  cuando la tengan y la pierdan.
- Publicarla entra en `PHASE 9`, citada por la regla nueva.

**Sigue siendo derivada.** La escribe sólo la herramienta, cada commit lleva `cauce:proyeccion`, y
uno sin la marca se reporta. Eso no se toca: es lo que la mantiene fiable.

## Familia B · las guardas

| # | Opción | Por qué |
|:--|:---|:---|
| B1 | Un documento con las buenas prácticas | **No.** Es lo que ya falló diez veces. «Tener más cuidado» no es una guarda |
| B2 | Prohibir las aserciones sobre identificadores | **No.** Hay casos legítimos y rompería ~130 existentes |
| B3 | Helpers que **aborten** y avisos que **enumeren** | **Sí.** Lo que puede fallar, falla; lo que sólo se puede sospechar, se lista |

**Elegida: B3**, con la frontera declarada:

```
ABORTA   una inversa cuyo patron no casa            <- no puede dar verde en falso
AVISA    una asercion anclada solo en un ID         <- hay casos legitimos
AVISA    un caso que usa un helper definido despues <- se mide por numero de linea
DECLARA  lo que no es observable                    <- TD-16
```

**Por qué `AVISA` y no `FALLA` en los dos del medio:** convertirlos en error hoy pondría rojos
casos correctos, y un arnés que nace rojo se apaga. Se enumeran con su línea y la cifra queda
medida; reducirla es otra tarea, igual que `TD-08` hizo con las reglas sin verificador.

## Familia C · los cinco sitios

No hay opciones que valorar: `LEX-R22` dice que las obligaciones viven en `RULES.md` y los demás
documentos las **citan**. Lo que hay que decidir es **qué regla**, y es una sola:

> El rastro de una tarea sobrevive a la rama que lo produjo.

De ahí cuelgan las tres familias: el enlace durable la cumple, la proyección publicada la
respalda, y las guardas impiden que el arnés certifique que se cumple cuando no.

**Y entra en el arranque de operación**, que es lo que el firmante pidió: `A5` de
`CASOS-DE-USO.md` —«empiezo una sesión en un proyecto ya instalado»— es donde alguien descubre
que hay proyección pendiente de publicar.

## El riesgo

**Que el enlace nuevo rompa los issues que hoy funcionan.** Dos de los dieciséis apuntan bien.

Se contiene con un caso que comprueba las **tres ramas** de la decisión —integración, commit, sin
enlace— y con la inversa: revertido el arreglo, vuelven los 404.

## Alcance

```
docs/methodology/RULES.md                   la regla nueva
docs/methodology/PHASES.md                  la cita en PHASE 9
docs/methodology/FDGE-Prompts.md            SUITE-R20 lo exigira
docs/methodology/CORE.md                    REGENERADO
docs/methodology/CASOS-DE-USO.md            A5 y un caso nuevo en C
docs/methodology/MANUAL.md                  el paso
docs/methodology/tools/tracker.mjs          el enlace durable · el SHA en proyectar
docs/methodology/tools/verify-fdge.mjs      lo que FALLA
docs/methodology/tools/selftest.sh          las guardas y los casos
docs/enterprise-documentation/10-Technical-Debt.md   TD-16
```

Regla nueva ⇒ **`MINOR`**. La versión la fija `EP-017`.
