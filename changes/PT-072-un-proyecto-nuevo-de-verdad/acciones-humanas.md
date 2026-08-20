# PT-072 — Acciones reservadas al humano   `EXEC-R07`

## 1 · Nada que ejecutar fuera del repositorio de prueba

Esta tarea **no tocó cauce**: creó un proyecto nuevo en `C:/tmp/pt072/nuevo` y lo recorrió entero.
Todo lo que escribió está en ese directorio y en `evidence/PT-072/`.

## 2 · El fixture no se versiona, y es una decisión

`C:/tmp/pt072/nuevo` es un repositorio git con tres commits propios. **No se mete dentro de
cauce**: sería un repositorio dentro de otro, y sobre todo heredaría el `REGISTRY`, el `CLAUDE.md`
y la plataforma declarada de cauce — con lo que `H7`, el único hueco crítico, **no habría
aparecido**.

Si quieres conservarlo, es tuyo decidirlo:

```bash
# opción A · dejarlo donde está (por defecto: C:/tmp se limpia solo)
# opción B · moverlo a un sitio permanente
mv "C:/tmp/pt072/nuevo" "C:/DevOps/Desarrollos/tareitas"
# opción C · publicarlo como repositorio propio  (SUITE-R06 no lo cubre, pero es tuyo)
```

**No lo muevo ni lo publico por mi cuenta.** Su valor probatorio ya está en la evidencia.

## 3 · Los dos huecos serios necesitan decisión, no sólo arreglo

`PT-084` (`H7`) pregunta algo que no puedo contestar yo: **dónde vive la nota de transición cuando
no hay tablero**. Hay un candidato —un ledger append-only en el repositorio— pero convertirlo en
la respuesta es una decisión de diseño del marco, y `SUITE-R06e` dice que `docs/methodology/` no
es trabajo de paso.

`PT-083` (`H6`) sí es arreglo limpio: el verificador y la plantilla tienen que concordar.

## 4 · El paquete de prueba

```bash
rm /c/tmp/pt072/a81biz-cauce-9.0.0.tgz   # cuando ya no haga falta
```

Se generó con `npm pack` desde este repositorio y **nunca se publicó**. `npm view @a81biz/cauce
version` sigue diciendo `8.2.0`.

## 5 · Publicar   **NO AUTORIZADO**

Sigue vigente «No publiques la 9.0.0». Y `PT-081` sostiene que la versión correcta de `EP-017` es
la **`10.0.0`**: esta prueba se hizo contra un paquete etiquetado `9.0.0`, y ese número va a
cambiar antes de salir.
