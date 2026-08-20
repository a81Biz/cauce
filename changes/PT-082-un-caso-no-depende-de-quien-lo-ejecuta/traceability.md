# PT-082 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | El caso no depende de la identidad de la máquina | E1 · E4 | `selftest.sh`: «viabilidad nombra la sesion abierta» | `salidas/dos-identidades.txt` | PENDIENTE |
| AC-02 | La otra rama del `if` también tiene caso | E2 · E3 | `selftest.sh`: «otra identidad NO hereda la sesion» · «…y lo dice, no lo calla» | `salidas/dos-identidades.txt` | PENDIENTE |
| AC-03 | El arreglo se comprueba en las dos direcciones | E1 · E2 | reproducción del rojo antes de tocar nada | `salidas/reproduccion.txt` | PENDIENTE |
| AC-04 | `trabajo` rechaza un merge en rojo | E5 | `gh api …/branches/trabajo/protection` | `salidas/proteccion.txt` | PENDIENTE |
| AC-05 | El cambio de configuración queda documentado | E5 | el comando exacto y su verificación | `acciones-humanas.md` | PENDIENTE |
| AC-06 | La batería sigue verde | E6 | `selftest.sh` | `salidas/selftest-completo.txt` | PENDIENTE |

## `AC-03` es la inversa, y aquí se hizo al revés de lo habitual

No hubo que revertir nada para verla caer: **CI ya la tenía caída**. Lo que se hizo fue
reproducir ese rojo en local con una identidad ajena, antes de tocar el arnés. Es la forma más
barata de la inversa, y sólo está disponible cuando el fallo llega de fuera.

## `AC-04` y `AC-05` no son el mismo criterio

`AC-04` es que la protección **exista**. `AC-05` es que **conste** cómo se puso. Una configuración
de GitHub aplicada y no escrita es exactamente lo que el firmante llamó «volando»: mañana nadie
sabe si estaba así desde siempre, quién la cambió ni con qué contrato.
