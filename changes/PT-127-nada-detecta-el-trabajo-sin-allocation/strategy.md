# Estrategia — `PT-127`   `PHASE 3`

> Las opciones que se consideraron, y por qué gana la que gana. `FDGE-R54` exige que la
> viabilidad quede registrada antes de proponer.

---

## La decisión de fondo: **detectar**, no **impedir**

El intake lo dejó fuera de alcance y conviene decir por qué, porque es la opción que primero se
le ocurre a cualquiera:

| Opción | Qué haría | Por qué NO |
|:---|:---|:---|
| **A · hook de git local** | rechazar el commit que no cite un `PT` vivo | Un hook local **se desactiva con una bandera** y no viaja en el paquete. Sería una compuerta que cualquiera abre, y `EXEC-R03` no admite compuertas decorativas |
| **B · comprobación en CI que falla** | romper el build en el commit malo | La historia **ya está escrita** cuando CI la ve. Fallar ahí bloquea el trabajo posterior por algo irreparable: `SUITE-R06f` prohíbe reescribir la historia, así que el rojo no tendría salida |
| **C · comprobación en `verify-fdge` que AVISA** | nombrar los commits, agrupados, con su clase y su motivo | Es lo único que **puede resolverse**: el aviso se responde declarando la excepción o abriendo la allocation que faltaba. Y es donde ya viven las otras tres comprobaciones de `FDGE-R19` |

**Gana C.** Con una precisión que no es cosmética: avisa **ahora** y `AVISA_AHORA_FALLA_EN` la
tiene mapeada a `G4`, así que no es un aviso perpetuo — es un aviso con fecha de caducidad
mecánica.

## La segunda decisión: qué es «trabajo»

No todo commit necesita allocation. Exigírsela a todos convierte la comprobación en ruido, y una
comprobación ruidosa se ignora, que es peor que no tenerla.

**Trabajo = tocar una ruta que el marco gobierna**: `docs/methodology/`,
`docs/implementation/`, `changes/`, `bin/`. Un commit que sólo toca `README.md` o
`package-lock.json` no lo es. Eso hace que el **negativo** sea comprobable — `AC-02` y `TS-02`—,
y sin negativo una comprobación que marcase todo también pasaría los demás casos.

## La tercera: un merge no es trabajo

Un merge es **integración**, y su asunto lo escribe git (`Merge pull request #215 from …`).
Marcarlo sería un falso positivo estructural, dos por cada lote.

La primera versión lo resolvió metiendo `merge` en la lista de tipos de commit. **Eso era
legislar desde una herramienta lo que `FDGE-R19` no dice**: la regla enumera seis tipos, y
`merge` no es uno. Se corrigió reconociéndolo por su **forma** —más de un padre, dato que da
git—, que no inventa vocabulario.

## La cuarta: `ELEGIDO` no se infiere

`AC-04` pide separar el rodeo elegido del forzado. La tentación es inferirlo: mirar si la
herramienta de la época podía cumplirlo, deducir la intención del mensaje. **Un motivo plausible
y falso es exactamente lo que `RULE-06` prohíbe**, y aquí repartiría culpa.

Se **declara**: si `SESSION_LOG.md` registra una excepción que nombra el identificador **y la
regla que exceptúa**, dentro de **una misma entrada**, es `FORZADO`. Si no, es `ELEGIDO`. El
observable es la co-ocurrencia dentro de una entrada, no la intención — y eso se dice en el
diseño, no se disimula.

## Viabilidad   `FDGE-R54`

| | |
|:---|:---|
| **Datos** | `git log` los da todos en una llamada; `REGISTRY.json` ya se lee en `verify-fdge` |
| **Dependencias** | ninguna nueva. `patrones.mjs` ya es el sitio de los patrones críticos (`SUITE-R38`) |
| **Riesgo** | falsos positivos sobre historia antigua ⇒ lo acota `RIGE_DESDE` (`SUITE-R09`) y una ventana de 60 commits |
| **Reversible** | sí: es una comprobación que avisa, no bloquea nada hoy |
| **Veredicto** | **VIABLE** |
