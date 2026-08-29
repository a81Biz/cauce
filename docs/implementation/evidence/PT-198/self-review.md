# `PT-198` · self-review

## Lo que se sostiene

- **`AC` verificados: 4, ninguno huérfano.** Doce casos sobre cinco escenarios.
- **El alcance real era el doble de lo que el intake decía.** Siete expresiones sobre cuatro
  campos —`type`, `phase`, `status` ×4, `epic`—, no tres sobre uno. Arreglar sólo `status` habría
  sido escribir el sitio único y dejar tres campos con la avería intacta.
- **El patrón vive donde algo lo vigila.** `patrones.mjs` con su contrato, y `verify-patrones` lo
  comprueba. Ésa es la razón de que hubiera siete copias: un patrón crítico en el consumidor no lo
  mira nadie (`SUITE-R38`).
- **El comentario sobrevive a la escritura.** Un lector que lea y un escritor que borre cambian un
  defecto por otro. Tiene su caso.

## `verify-patrones` cazó mi contrato en el primer intento

Declaré `noCasa: ['statuses: READY']`. **Y sí casa**: el patrón acepta cualquier campo y no sabe
cuál se le pide —eso lo discrimina `campoDeIntake` comparando el grupo 1—. El verificador lo dijo
en la primera ejecución:

```
✗ SUITE-R38  CAMPO_DE_INTAKE: NO debería casar "statuses: READY" y casa.
```

Un contrato que afirma del patrón algo que no hace es exactamente lo que `SUITE-R38` existe para
impedir, y la herramienta funcionó. El comentario que ahora está en el contrato salió de ahí.

## Dos huecos en mis propios casos, corregidos antes de cerrar

1. **El detector de expresiones sueltas comprobaba el literal `^status:`.** Una octava copia
   escrita sobre `phase` habría pasado por no contener esa cadena. La salida se normaliza a una
   marca, y se añade la pareja que prueba que el detector **detecta** — sin ella era `CE-005`,
   verde por mirar al sitio equivocado, dentro del caso escrito para impedirlo.
2. **El caso de lectura no probaba que el arreglo hiciera falta.** Se añade la comprobación
   inversa sobre la **misma** entrada: la expresión anclada de antes no casa nada. Es lo que
   `PT-192` dejó escrito — un caso que no puede fallar no mide.

## Un error de técnica, y ya conocido

Escribí los helpers con `await import('file://$SUITE/…')` dentro de un literal JS. **Revienta
donde `$SUITE` lleva barra invertida**, y los siete casos salieron «la herramienta reventó». El
idioma correcto ya estaba en el arnés desde `patlib` ([selftest.sh:2027](../../methodology/tools/selftest.sh)):
la ruta viaja por variable de entorno y se convierte con `pathToFileURL`. Reescritos con él.

Es `CE-007` en pequeño: la forma correcta existía y no la invoqué.

## Lo que NO se cubre, y consta   `SUITE-R26`

- **No se promete que el frontmatter sea YAML válido.** Se cubre el escalar con comentario en
  línea, que es el caso medido. Un parser completo es otra decisión, otro coste y una dependencia
  que este repositorio hoy no tiene.
- **Campos no escalares** —listas, bloques— quedan fuera: ninguna de las siete llamadas los toca.
- **Otros artefactos con YAML** (`HANDOFF`, `CHECKPOINT`) no son intakes y su forma la escribe una
  herramienta, no una persona.
- **Hoy ningún intake del árbol dispara el defecto**: el de `EP-023` ya se corrigió. Lo que se
  compra es que no reincida y que el mensaje deje de mentir — no un rojo que se apaga.

## Sin bloqueadores
