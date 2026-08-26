# `PT-147` · autorrevisión — `PHASE 6` Evidence

## 1. Lo medido

| Qué | Antes | Después |
|:---|:---|:---|
| Literales de componente en `audit.mjs` | **4** | **0** |
| Mapas por componente | **2**, y discrepaban | **1**, del contrato |
| Componentes en la auditoría de fases | **4** | **6** |
| `fase:` de los cuatro ya auditados | **40** | **40** |
| `selftest` | 1715 | **1720** casos |

**`fase: 40` antes y después.** `RC-01` cumplido: lo que sube es lo que no se medía, no lo que se
midió distinto.

## 2. Los dos mapas discrepaban, y el bucle recorría uno

```
              PROMPTS   esperadas
FDGE             sí        sí
Foundation       sí        sí
QA               sí        sí
PTSA             sí        sí
FPGE             sí        NO      tenia prompts declarados y NADIE auditaba sus fases
FIDE             NO        NO      invisible entera
```

El bucle recorría `esperadas`, así que **lo que no estaba ahí no aparecía** — ni en rojo ni en
amarillo. Dos de los seis componentes sin auditar sus fases, y **nunca lo dijeron**.

Es el mismo patrón que `verify-qa.mjs:7` registra para las reglas —«`QA` 0/19 y `FPGE` 0/10»—
repetido sobre las **fases** y sobre otros dos componentes.

**Recorrer `COMPONENTES` lo hace estructuralmente imposible**: si está en la suite, está en el
bucle. Pero `RULE-02` pide una comprobación que pueda fallar, no una imposibilidad afirmada — de
ahí los casos permanentes.

## 3. Los dos entraron de forma distinta, y ésa era la tarea

```
FIDE   LEXICON §3.5 declara PHASE 1-5   ->  entra CON SU RANGO y sale ROJO
FPGE   LEXICON §3 no tiene apartado     ->  entra como SIN EVALUAR y lo DICE
```

**«No aparece» y «aparece como no evaluable» no son lo mismo.** Lo primero es indistinguible de
estar bien; lo segundo dice exactamente lo que se sabe y lo que no (`RULE-06`).

Meterle a `FPGE` un rango inventado para que la tabla quedara simétrica **habría apagado la
comprobación en silencio** — el defecto que este lote entero existe para quitar.

## 4. Que `FIDE` salga rojo es el objetivo cumplido

`scope.md` §8 lo declaró antes de empezar: *«que aparezcan es el objetivo; que salgan limpios NO
lo es»*. Y salió rojo por algo concreto:

```
✗ FIDE PHASE 1 … PHASE 5     ausente en: FIDE/FIDE-Prompts.md
```

**El archivo no existe**, y `LEX-R15` declara que *«todo componente tiene exactamente un archivo
de prompts»* — enumerando **cinco** cuando son seis.

**Es la tercera lista de componentes de este lote que se quedó corta**, y las tres son
independientes: los dos mapas de `audit`, `LEXICON` §3 sin `FPGE`, y `LEX-R15` sin `FIDE`.

**Tiene tarea**: `PT-158`, enlazada a la parada de `#282`. No es una nota.

## 5. El ternario desapareció, y era la evidencia más limpia del lote

```js
const sigla = comp === 'Foundation' ? 'FND' : comp;   // antes
const sigla = siglaDe(comp);                           // ahora
```

**No era una lista repetida: era una excepción codificada como condicional.** `PT-144` la usó como
caso de prueba del diseño del contrato —si `sigla` no fuera un campo, este ternario tendría que
seguir existiendo en otro sitio— y aquí se cobró.

Y cubre un caso que el ternario **no tenía**: `FQAGE` se llama `QA` en rutas y triggers
(`LEX-R03`). `audit` no lo necesitaba porque usaba la sigla como clave; al recorrer `COMPONENTES`
la clave pasa a ser el nombre, así que `siglaDe()` dejó de ser un adorno.

## 6. Lo que esta tarea deja para el lote

El contrato de `PT-144` lleva ya **cuatro consumidores** —`PT-150`, `PT-145`, `PT-146` y ésta— y
sólo hizo falta ampliarlo **una vez** (`etiqueta`, en `PT-146`). Era lo que aquella tarea no podía
establecer por sí misma.

Quedan `PT-148` —la documentación del alta y la baja— y `PT-149` —la prueba mecánica de que un
componente se da de alta y de baja sin tocar herramienta—, que es la que cierra el criterio de
éxito del lote.
