# Fuera de alcance — `PT-107`

```
OUT: hacer el registro concurrente
     Exigiria un bloqueo, y un bloqueo mal liberado deja el proyecto COLGADO — peor que el
     defecto. Lo que se arregla es que la perdida sea IMPOSIBLE DE NO VER, no que la carrera
     no ocurra.

OUT: fusionar dos versiones del registro
     Fusionar sin saber cual gana es como se pierde el dato que esto existe para no perder.
     Se DETIENE y se dice que repetir.

OUT: reintentar automaticamente
     Un reintento a ciegas repite efectos que YA ocurrieron —abrir un issue, escribir una
     nota en el tablero—. Lo decide quien mira.

OUT: escribir solo lo que cambio
     Rehacer la serializacion entera del registro, con mas superficie de error que el
     problema que resuelve.

OUT: CHECKPOINT.json y SESSION.json
     Se escriben con el mismo patron. Quedan DECLARADOS y sin medir: decir «no lo tienen»
     seria afirmar sin medir.
```
