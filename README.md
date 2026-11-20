# shadcn-ng

CLI que distribuye código, configuración y recursos para proyectos Angular desde un registry estático.

El producto es la CLI. El Registry distribuye recursos. El Installer Engine conecta ambos. `button` es la única prueba de integración del MVP.

## Estado

Versión `0.1.0`, pre-1.0. Publicación prevista con `--tag beta` o `--tag next`. `latest` queda intacto hasta GA.

## Comandos del MVP

```text
init
info
add <items...>
view <items...>
search [query]
list
diff <items...>
build [registry]
```

## Desarrollo

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm typecheck
pnpm test:run
pnpm lint
```

## Estructura

```text
packages/shared            hashing, URLs, redacción y errores
packages/core              detección, config, registry, resolver e installer
packages/registry-builder  generador determinista del registry
packages/fixtures          utilidades de testing
registry/                  fuente del único item del MVP
legacy/                    código 1.x conservado con su historial
docs/                      arquitectura, decisiones y progreso
```

## Advertencias

- El código anterior vive en `legacy/`. No se reescribió el historial de Git.
- Los paquetes bajo `packages/*` son privados y se inlinen en `dist`.
- Este README documenta la línea `0.1.0`. La documentación `1.x` está en `legacy/README.md`.
