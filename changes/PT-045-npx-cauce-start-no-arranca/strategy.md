# PT-045 — Estrategia   `PHASE 3`

## Objetivo

Que el arranque documentado funcione, o que **diga qué hacer** — nunca «no se reconoce».

## Caminos evaluados

| Camino | Por qué no |
|:---|:---|
| Publicar la `7.6.0` | Haría desaparecer la causa 2 y es lo obvio. **Está en el out-of-scope del lote por decisión humana explícita** |
| Instalar cauce como dependencia de sí mismo para que `npx` lo resuelva | `SUITE-R41` lo prohíbe: dos copias completas del marco en el mismo repositorio, que solo pueden divergir |
| Cambiar el nombre del paquete o del binario | Rompe todo proyecto instalado y las URLs del manual |
| Quitar `npx` del manual y dejar solo `node bin/…` | Al revés: `npx` es lo correcto para el 99 % de los casos —un proyecto destino— y `node bin/…` solo vale aquí |
| **Que el fallo hable, y que el manual distinga los dos casos** | Es lo que se puede hacer sin publicar y sin romper nada |

## Solución

```
1 · el dispatcher DISTINGUE «no me diste subcomando» de «ese no existe»
    y en el segundo caso NOMBRA el subcomando, dice la version que corre
    y da la salida:  npx @a81biz/cauce@latest <subcomando>
2 · npm start  →  node bin/cauce.mjs start        el arranque QUE FUNCIONA AQUI
3 · MANUAL y CASOS-DE-USO declaran los dos casos: npx en un proyecto destino,
    y `npm start` si estas dentro del repositorio de cauce
```

Es la misma idea que `SUITE-R53` aplicó a las reglas —*el fallo cita lo que hay que consultar*—
llevada al arranque, que es lo primero que alguien ejecuta.

## Por qué no una regla nueva

`SUITE-R50` ya dice lo que hace falta: *«el punto de entrada es el tablero… y no hay forma de
obtener lo segundo sin lo primero»*. Lo que fallaba no era la regla: era que su comando no
arrancaba y no lo decía. **Una regla nueva aquí sería tapar con texto un defecto de ejecución** —
justo lo que `EP-011` corrigió en cuatro sitios.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Comprobación |
|:---|:---|
| `cauce` sin subcomando debe seguir dando ayuda y **código 0** | Caso propio: es una petición de ayuda, no un error |
| Un subcomando desconocido debe seguir dando **código 2** | Caso propio |
| `--help` y `-h` siguen siendo ayuda, no error | Caso propio |
| Los seis subcomandos existentes | `selftest` completo: los ejercitan otros casos |
| `npm start` sobre un repositorio sin registro | `start` ya declara `SIN EVALUAR` cuando no puede consultar (`SUITE-R50`) |

## Criterios de éxito, derivados de los AC

- `AC-01` → el mensaje nombra el subcomando, la versión y el comando de salida
- `AC-02` → `npm start` da el tablero en este repositorio
- `AC-03` → `MANUAL` y `CASOS-DE-USO` declaran los dos casos
- `AC-04` → el orden tablero → núcleo no cambia

## Autorrevisión

Contradicciones: ninguna con `SUITE-R41` —no se instala nada— ni con `SUITE-R50`. `AC` sin
cubrir: ninguno.

**Lo que esta tarea no arregla, y hay que decirlo:** mientras la publicada sea `7.1.0`, `npx
@a81biz/cauce start` **seguirá sin arrancar** desde fuera. Lo que cambia es que dirá por qué y
qué hacer. La causa desaparece al publicar, y publicar no es de este lote.
