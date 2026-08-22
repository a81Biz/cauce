# Fuera de alcance — `PT-109`

```
OUT: igualar las severidades de las CINCO reglas
     Seria endurecer cada revision de paso hasta hacerla inutil, o ablandar G4. Que una
     precondicion de merge sea mas estricta que una revision de paso esta BIEN y es
     deliberado: lo que faltaba es DECIRLO.

OUT: rehacer el formato del ROADMAP
     Se arregla el RECONOCIMIENTO, no el documento.

OUT: INC-003, INC-005 e INC-014
     Sus descripciones viven en el INCIDENTS.log de la CALCULADORA, que NO ESTA en esta
     maquina. Medido:

         $ find /c/DevOps/Desarrollos -maxdepth 3 -name "INCIDENTS.log" -not -path "*/cauce/*"
         (sin resultados)

     Arreglar «algo parecido» seria INVENTAR EL DEFECTO Y SU ARREGLO A LA VEZ, que es
     exactamente lo que este lote persigue.

     Del INC-003 si se sabe lo que el lote dice: «se registro el 2026-08-20, se escribio
     reportado a cauce y nadie abrio el PT». Es un defecto de PROCEDIMIENTO —no de codigo—
     y se cierra ABRIENDOLO, que es lo que este lote entero hace.
```

---

## Por qué `L-7` cierra con dos de cinco, y eso es una decisión

El reparto pedía **cinco defectos de forma**. Se arreglan **dos** y se declaran **tres**.

No es cansancio ni recorte: es que **no puedo leer los otros tres**. Escribir un arreglo para un
defecto cuya descripción no tengo significaría inventarme qué falla y qué lo corrige — y luego
marcarlo verde.

`SUITE-R45` permite que una fila del cierre se resuelva `HECHO` **o con el identificador al que se
movió**. Aquí se resuelve con una tercera forma, que la regla también admite en espíritu:
**declarada, con el motivo y con la medición que lo sostiene.**

## Lo que esto NO establece

- **Que los tres `INC` sean menores.** No lo sé: no los he leído.
- **Que estén en la calculadora y en ningún otro sitio.** El `find` cubre
  `/c/DevOps/Desarrollos` hasta tres niveles. Podría haberlos en otra máquina.
