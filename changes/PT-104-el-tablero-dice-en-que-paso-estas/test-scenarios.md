# Escenarios de prueba — `PT-104`

## En la batería — doce casos

| Caso | Qué establece |
|:---|:---|
| dice en qué **paso** está | la fase, con su nombre |
| dice de dónde **viene** | la regla de entrada |
| dice qué necesita para **salir** | la regla de salida y su compuerta |
| dice a dónde va **después** | la transición |
| dice **cuáles** artefactos existen ya | el contraste con el árbol |
| …distinguiendo los que faltan | «todavía no» |
| dice cuándo **no pudo mirar** | `RULE-06` |
| dice qué le **impide avanzar** | los bloqueos de `queSigue` |
| la primera fase no inventa una entrada | el borde inferior |
| …y la última no inventa una salida | el borde superior |
| sin `phase` **no** se supone el paso cero | el negativo |
| un lote **no** lleva máquina de estados | no recorre fases |

## La inversa — diez retiradas, diez con efecto

```
S-1  el paso actual                caen 1     S-6  decir que no se pudo mirar   caen 1
S-2  la regla de ENTRADA           caen 1     S-7  los bloqueos                 caen 1
S-3  la regla de SALIDA            caen 1     S-8  los bordes de la maquina     caen 2
S-4  a donde va despues            caen 1     S-9  la guarda de la fase ausente caen 2
S-5  el contraste deberia/esta     caen 2     S-10 el lote sin maquina          caen 1
```

**Cada medida llama al módulo en un proceso aparte.** `import` cachea: con la versión rota ya
cargada, la inversa mediría siempre el código bueno y saldría en cero sin significar nada.

## Lo que NO se prueba

- **Que publicarlo cambie la conducta del agente.** No es comprobable y no se afirma.
- Que no falte más estado por publicar.
