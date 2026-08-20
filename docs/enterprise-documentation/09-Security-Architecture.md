# 09-Security-Architecture

> Foundation `PHASE 3` · 2026-08-19 · suite 9.0.0 · segunda ejecución

Cauce no autentica usuarios ni guarda datos: no hay superficie de ataque en ejecución. Su
seguridad es la de **una cadena de suministro** —un paquete npm que se instala dentro de
repositorios ajenos— y la de **un agente con acceso al sistema de archivos**.

## Modelo de amenaza

| Amenaza | Consecuencia | Control |
|:---|:---|:---|
| Publicar un secreto en el paquete o en la historia | Irreversible: npm no despublica salvo ventana muy estrecha, y un secreto en la historia sigue ahí tras borrarlo del archivo | `revisar-secretos.mjs --historial`, bloqueante en `verificacion.yml` y `publicar.yml` |
| Publicar contenido no verificado | El marco certifica a otros lo que no cumple él | `publicar.yml` repite las cinco verificaciones antes de publicar y falla si alguna falla |
| Publicar desde una rama que no es `main` | Se publica algo que no pasó `G4` | [publicar.yml:47-52](../../.github/workflows/publicar.yml#L47-L52) comprueba `github.ref_name` |
| Republicar una versión existente | El registro queda mintiendo | [publicar.yml:85-93](../../.github/workflows/publicar.yml#L85-L93) consulta npm y para |
| Publicación accidental | Irreversible por definición | Solo `workflow_dispatch`, con confirmación literal `PUBLICAR` |
| Token de publicación filtrado o caducado | Suplantación del paquete | **No hay token**: OIDC con Trusted Publisher. No hay credencial que rotar ni filtrar |
| El agente alcanza un proyecto vecino | Lectura o escritura fuera del proyecto | `.claude/settings.json` acota el alcance (`SUITE-R39`) |
| Una regla del marco se relaja en el proyecto destino | El marco deja de garantizar lo que dice | `SUITE-R00`: el `CLAUDE.md` del proyecto parametriza, no legisla |

## La compuerta de secretos   `FND-R29`

Nace de dos incidentes reales, ambos documentados en la cabecera de la herramienta:

1. En la primera instalación real había **una contraseña de base de datos en claro** en el
   código de la API. Nada la miraba: `FDGE-R45` escaneaba la evidencia de un PT, y el árbol y el
   historial, nadie.
2. El primer `npm publish` de este mismo paquete listó un `.claude/settings.local.json` con la
   ruta absoluta de una máquina **dentro de un paquete público**. Lo cazó una persona leyendo la
   salida, no una comprobación.

Cómo funciona:

- Recorre el árbol de trabajo y, con `--historial`, los commits.
- **Bloquea y propone la corrección.** Un escáner que solo dice «hay un secreto» deja el trabajo
  entero a quien lo lee.
- Un falso positivo se **firma**, no se silencia:
  [SECRETOS-EXCEPCIONES.md](../implementation/SECRETOS-EXCEPCIONES.md), una fila por huella, con
  nombre, fecha y motivo. Una fila sin firmante no es una firma.
- La firma cubre una **huella que incluye el valor encontrado**: si el valor cambia, vuelve a
  bloquear. No es un permiso permanente sobre un archivo.
- Firmar **no oculta**: la excepción sigue apareciendo en cada revisión con quién la firmó, y
  solo deja de bloquear.

Estado hoy: 400 commits revisados, **7 hallazgos, los 7 firmados** por Alberto Martínez — todos
fixtures sintéticos del propio selftest, que existen para probar que el escáner los caza. Cero
hallazgos sin firmar.

> Por qué importa que la excepción se pueda firmar: la herramienta exigía firmar por escrito y
> no existía dónde. En este repositorio el escáner caza sus propios fixtures, así que la
> compuerta quedaba en **rojo permanente** — y una compuerta siempre roja enseña a saltársela.
> El día que apareciera un secreto de verdad, nadie miraría.

## La frontera del proyecto   `SUITE-R39`

Cauce es por proyecto y eso ya está resuelto; lo que ninguna regla escrita cercaba es **el
agente**. En la primera máquina donde se usó, el historial de permisos guarda órdenes concedidas
que alcanzaban un proyecto hermano.

Dos niveles, con lo que garantiza cada uno:

| Nivel | Qué garantiza |
|:---|:---|
| **Configuración de permisos** (`.claude/settings.json`) | Ataja el alcance accidental. Es una convención: depende de que el arnés la respete |
| **Contenedor** con solo esta raíz montada | Lo impone el núcleo del sistema operativo |

**Aquí se eligió el primero**, firmado en `G0` ([LAYOUT.md](../implementation/LAYOUT.md),
propuesta 1). Hay 92 proyectos hermanos alcanzables desde `..` y ningún contenedor. La
configuración declara `additionalDirectories: []` y deniega el acceso a almacenes de credenciales
—`~/.ssh`, `~/.aws`, `~/.azure`, la configuración de `gh`, las credenciales de Claude Code y
cualquier `.env`—.

Sus límites, dichos: las reglas `deny` aplican a las herramientas de archivo del agente y a los
comandos de archivo que reconoce en Bash; **no** a un subproceso arbitrario que abra archivos por
su cuenta. Para eso hace falta el contenedor. Y una regla que denegara el directorio padre
completo denegaría también este proyecto —`deny` gana sobre `allow` y no admite negación—, así
que el acotamiento descansa en que el directorio de trabajo es ya el alcance por defecto.

Cauce **no genera contenedores**: inventar un `Dockerfile` para un stack que no conoce es
imponer terreno, justo lo que `FND-R25` prohíbe.

Y las credenciales de publicación se quedan **fuera** de cualquier contenedor: `SUITE-R06a`
mantiene el merge y la publicación en manos humanas, y una credencial dentro del recinto
convertiría el recinto en el sitio desde donde se publica.

## Qué prueba una firma   `SUITE-R27`

Una firma es una **declaración de responsabilidad**, no una prueba criptográfica: el agente
escribe el archivo y podría escribir cualquier nombre. Por eso el `CLAUDE.md` declara
`firmantes:` y `verify-fdge` rechaza toda firma ajena a esa lista.

Lo que el marco garantiza: **hay un nombre concreto asociado a cada decisión irreversible, y ese
nombre estaba autorizado**. Lo que no puede garantizar: la voluntad detrás. Decirlo es parte del
control — un marco que prometiera más estaría mintiendo sobre su propia superficie.
