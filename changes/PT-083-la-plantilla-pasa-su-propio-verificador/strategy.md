# PT-083 — Estrategia   `PHASE 3`

## Qué cede: el verificador, no la plantilla

| Opción | Por qué no |
|:---|:---|
| Quitar los comentarios de las plantillas | Son **útiles**: dicen quién rellena cada campo. Empeorar la plantilla para acallar al verificador es fabricar un verde por el otro lado |
| Exigir el campo limpio y documentarlo | Sería una convención que **cinco de seis campos no siguen**. Documentar una incoherencia no la arregla |
| **Que `severity` tolere el comentario, como sus vecinos** | ✅ Un solo carácter de más en el regex, y el YAML pasa a ser coherente consigo mismo |

## Lo que el arreglo no puede abrir

`AC-03` existe para eso: `severity: S9` y `severity:` vacío **siguen fallando**. Relajar el ancla
no puede convertirse en aceptar cualquier cosa — el patrón sigue exigiendo `S1`..`S4`, y lo que se
tolera es sólo un comentario tras el valor.

Comprobado con los cinco casos antes de tocar el arnés.

## `AC-05` es lo que impide la próxima

Arreglar el regex quita el síntoma de hoy. Lo que impide que otra plantilla divergía mañana es un
caso que **rellene cada plantilla del paquete tal como se distribuye y la pase por `verify-fdge`**.

Y se rellena **sólo lo que el humano rellena** —el `id`, la fecha, la firma—, dejando los
comentarios en línea **como vienen**. Rellenarlos «limpios» habría hecho pasar el caso sin probar
nada, que es exactamente el falso verde que este lote persigue.

## Las tres plantillas, no una

`BUG-REPORT`, `FEATURE-REQUEST` y `CHANGE-REQUEST` traen el mismo comentario. Probar sólo la de
`BUG` habría dejado dos fallando con el caso en verde.
