import { 
  PermissionResFields,
  NavItem,
  DataItem,
  ModuleNode
} from "@/types/rbac";


export function buildPermissionTreeNode(permissions: PermissionResFields[]): ModuleNode[] {
  const navItems: NavItem[] = [];
  const dataMap = new Map<string, DataItem>();

  const isNavAction = (action: string) => action.toLowerCase() === "view";
  const isDataAction = (action: string) =>
    ["read", "write", "delete", "update", "edit", "remove"].includes(action.toLowerCase());

  for (const perm of permissions) {
    const action = String(perm.action ?? "").toLowerCase();
    const parts = String(perm.module ?? "").split("/").filter(Boolean);

    // 导航名：module 最后一段（例如 导航栏/中间件管理 -> 中间件管理）
    const moduleName = parts.length > 0 ? parts[parts.length - 1] : "未命名模块";
    const id = Number(perm.id ?? 0);

    if (isNavAction(action)) {
      // 去重（同模块 + view）
      if (!navItems.some((n) => n.module === moduleName && n.action === action)) {
        navItems.push({
          id,
          module: moduleName,
          action,
          name: perm.name,
          code: perm.code,
        });
      }
      continue;
    }

    if (isDataAction(action)) {
      if (!dataMap.has(moduleName)) {
        dataMap.set(moduleName, { module: moduleName, actions: [] });
      }
      const item = dataMap.get(moduleName)!;

      // 去重（同模块 + 同 action + 同 code）
      if (!item.actions.some((a) => a.action === action && a.code === perm.code)) {
        item.actions.push({
          id,
          action,
          name: perm.name,
          code: perm.code,
        });
      }
    }
  }

  const result: ModuleNode[] = [];
  if (navItems.length > 0) {
    result.push({ node: "导航栏管理", nav: navItems });
  }
  if (dataMap.size > 0) {
    result.push({ node: "数据管理", data: Array.from(dataMap.values()) });
  }

  return result;
}




