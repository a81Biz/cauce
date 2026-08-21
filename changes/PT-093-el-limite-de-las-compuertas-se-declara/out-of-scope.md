# PT-093 — Fuera de alcance   `SUITE-R44`

| Qué queda fuera | Por qué | Destino |
|:---|:---|:---|
| Exigir un **revisor aprobador** en la rama por defecto | Haría imposible el equipo de una persona que `SUITE-R22` declara soportado: nadie aprueba su propio PR | `—` |
| Retirar credenciales de `gh` al agente | Rompe el espejo (`SUITE-R35`), única defensa contra la divergencia registro↔tablero | `—` |
| Firma **criptográfica** del firmante | El agente ejecuta en la misma máquina donde estaría la clave. Mueve el problema | `—` |
| Un **segundo agente** que apruebe | Dos agentes con las mismas credenciales no son dos personas | `—` |
| Comprobar que la autorización **existiera** | No es mecanizable desde el repositorio. Es el límite que esta tarea declara | `—` |
| Que la declaración **se lea** | Está en `CORE.md`, que el agente carga. Que la tenga en cuenta al decidir no se comprueba | `—` |
| Revisar las **otras** reglas que podrían necesitar su límite declarado | `PT-087` montó el registro de sujetos con adopción declarada. Ésta es la primera regla que lo usa fuera de `PT-088` | `PT-087` |

## Las cuatro primeras filas son la decisión, no una omisión

`H-009` es `INVESTIGATION` porque no estaba claro que tuviera arreglo. **Medido, no lo tiene** — y
cada camino que lo parece mueve el problema a otro sitio.

Prometer una prevención sería peor que declarar el límite: daría por resuelto lo que sigue abierto,
que es exactamente el patrón que este lote combate.
