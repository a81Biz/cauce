# Escenarios de prueba — `PT-102`

## En la batería

| Caso | Qué establece |
|:---|:---|
| la forma de declarar una versión vive en `PATRONES` | el patrón está donde se contrasta |
| …y reconoce también la segunda forma | las dos, no una |
| …y **NO** casa el marcador de una plantilla | el negativo que impide aceptar cualquier cosa |
| …ni una cifra citada en mitad de una frase | el ancla |
| …y trae sus ejemplos | el contrato de `patrones.mjs` |
| `version.mjs` usa el patrón compartido | una fuente, no dos |
| el `CLAUDE.md` del proyecto entra en el recorrido | lo que quedaba fuera |

## La inversa — seis retiradas, seis con efecto

```
S-1  la segunda forma                caen 2
S-2  el ancla de inicio de linea     caen 1     <- salio en CERO y lo dijo
S-3  los tres numeros exigidos       caen 1
S-4  el prefijo de cita              caen 1
S-5  el CLAUDE.md en el recorrido    caen 1
S-6  el patron compartido            caen 2
```

Los casos se miden sobre **archivos reescritos** en un proyecto de mentira, no sobre el texto de
la herramienta: es lo único que distingue «reconoce el patrón» de «lo alinea».

## Lo que NO se prueba

- Que no exista una tercera forma de declarar la versión.
- Que ningún proyecto destino ajeno use otra.
