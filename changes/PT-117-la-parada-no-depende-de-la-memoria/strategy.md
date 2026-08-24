# `PT-117` — Estrategia   `PHASE 3`

> Tarea de `EP-020` (`FDGE-R51`). Viabilidad `SAFE`, registrada (`FDGE-R54`).

## 1. Objetivo

Que **abrir trabajo nuevo sin haber publicado la parada que lo motivó falle mecánicamente**.

`PT-116` construyó `tracker parada`. Un comando que existe y nadie invoca no cambia nada — y las
ocho tareas cerradas de este lote lo demuestran: **la herramienta existía en las ocho**. Eso es
justo lo que `SUITE-R26` llama «una recomendación», y esta tarea la convierte en regla exigible
en la parte que **sí deja rastro**.

## 2. Lo que la regla ya declara, y no hay que decidir

`FDGE-R55` se escribió con su propio límite dentro:

> **Lo que esta regla NO promete** (`SUITE-R26`): una parada cuyo desenlace es `continua` **no la
> puede exigir ningún script desde el repositorio** — no deja rastro contra el que contrastar.
> Lo mecanizable es el desenlace que sí lo deja: **toda allocation nueva cita la parada que la
> produjo.**

La estrategia no elige el alcance: lo **hereda**. Se implementa exactamente esa frase.

## 3. Solución propuesta

**El enlace se escribe en el registro, en el mismo acto que publica la parada.**

```
tracker parada PT-116 --motivo hallazgo --texto x.md --desenlace abre --abre PT-133
    · publica la nota en el issue (o TRANSICIONES.log)
    · y escribe en la allocation PT-133:
          origen_parada: { de: 'PT-116', motivo: 'hallazgo', fecha: '2026-08-23' }
```

Y `verify-fdge` contrasta **el registro**, no la plataforma.

### Por qué el registro y no los comentarios del issue

Un verificador que necesitara red para decidir si una tarea cumple **no podría correr en un
repositorio sin plataforma**, y `SUITE-R22` declara ese caso soportado. Además `SUITE-R08` ya dice
que el registro es quien asigna: el enlace entre una allocation y su origen es un hecho del
registro, no del tablero. El tablero **espeja** (`SUITE-R35`).

### El agujero que este diseño tenía, y cómo se tapa

`checkPT` deriva el alcance de una regla así:

```js
const suiteDelPT = intake.match(RE_SUITE_YAML)?.[1] ?? enRegistroPT?.suite_version ?? '0.0.0';
```

Una allocation **recién creada no tiene intake todavía**. El patrón no casa, cae al campo del
registro — que **`asignar` no escribe** — y termina en `'0.0.0'`: la regla no la alcanza, y se
cuela **exactamente la que había que cazar**. El verificador sería verde por construcción sobre
su propio caso de uso.

Se tapa en el mismo sitio del que nace el defecto: **`asignar` escribe `suite_version`** en la
allocation, tomada de la versión vigente. Apaga además el aviso `SUITE-R18` para todo lo nuevo.

## 4. Alternativas evaluadas   `FDGE-R11`

| Alternativa | Por qué no |
|:---|:---|
| **Leer los comentarios del issue en `verify-fdge`** | Exige red y plataforma. Rompe el proyecto sin tablero, que `SUITE-R22` declara soportado, y hace la compuerta dependiente de un servicio externo. |
| **Un hook `Stop` como mecanismo principal** | Vive en `.claude/settings.json`, fuera del paquete: un proyecto destino que instale cauce **no lo recibe**. Sirve de segunda red (`AC-03`), no de compuerta. |
| **Exigirlo en `G1` en vez de en la creación** | Entre asignar y `G1` puede pasar toda una sesión. La pregunta «¿qué parada abrió esto?» solo tiene respuesta fiable **en el momento**; a las dos horas se reconstruye de memoria, que es el defecto original. |
| **Un campo libre `origen: "texto"`** | Prosa. `PT-119` no podría contar nada, y es la misma razón por la que las dos listas de `LEXICON` §8.5 son cerradas. |

**Rechazada y dicha**: exigir la parada de desenlace `continua`. No deja rastro; nada puede
probar que *no* hubo una que debió escribirse. Se declara como hueco medido (`SUITE-R26`), no se
finge cubierto.

## 5. Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Riesgo | Contención |
|:---|:---|:---|
| **Las 20 allocations de `EP-020`** | Declaran `suite_version: 12.0.0` en su intake. `RIGE_DESDE['FDGE-R55'] = [13,0,0]` ⇒ **no las alcanza**. Es el criterio de `FDGE-R19` y `FDGE-R52`: lo ya abierto no se retrofecha. | Un caso lo fija, con su inversa. |
| **Proyectos destino ya instalados** | Si actualizan a `13.0.0`, su trabajo en vuelo lleva `suite_version` anterior y queda fuera. El trabajo nuevo sí entra — y es lo que se quiere. | `RIGE_DESDE` + guía de migración en `CHANGELOG.md`. |
| **`asignar` escribiendo un campo más** | `PT-103` ya amplió esto de cuatro campos a ocho sin romper nada; el registro es un objeto y los consumidores leen por nombre. | La batería cubre `asignar` desde `PT-103`. |
| **`parada` escribiendo en el registro** | Pasa a ser **acto compuesto**: publica *y* escribe. Si publica y falla al guardar, queda una nota sin enlace. | El registro se guarda **antes** de publicar: lo reversible primero, lo irreversible al final. Es el contrato de `avanzar` (`PT-053`) y el que `PT-132` acaba de arreglar en `abrir`. |
| **`verify-suite` comparando las listas** | Si `LEXICON` §8.5 y `patrones.mjs` divergen, falla. Es lo que se quiere: es la deuda que `PT-116` declaró y trasladó aquí. | Igual que la comparación de `TIPOS_DE_ITEM` que construyó `PT-124`. |

## 6. Dependencias

- `PT-116` — `DONE`. Aporta `cuerpoDeParada`, `MOTIVOS_DE_PARADA`, `DESENLACES_DE_PARADA` y el comando.
- `LEXICON` §8.5 — `LEX-R29` y `LEX-R30`, ya escritas.
- `RIGE_DESDE['FDGE-R55'] = [13,0,0]` — ya declarado en `patrones.mjs`.

## 7. Restricciones   `11-Conventions.md`

- Los patrones críticos van a `patrones.mjs` con su contrato (`SUITE-R14`, `SUITE-R38`): **una definición, un sitio**.
- El texto largo entra por archivo (`SUITE-R59`).
- Ningún caso asserta sobre el **fuente**: se asserta comportamiento, y con inversa (`PT-124`, y lo que `PT-116` tuvo que rehacer).

## 8. Criterios de éxito   derivados de los `AC-nn`

| De | Criterio de éxito |
|:---|:---|
| `AC-01` | Una allocation alcanzada por la regla y sin `origen_parada` hace fallar `verify-fdge`; una anterior ni se mira. |
| `AC-02` | El caso que señaló el firmante —un defecto hallado a mitad de trabajo que se arregla en línea— tiene comprobación propia. |
| `AC-03` | El hook existe **y su límite está escrito**: no viaja en el paquete. |
| `AC-04` | El hueco de `continua` se publica con su cifra, no se promete (`SUITE-R26`). |
| — | `verify-suite` compara las dos listas con `LEXICON` §8.5 — deuda heredada de `PT-116`, declarada allí. |

## 9. Cómo termina   `FDGE-R53`

> Termina cuando: abrir trabajo nuevo sin haber publicado la parada que lo motivó **falla
> mecánicamente**, y lo que no se puede exigir está publicado como hueco con su número.
