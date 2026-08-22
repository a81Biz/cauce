# Estrategia — `PT-104`

## La decisión

**A-1 · Se publica estado DERIVADO, y se contrasta contra el árbol.**

Dos mitades, y la segunda es la que lo hace útil:

1. **La máquina de estados**: paso actual, de dónde vino, qué necesita para salir, a dónde va.
   Todo sale de `FASES`, que ya lo declara.
2. **El contraste `debería` / `está`**: qué artefactos produce la fase **y cuáles existen de
   verdad**, mirados en el árbol.

Sin la segunda, esto sería una copia de `FASES` en cada issue: repetiría la teoría y **nunca
podría discrepar**. Con ella, el issue puede contradecir a quien lo escribe.

### Alternativas descartadas

| | Por qué no |
|:---|:---|
| **Copiar el contenido de `changes/`** | `SUITE-R35`: dos copias del mismo texto divergen |
| **Solo publicar la fase** | «`PHASE 4`» sin su regla de salida no dice qué falta |
| **Publicar solo lo que `FASES` declara** | sería teoría: no podría contradecir al árbol |
| **Obligar a leerlo** | `EP-007` y `EP-008` ya establecieron que no se puede |

## Por qué `SUITE-R35` no lo impide

La regla prohíbe **copiar contenido**, y con razón: dos copias del mismo texto divergen.

Publicar **estado derivado es lo contrario**: no hay segunda copia porque **no hay texto
propio**. Todo se recalcula de la allocation y del árbol en cada `abrir --aplicar`, así que no
puede divergir — si diverge, es que el árbol cambió, y eso es justo lo que se quiere ver.

## Dónde vive cada cosa

`cuerpoDeIssue` es **pura** a propósito desde `PT-048`, para que un caso pueda comprobarla sin
hablar con la plataforma ni con el disco. Se respeta:

```
contextoCuerpo(a)     lee el disco      artefactos · refDurable · hayDirectorio
maquinaDeEstados(a)   pura              recibe los datos y compone
```

Meterle un `readdirSync` a la función pura la habría devuelto a ser incomprobable — el mismo
razonamiento que `PT-048` y `PT-079` ya dejaron escrito ahí.

## Lo que NO se hace

**No obliga a nadie**, y no puede. Lo que consigue es que el paso siguiente esté escrito donde se
mira sin acordarse de nada.

## Termina cuando

El issue dice en qué paso está, qué lo dejó entrar, qué necesita para salir y a dónde va; dice
qué artefactos existen y cuáles no; y la batería falla sin el arreglo.
