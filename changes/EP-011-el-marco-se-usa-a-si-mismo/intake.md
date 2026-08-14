# EP-011 — El marco se usa a sí mismo

```yaml
---
id: EP-011
type: EP
status: DONE
created: 2026-08-14
suite_version: 7.5.0
phase: 9
---
```

## 1. Qué se quiere   `[HUMANO]`

Cuatro huecos señalados antes de publicar, y dos observaciones que los explican:

> «Leo por ejemplo que cuando algo falla hay 177 reglas de un mensaje, **pero ¿qué es lo que puede
> fallar?** Las diez ideas de las que se deduce la regla que no se ha leído… **¿cómo lo
> evitamos?** Lo de Azure está bien, es algo que haremos adelante, pero **migrar un legado como
> está me parece hasta preocupante**, y lo peor es que **ningún caso prueba que el manual sirve**
> — es porque no se obliga a nadie a leer el manual. El agente, al hacer la instalación, debería
> comenzar por leer el manual y tener la capacidad de **autorreferenciarse**.»
>
> «Ni tú mismo, esta sesión al menos, sigue o se obliga a seguir lo que ya tenemos.»
>
> «Necesitamos **distinguir entre las solicitudes de algo y la interacción por el intercambio de
> ideas** para llegar a un punto.»

## 2. El diagnóstico   `[AGENTE]`

Las seis cosas son **la misma**: el marco existe y no se aplica a sí mismo.

```
· la tabla «cuando algo falla» la escribí DE MEMORIA, y es derivable de los fail() reales
· «deduce la regla que no leíste» es una excusa: la regla debe aparecer CUANDO IMPORTA
· migrate ENUMERA siete decisiones humanas y te deja solo; instalar sí te acompaña
· cauce start da el tablero y NO da el manual; instalar copia archivos que nadie lee
· escribí SUITE-R48 y R49 y no ejecuté `tracker siguiente` ni una vez para trabajar
· no hay forma de distinguir «haz X» de «estoy pensando en X»
```

La última es la que sostiene a las demás: sin distinguir petición de conversación, cada mensaje
es una orden potencial y el marco se aplica a destiempo o no se aplica.

**Prueba de que el diagnóstico es correcto:** al ejecutar `tracker siguiente EP-011` para escribir
este intake —lo primero que `SUITE-R49` obliga a hacer y que llevaba sin hacer toda la sesión—
apareció un defecto real: el filtro de `ROOT` excluía `PT-NNN` pero no `EP-NNN`, así que el
identificador del lote se tomaba como ruta del proyecto. **Usar la herramienta lo encontró en el
primer intento.** Leerla no lo había encontrado nunca.

## 3. Objetivo común del lote   `INTAKE-R09`

Que el marco se aplique a sí mismo en los cuatro sitios donde hoy solo está escrito: lo que puede
fallar, la regla en el momento del fallo, la migración, y el arranque del agente.

## 4. Criterio de éxito del lote   `INTAKE-R09`

Un agente recién instalado **no puede** empezar a trabajar sin haber leído el manual, sabe qué
puede fallar porque está derivado y no recordado, encuentra la regla en el mensaje que la
incumple, distingue una petición de una conversación, y migrar un legado deja de ser una lista
para convertirse en un recorrido acompañado.

## 5. Análisis de solapamiento   `INTAKE-R09`

| PT | Tipo | Sev | Qué resuelve |
|:---|:---|:---|:---|
| `PT-039` | FEATURE | S1 | **Petición o conversación**: la regla primero, y después el arranque |
| `PT-040` | FEATURE | S1 | **Qué puede fallar**, derivado de los `fail()` reales y no escrito de memoria |
| `PT-041` | FEATURE | S1 | **La regla en el mensaje**: `cauce regla SUITE-RNN` y el mensaje que lleva a ella |
| `PT-042` | FEATURE | S1 | **El agente lee su manual** al instalar y al arrancar, y sabe autorreferenciarse |
| `PT-043` | FEATURE | S1 | **Migración guiada**: las siete decisiones se conducen, no se enumeran |

**Orden obligado.** `PT-039` primero: sin distinguir petición de conversación, las otras cuatro se
aplican a destiempo. Después `PT-040` y `PT-041`, que son la misma pieza vista desde dos lados —
qué puede fallar y cómo se llega a la regla— y comparten la fuente: los `fail()` del código.
`PT-042` necesita el manual ya escrito (`EP-010`, hecho) y la autorreferencia de `PT-041`.
`PT-043` es independiente y es la más grande.

**Riesgo declarado:** `PT-040` y `PT-041` derivan de los mensajes del código. Si alguien añade un
`fail()` sin regla, la derivación lo verá — pero si lo añade con una regla que no existe, no.
Eso lo cubre `verify-suite` hoy, y hay que comprobar que sigue cubriéndolo.

## 6. Qué NO entra

- OUT: Azure. Decisión humana explícita: «es algo que haremos adelante» (`PT-025`)
- OUT: publicar `7.5.0`. Decisión humana: «antes de publicar, debemos solventar todo»
- OUT: cambiar ninguna compuerta. `G4` sigue siendo humana en los tres modos (`EXEC-R04`)
- OUT: que el agente decida solo si algo es petición o conversación **sin poder equivocarse**.
  No es posible; lo que se puede es que lo **declare** y sea corregible

## 7. Cómo termina

> Termina cuando: un agente instalado desde cero lee su manual, sabe qué puede fallar, llega a la
> regla desde el mensaje, distingue lo que le piden de lo que se conversa, y puede conducir la
> migración de un legado sin dejar a nadie solo.

## 8. Firma   `INTAKE-R06`

```
Firmado por: Alberto Martínez (delegada — «La migración guiada entra aquí. La distinción va en
             reglas primero, pero sí va en los dos. Sigue.», 2026-08-14)
Fecha: 2026-08-14
Severidad declarada: S1 en las cinco. El marco no se aplica a sí mismo, y esta misma sesión es
la evidencia: quien lo escribió no lo siguió.
Estado: FIRMADA · G1 PASS
```

## Cierre del lote   `SUITE-R45`

| Qué se resuelve al cerrar | Estado |
|:---|:---|
| Entrada de `CHANGELOG.md` y número de versión | HECHO · `7.6.0`, `MINOR`: cuatro reglas nuevas, ninguna modificada. Los 21 documentos y `package.json` alineados con `tools/version.mjs` |
| Regenerar `CORE.md` | HECHO · `build-core --check` sincronizado, 244 reglas |
| El defecto de `ROOT` encontrado al abrir este lote, y su caso | HECHO · `tracker.mjs:383` deja de tomar un `EP-NNN` por una ruta, con su caso «un EP-NNN no es una ruta» |

> El merge, la publicación y lo que se verifique después del cierre no son filas: `SUITE-R45`.
