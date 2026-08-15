# EP-010 — El manual completo de uso

```yaml
---
id: EP-010
type: EP
status: CLOSED
created: 2026-08-13
suite_version: 7.3.0
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Me parece que falta la explicación en el README del uso, desde el inicio: la creación de un
> nuevo proyecto, la instalación del agente, sobre un trabajo nuevo, uno legado, etc. Abrimos una
> épica dedicada íntegramente a **todos los casos de uso que puedan existir** y a la resolución
> de cada uno, para que se pueda generar un **manual completo de uso**.»

## 2. El diagnóstico   `[AGENTE]`

El marco tiene **176 reglas, 15 herramientas y 359 casos de prueba**, y no tiene un documento que
responda «acabo de llegar, ¿qué hago?». Lo que hay está repartido:

```
README.md                escenarios greenfield y legado, en resumen
docs/methodology/README  manual de la suite, §4 el detalle
INSTALL.md               las nueve fases de la instalación conversacional
CORE.md                  lo que el agente carga
```

Cuatro sitios, ninguno completo, y **ninguno cubre `cauce start`** —el punto de entrada que
acaba de nacer en `7.3.0`— ni el caso «tengo un proyecto legado y quiero saber si se puede».

Es el mismo defecto que este marco corrige en el código: la información existe y no está donde se
busca.

## 3. Objetivo común del lote   `INTAKE-R09`

Que alguien que no conoce cauce pueda ir de cero a su primer `PT` cerrado **sin preguntar**.

## 4. Criterio de éxito del lote   `INTAKE-R09`

Existe un manual que **enumera los casos de uso** —no los ejemplifica— y para cada uno da la
secuencia exacta de comandos y decisiones humanas hasta el final. Un caso que el manual no cubra
es un hueco declarado, no un silencio.

## 5. Análisis de solapamiento   `INTAKE-R09`

| PT | Tipo | Sev | Qué resuelve |
|:---|:---|:---|:---|
| `PT-037` | FEATURE | S1 | El **catálogo**: enumera todos los casos de uso y, por cada uno, su ruta exacta |
| `PT-038` | FEATURE | S1 | El **manual**: lo escribe para que se lea de principio a fin, y reordena lo que ya existe |

Orden obligado: `PT-037` primero. Escribir sin la lista produce un manual que cubre lo que se me
ocurrió, y eso es exactamente lo que hay hoy repartido en cuatro archivos.

Lo que ya se anticipa:

- **Enumerar** los casos es un trabajo distinto de **escribirlos**, y el primero condiciona al
  segundo: escribir sin la lista produce un manual que cubre lo que se me ocurrió.
- El manual **no puede copiar** reglas ni procedimiento: los cita (`LEX-R22`, `SUITE-R21`). Una
  copia divergiría, y este marco tiene cicatrices de eso.
- Hay solapamiento con `INSTALL.md` y con los dos `README.md`: parte del trabajo es decidir qué
  se mueve y qué se queda, no solo qué se escribe.

## 6. Casos que ya se sabe que existen

Sin ser exhaustivo — enumerarlos **es** la primera tarea:

```
· proyecto nuevo desde una idea de negocio        (FIDE → Foundation → FDGE)
· proyecto nuevo con código ya empezado
· proyecto legado: ¿se puede migrar? y ¿cómo?
· proyecto ya instalado que sube de versión
· instalar el agente y arrancar una sesión        (cauce start, 7.3.0)
· trabajar una tarea suelta · trabajar un lote
· un BUG · un cambio estructural · una investigación
· auditar contra el dominio de negocio            (PTSA)
· verificar en navegador                          (QA)
· priorizar qué construir                         (FPGE)
· equipo de una sola persona asistida por IA      (SUITE-R22)
· sin plataforma declarada · con GitHub · con Azure
```

## 7. Qué NO entra

- OUT: copiar reglas o procedimiento en el manual. Se **citan** (`LEX-R22`, `SUITE-R21`)
- OUT: cambiar ninguna regla para que el manual quede más simple
- OUT: documentar casos que el marco no soporta hoy. Si falta soporte, es otro `PT`

## 8. Cómo termina

> Termina cuando: alguien que llega sin conocer cauce puede ir de cero a su primer `PT` cerrado
> siguiendo un solo documento, y los casos que ese documento **no** cubre están escritos como
> huecos.

## 9. Firma   `INTAKE-R06`

```
Firmado por: Alberto Martínez (delegada — «adelante, firma con mi nombre y empieza», 2026-08-13)
Fecha: 2026-08-13
Severidad declarada: S1 en las dos. Un marco con 177 reglas y sin manual no lo puede usar nadie
que no haya estado aquí mientras se escribía.
Estado: FIRMADA · G1 PASS
```

## Cierre del lote   `SUITE-R45`

| Qué se resuelve al cerrar | Estado |
|:---|:---|
| Entrada de `CHANGELOG.md` y número de versión | HECHO — 7.5.0 |
| Regenerar `CORE.md` (LEXICON declaró los dos archivos nuevos) | HECHO |

> El merge, la publicación y lo que se verifique después del cierre no son filas: `SUITE-R45`.
