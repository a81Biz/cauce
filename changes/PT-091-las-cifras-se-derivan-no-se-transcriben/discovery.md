# PT-091 — Descubrimiento   `PHASE 2`

## Las cifras, remedidas — y las distancias han **crecido**

`H-007` midió el 2026-08-20 que 8 de 16 estaban mal. Remedido al abrir la tarea, **las mismas
ocho, y peor**:

```
herramienta          H-007    ahora
selftest.sh           4533     4919      documentado: 3541
tracker.mjs           2515     2576      documentado: 2070
verify-fdge.mjs       1859     2057      documentado: 1618
patrones.mjs          1082     1280      documentado:  588      mas del DOBLE
verify-suite.mjs       665      720      documentado:  596
audit.mjs              554      554      documentado:  502
plan-layout.mjs        371      371      documentado:  327
regla.mjs              261      261      documentado:  228
```

**El propio lote las está alejando mientras se escribe.** No es una foto que envejece: es una que
envejece cada vez que alguien trabaja.

## La comprobación se cazó a sí misma

Al escribir `checkInventario` en `verify-fdge.mjs`, el archivo creció — y la primera ejecución de
la comprobación dijo:

```
! FND-R14  1 de 16 cifras de inventory/services.md ya no describen el árbol —
           verify-fdge.mjs 2057→2106.
```

**El arreglo caducó antes de terminar de escribirlo.** Es la demostración más directa de por qué
una cifra a mano no se sostiene, y no hizo falta construir un caso: ocurrió sola.

## Lo que falta y no es una cifra: el **ancla**

`REGISTRY.graph` declara `pt_at_generation` (`FND-R14`), así que se puede saber **de cuándo** es
el grafo. El inventario no tenía equivalente: «al día» y «nadie lo ha vuelto a mirar» eran
indistinguibles.

Sin ancla, ni siquiera se puede decir que las cifras estaban mal **desde cuándo**.

## `H-006` es el mismo defecto, y su arreglo ya caducó una vez

`CLAUDE.md` decía **15 herramientas** y **4 comandos**; son 16 y 7. Se corrigió **a mano** durante
la auditoría — y ése es exactamente el arreglo que vuelve a caducar en cuanto entre una
herramienta.

Cerrar `H-006` sin `H-007` habría sido arreglar el síntoma dos veces.

## Lo que este descubrimiento cambia respecto del intake

| | Intake decía | Medido |
|:---|:---|:---|
| Magnitud | 8 de 16, con las cifras de `H-007` | **Las mismas ocho, y más lejos.** El lote las aleja mientras corre |
| `AC-04` · el ancla | «como `REGISTRY.graph` declara `pt_at_generation`» | Correcto, y es lo que hace la diferencia entre «al día» y «sin mirar» |
| Severidad | error, implícitamente | **Aviso.** Una cifra desviada no apaga ninguna comprobación — al revés que `SUITE-R35` en `PT-089`, donde sí las apagaba |
