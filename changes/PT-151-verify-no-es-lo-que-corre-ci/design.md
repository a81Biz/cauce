# `PT-151` · `design.md` — `PHASE 4`

## 1. Las dos listas, derivadas de sus fuentes

```js
pasosDeCI(yaml)        // las lineas «run: npm run <script>» del workflow
pasosDeVerify(scripts) // los «npm run <script>» de la cadena `verify`
```

Ninguna lleva una lista escrita. Un paso nuevo entra solo por cualquiera de los dos lados.

## 2. La comparación es asimétrica **a propósito**

| | |
|:---|:---|
| Falta en local | **`fail`** — deja pasar errores al PR |
| Sobra en local | **`warn`** — deja una comprobación cuyo rojo nadie ve |

Las dos son la misma promesa rota; **no cuestan lo mismo**, y tratarlas igual obligaría a elegir
entre bloquear de más o callar de menos.

## 3. `SUITE-R62`, y por qué no `SUITE-R01`

La primera versión emitía `SUITE-R01`, y **la batería lo cazó**: `NO_VERIFICABLE` pasó de **6 a
5**. `SUITE-R01` está declarada no verificable **con motivo y firma**, y esta comprobación cubre
**un aspecto**, no la regla.

Dar por comprobada la regla entera porque se comprueba una de sus formas es `CE-001` —el proxy en
lugar del hecho— y en una herramienta que **publica cobertura** mueve una cifra que alguien usa
para decidir. La obligación comprobable tiene ID propio; `SUITE-R01` vuelve a donde estaba.

## 4. `RULE-06` en tres puntos

Sin workflow, sin `package.json`, o si el workflow no invoca ningún `npm run` → **SIN EVALUAR**.
Un proyecto destino que no use GitHub Actions **no incumple nada**.

## 5. Lo que este diseño NO resuelve

**Que el paso haga lo mismo en los dos sitios.** Se comparan **nombres**. Si el workflow invocara
la herramienta directamente con otras banderas —como hacía con `revisar-secretos --historial`— la
diferencia volvería a ser invisible.
