# PT-114 — El cuerpo del issue no se republica cuando aparece la ref durable

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-114
type: BUG
epic: EP-020
track: STANDARD
status: READY
phase: 8
created: 2026-08-22
structural: no
suite_version: 12.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «en el issue del EP-020 tenemos changes/EP-020-el-acto-fuera-del-comando/ que no lleva a ningún lado, no puedo leer el intake por lo que no puedo firmar nada»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Un issue cuyo cuerpo publica una ruta SIN enlace se republica en cuanto exista una ref durable que la contenga, sin que nadie tenga que acordarse | abrir un issue antes de empujar la rama, empujarla, y comprobar que el cuerpo pasa a llevar enlace sin invocar nada a mano |
| AC-02 | La comprobación distingue «sin ref durable todavía» de «ref durable existente y cuerpo sin actualizar»: lo primero informa, lo segundo se corrige | un caso por cada uno de los dos estados |
| AC-03 | Ninguna compuerta puede quedar en verde con el intake de un lote ilegible desde su issue | verify-fdge sobre un EP cuyo cuerpo publica ruta sin enlace y con ref durable presente |
| AC-04 | El arreglo NO inventa un ref cuando de verdad no lo hay: PT-096 sigue en pie | la inversa de PT-096 sigue verde |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: el firmante puede abrir el issue de un lote y llegar a su intake sin que nadie haya ejecutado un comando de memoria.

## 4. Qué NO entra   `[AGENTE]`

- OUT: cambiar la decisión de PT-096. Sin ref durable se publica la ruta sin enlace y se dice; eso es correcto y se conserva
- OUT: editar los cuerpos ya publicados de tareas cerradas
- OUT: hacer que abrir --aplicar corra solo en un hook de git: el marco no automatiza actos contra la plataforma sin decisión (SUITE-R06)

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **Séptima instancia de «existe la herramienta y nada la echa en falta».** El propio cuerpo del issue dice «si ya lo está, `tracker abrir --aplicar` lo republica»: la herramienta le pide a un humano que ejecute un comando que nada exige.
- **PT-096 ya declaró el hueco vecino**: «una vez que un cuerpo está bien, NADA vuelve a mirarlo: la herramienta no comparaba jamás el cuerpo que publicó con el derivado». Esta tarea es ese hueco, con la consecuencia medida.
- **La consecuencia es la peor posible y por eso es S1**: bloquea `G1` de todo lote, porque el firmante no puede leer lo que se le pide firmar. Lo encontró el firmante, no un verificador.
- **Lo detectado hoy no se arregla aquí a mano.** Ejecutar `tracker abrir --aplicar` es mantenimiento del espejo (`SUITE-R35`), no el arreglo: el arreglo es que algo lo exija.
