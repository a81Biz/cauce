# `PT-197` · `discovery.md`

## 1. La decisión que faltaba, ya tomada   `FND-R24`

El intake declaraba: *«no sabe todavía qué hace válido un Dictamen […] la especificación empieza
por una decisión del firmante»*. Se preguntó con las cuatro lecturas y su coste delante, y la
respuesta fue **«las tres, y el orden importa»** (`SESSION_LOG`, `2026-08-30`).

| | Sección | Criterio de validez |
|---:|:---|:---|
| 1 | Qué se entregó **contra lo prometido** | ¿Queda algún producto declarado **sin veredicto**? |
| 2 | Qué queda **sin cubrir** | ¿Hay algún límite conocido que **no se nombre**? |
| 3 | La **decisión** que eso habilita | ¿Hay una decisión que este documento permita tomar y otro no? |

**El orden es parte del criterio.** Primero lo que hay, después lo que falta, y sólo entonces la
decisión: al revés sería una recomendación buscando datos que la sostengan.

## 2. Lo decisivo: las tres secciones son **derivables hoy**

Por eso el entregable cabe en la tarea y no exige un lote.

| Sección | De dónde sale, y ya existe |
|:---|:---|
| **1** | La Declaración de Valor de `CLAUDE.md`: `P-001`…`P-004`, cada uno con su **«VÁLIDO si:»** |
| **2** | Los bloques `declarado_sin_cubrir` de cada `manifest.json`, la salida de `audit`, `FIRMAS-DE-LOTE.md` y las paradas abiertas |
| **3** | Un juicio — y `AC-03` ya decía que **el firmante dice si sirve**, que es la única evidencia posible de que el componente vale |

**Nada de esto hay que inventarlo.** El marco lleva lotes produciendo exactamente estos tres
materiales y **nunca los ha puesto en el mismo sitio**.

## 3. Lo que `PT-149` ya dejó probado, y es su precondición técnica

Un componente se da de alta **sin tocar herramienta**: declarándolo en `LEXICON` (nombre y
trigger), `RULES` (sus reglas) y `CASOS-DE-USO` (su recorrido). `PT-149` lo demostró, así que esta
tarea **no escribe código de componente**: escribe su declaración y produce **un** entregable.

## 4. Por qué va la última, y qué NO demuestra   `SUITE-R26`

Es la **única `FEATURE`** entre diecisiete tareas. El criterio de éxito de `EP-026` —«nada da verde
sin mirar»— **no la cubre**, y eso ya estaba declarado en el `§8` del intake del lote: **cerrarla no
demuestra nada sobre el objetivo del lote**.

Va última por un motivo que sí es del lote: **construir el Dictamen sobre un marco cuya
verificación todavía miente sería auditar con una regla torcida.** Las dieciséis anteriores
enderezan la regla — y lo hicieron: `PT-203` destapó 62 miembros invisibles, `PT-206` un 71 % de
clases que no se veían, `PT-204` un número que mezclaba dos hechos.

## 5. Lo que este repositorio tiene y que el Dictamen puede decir hoy

```
Declaración de Valor   4 productos, cada uno con su condición de validez, FIRMADA
declarado_sin_cubrir   presente en cada manifest de EP-026
audit                  244 reglas · 142 con compuerta · 123 SIN_JUZGAR
FIRMAS-DE-LOTE.md      26 firmas certificadas con dueño EP-027
paradas abiertas       EP-028 (coste de la verificación) · EP-029 (juzgar las 123)
```

## 6. Lo que NO se hace   `SUITE-R26`

- **No se escribe un generador.** El Dictamen de este lote se produce **leyendo**, y si más
  adelante merece automatizarse será con el dato de haberlo hecho una vez a mano.
- **No se audita nada nuevo**: `PTSA` ya audita contra la Declaración de Valor. El Dictamen la
  **presenta**, no la sustituye.
- **No se promete que el Dictamen sirva**: eso lo dice el firmante, y `AC-03` lo reserva.
