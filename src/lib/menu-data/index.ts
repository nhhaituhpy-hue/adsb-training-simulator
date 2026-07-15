import type { LoginUser } from "../types";
import { MA_MENUS, MA_ROOT_MENU_ID } from "./ma-menus";
import type { MenuTree } from "./menu-types";
import { SA_MENUS, SA_ROOT_MENU_ID } from "./sa-menus";

export interface MenuDefinition {
  rootMenuId: string;
  menus: MenuTree;
}

export function getMenuDefinition(loginUser: LoginUser): MenuDefinition {
  if (loginUser === "sysadmin") {
    return { rootMenuId: SA_ROOT_MENU_ID, menus: SA_MENUS };
  }

  return { rootMenuId: MA_ROOT_MENU_ID, menus: MA_MENUS };
}

export { MA_MENUS, MA_ROOT_MENU_ID } from "./ma-menus";
export type {
  MenuAction,
  MenuHeader,
  MenuItem,
  MenuItemNumber,
  MenuNode,
  MenuTree,
  ToggleOption,
} from "./menu-types";
export { SA_MENUS, SA_ROOT_MENU_ID } from "./sa-menus";

