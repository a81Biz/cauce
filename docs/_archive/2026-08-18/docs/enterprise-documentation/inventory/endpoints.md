# inventory/endpoints — no aplica

> Foundation `PHASE 5` · 2026-08-13

**Este sistema no expone endpoints.** No hay API HTTP, ni RPC, ni cola de mensajes. Por eso el
paquete de Foundation omite `08-API-Catalog.md`, que es su documento condicional
([README.md](../README.md#documentos-omitidos-y-por-qué)).

Las únicas comunicaciones con el exterior son procesos invocados —`git`, `gh`, `npm`— y están en
[integrations.md](integrations.md).

Este archivo existe para que la ausencia sea **declarada** (`SUITE-R32`): «no aplica» y «no se
miró» tienen que poder distinguirse.
