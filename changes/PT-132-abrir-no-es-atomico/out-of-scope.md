# Fuera de alcance — `PT-132`

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| Reabrir los dieciséis duplicados ya cerrados | Están cerrados con su nota marcada y el registro reclama el bueno. Reabrirlos sería ruido | — |
| Hacer transaccional el resto de `tracker` | Se arregla **el comando que duplicó**. Los demás quedan declarados y sin medir | — |
| Borrar un issue duplicado en vez de cerrarlo | La plataforma no lo permite sin permisos de admin, y `SUITE-R06` no lo contempla | — |
| Que `abrir` no dependa de la red | Imposible: espeja contra la plataforma por definición (`SUITE-R35`) | — |
| Que el issue adoptado sea el correcto | Un título repetido a mano también casa. Se declara en el contrato de la función: adoptar uno ajeno se ve en el espejo, duplicar no | — |
| Que `verify-fdge` corra con credencial en CI y vea esto | El espejo sí la lleva en los dos workflows; que `verify-fdge` la tenga es otra tarea | PT-120 |
