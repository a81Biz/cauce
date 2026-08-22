# Estrategia — `PT-108`

## La decisión

**A-1 · Se lee y se escribe SOLO ese campo, sobre el texto.**

### Alternativas descartadas

| | Por qué no |
|:---|:---|
| **Reserializar el `JSON`** | `JSON.stringify` reordena claves y cambia el sangrado: un diff enorme sobre el archivo que guarda el estado |
| **Buscar `version` en cualquier `JSON`** | casaría con dependencias y con datos ajenos |
| **Que `tracker` lo alinee** | el sello lo dispara `version.mjs`; repartirlo en dos comandos añade un orden que recordar |

## El límite, declarado

**Esta escritura NO pasa por el cerrojo que `PT-107` introdujo**, porque vive en otra herramienta
que no lo exporta. Es una operación del **sello**, que no concurre con trabajo de tareas — pero
decirlo es la diferencia entre un límite conocido y uno que alguien descubrirá.

## Termina cuando

`version.mjs` ve las tres formas, alinea el registro y no toca ningún otro campo.
