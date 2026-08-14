# PT-037 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`CASOS-DE-USO.md`: **28 casos en seis familias**, cada uno con entrada, recorrido, fin y qué es
humano. Y **cuatro huecos declarados**.

## Por qué el catálogo va antes que el manual

Escribir sin la lista produce un manual que cubre **lo que se me ocurrió** — que es exactamente
lo que había repartido en cuatro archivos. La lista es el contrato: un caso que no esté es un
hueco declarado, no un silencio.

## Lo que me obligó a admitir

Escribiendo `F3` tuve que poner que **Azure no está ejercitado**. Existe el adaptador y no hay
proyecto que lo use, así que presentarlo como soportado sería lo mismo que un verde falso. Está
en los huecos, con su tarea.

Y `A4` —el proyecto legado— tuvo que decir que la migración deja el proyecto en **modo
restringido**. Es la verdad y no queda bien: significa que migrar no es «un rato al principio»,
es la primera sesión entera.

## Lo que un revisor debería atacar

**1 · Ningún caso puede probar que el catálogo esté completo.** Los casos comprueban que cubre lo
que sabemos que existe. Que no falte uno que nadie ha pensado no es demostrable, y por eso el
documento termina diciendo que un caso nuevo entra como `PT`.

**2 · Agrupé por intención y no por componente.** Alguien que ya conoce FDGE, QA y PTSA puede
encontrarlo peor organizado. Es deliberado: quien llega no sabe qué es FDGE.

**3 · Los huecos son los que yo conozco.** Un hueco que no sé que existe no está declarado, y
llamarlos «huecos declarados» puede leerse como «estos son todos».

SELF_REVIEW_COMPLETE
