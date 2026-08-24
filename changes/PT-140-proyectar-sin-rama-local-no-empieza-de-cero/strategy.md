# Estrategia — `PT-140`   `PHASE 3`

## El camino elegido

Cuando falta la rama local, **mirar el remoto** y decidir con lo que se ve:

```
esta en origin      se NIEGA y dice como traerla
no esta en ninguna  la crea, y DICE que es la primera vez
no se pudo mirar    se niega: no saber no es permiso (RULE-06)
```

## Los caminos descartados, con su por qué

**1 · Traer la rama automáticamente.** Descartado. Un `fetch` implícito dentro de un comando que
escribe es exactamente el efecto colateral que este marco evita. Se **describe** el comando
(`EXEC-R07`).

**2 · Crear siempre el linaje nuevo y avisar después.** Descartado: el aviso llegaría cuando el
commit ya existe, y la rama local quedaría divergente del remoto sin que nadie lo pidiera.

**3 · Tratar «no se pudo mirar» como «no existe».** Descartado, y es el error clásico. `null` no
es `false`. Sin acceso al remoto no se sabe si hay historia que descartar.

## Cómo se verifica

Casos sobre un fixture con **su propio remoto** —un `--bare` local—, para no depender de la red:
un arnés que necesita GitHub no es un arnés, y `PT-126` ya lo pagó con la batería colgada tres
minutos.
