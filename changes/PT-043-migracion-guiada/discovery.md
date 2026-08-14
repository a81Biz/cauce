# PT-043 — Descubrimiento   `PHASE 2` · `2-E`

## Lo que hay

`INSTALL.md` conduce la instalación en **nueve fases conversacionales** (`SUITE-R28`): pregunta,
enseña el comando antes de correrlo, registra lo que ejecutó. `migrate.mjs` hacía lo contrario:
imprimía una lista bajo `REQUIERE UNA PERSONA` y terminaba.

```
instalar   te acompaña
migrar     te dejaba una lista y se iba
```

Y migrar es donde más se necesita lo primero: quien migra **no eligió** este marco hoy, lo
heredó — y la lista que recibe está escrita en el vocabulario del marco que todavía no conoce.

## El caso real, medido

Único proyecto legado con la suite instalada fuera de este repositorio:

```
C:\DevOps\Desarrollos\Inteligencia de Mercados Energéticos Mexicanos    suite 4.12.0
node docs/methodology/tools/migrate.mjs "<ese proyecto>"
→ 1 automática · 7 pendientes de decisión humana
```

Siete decisiones. Ninguna dice qué se decide ni por qué no puede decidirlo la máquina.

## Dos defectos que solo aparecen ejecutando

La implementación de `PT-043` ya estaba escrita cuando se ejecutó esto. Los dos defectos son
suyos, y ninguno se ve leyendo el código.

**D1 · Una de las siete no es una decisión.** Los `need()` de las líneas 211-218 son dos: el
bloque `ESTADO` y, detrás, *«escribirlo AL CERRAR CADA FASE, no al terminar la sesión»*. Lo
segundo no es algo que decidir: es una advertencia **sobre** lo primero. Conducirla como `2/7`
le pide al lector una decisión que no existe, y hace que el recuento diga siete donde hay seis.

El síntoma que lo delató es del propio conductor: `PORQUE` no reconoce ese texto —no contiene
`ESTADO` ni `phase`— y sale por el `RULE-06`:

```
  2/7 · escribirlo AL CERRAR CADA FASE, no al terminar la sesión: una sesión no siempre avisa de que va
        No se reconoce el motivo de esta accion: se dice en vez de inventarlo (RULE-06).
```

Decir «no lo sé» era correcto y por eso se vio. **La respuesta no era enseñarle ese texto a
`PORQUE`**: era que ese texto no fuera una fila.

**D2 · El resumen sigue cortando por la mitad.** `resumen()` corta a 96 caracteres sin mirar
dónde. Tres de las siete quedan partidas a media palabra:

```
  ... revisar-secretos (árbol e his
  ... se firma en docs/implementation/SECRETOS-
  ... una sesión no siempre avisa de que va
```

La sesión anterior ya corrigió este mismo `resumen()` una vez —cortaba por `.` y partía `7.5.0`—
y lo dejó cortando por `. ` **con un `slice(0, 96)` detrás que nadie miró**. El corte por punto
era el caso que se probó; el corte por longitud es el que ocurre siempre que la primera frase
pasa de 96, que es en tres de siete.

## Lo que no se puede hacer, y se dice antes

**No se puede tomar ninguna de esas decisiones por nadie.** Son humanas porque el dato no está en
el repositorio: qué compuerta se espera, en qué fase está un trabajo vivo, si una huella de
secreto es un falso positivo. Conducir es decir **qué** se decide y **por qué es tuyo** — no
proponer una respuesta por defecto, que es como se rellena un estado que miente.

Y `SUITE-R17` no se toca: mientras queden pendientes, el modo restringido sigue. Lo que cambia es
que se explique **al entrar en él** en vez de descubrirse al chocar con la primera compuerta.
