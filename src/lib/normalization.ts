/**
 * Canonicalizes terminal input for navigation and grading.
 *
 * Empty Enter, RETURN, and 0 are equivalent menu-return actions. Exit is
 * case-insensitive. Numeric menu choices lose leading zeroes, while free text
 * is trimmed, whitespace-collapsed, and compared case-insensitively.
 */
export function normalizeTerminalInput(input: string): string {
  const trimmed = input.trim();

  if (trimmed === "" || /^return$/i.test(trimmed)) {
    return "0";
  }

  if (/^x$/i.test(trimmed)) {
    return "X";
  }

  if (/^\d+$/.test(trimmed)) {
    return String(Number.parseInt(trimmed, 10));
  }

  return trimmed.replace(/\s+/g, " ").toLocaleLowerCase("en-US");
}

export function normalizeMenuId(menuId: string): string {
  return menuId.trim().toLocaleLowerCase("en-US");
}

