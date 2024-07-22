import { blocks } from "./blocks";
import { charts } from "./charts";
import { examples } from "./examples";
import type { Registry } from "./schema";
import { ui } from "./ui";

export const registry: Registry = [...ui, ...examples, ...blocks, ...charts];
