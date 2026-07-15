"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GearSix,
  House,
  List,
  SidebarSimple,
  Student,
  UserCircle,
  X,
  type Icon,
} from "@phosphor-icons/react";
import { useState, type ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

type NavigationItem = {
  href: string;
  label: string;
  icon: Icon;
};

const navigationItems: NavigationItem[] = [
  { href: "/", label: "Trang chủ", icon: House },
  { href: "/admin", label: "Quản trị", icon: GearSix },
  { href: "/student", label: "Học viên", icon: Student },
];

function BrandWordmark() {
  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-baseline rounded px-1 py-1 font-semibold tracking-[-0.04em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
      aria-label="ATTECH, về trang chủ"
    >
      <span className="text-[#b91c1c]">A</span>
      <span className="text-[var(--accent)]">TTECH</span>
    </Link>
  );
}

function isItemActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

function Navigation({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Điều hướng chính" className="grid gap-1">
      {navigationItems.map((item) => {
        const active = isItemActive(pathname, item.href);
        const ItemIcon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            title={collapsed ? item.label : undefined}
            className={`group relative flex min-h-11 items-center gap-3 rounded border-l-2 px-3 text-sm font-medium transition-[background-color,color,border-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-inset motion-reduce:transition-none ${
              active
                ? "border-[var(--accent)] bg-white text-[var(--accent)]"
                : "border-transparent text-[var(--text-secondary)] hover:bg-white hover:text-[var(--text-primary)]"
            } ${collapsed ? "justify-center px-2" : ""}`}
          >
            <ItemIcon aria-hidden size={20} weight="regular" />
            <span className={collapsed ? "sr-only" : "truncate"}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const showDesktopSidebar = pathname !== "/";

  return (
    <div className="min-h-[100dvh] bg-[var(--background)] text-[var(--foreground)]">
      <a
        href="#main-content"
        className="fixed left-3 top-3 z-50 -translate-y-20 rounded bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 motion-reduce:transition-none"
      >
        Chuyển đến nội dung chính
      </a>

      <header className="app-glass sticky top-0 z-30 h-16 border-b border-[var(--border)]">
        <div className="relative z-10 flex h-full items-center gap-3 px-4 sm:px-5">
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded text-[var(--text-primary)] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] md:hidden"
            aria-label="Mở điều hướng"
            aria-controls="mobile-navigation"
            aria-expanded={mobileNavigationOpen}
            onClick={() => setMobileNavigationOpen(true)}
          >
            <List aria-hidden size={21} weight="regular" />
          </button>

          <BrandWordmark />

          <div className="min-w-0 border-l border-[var(--border-strong)] pl-3">
            <p className="hidden truncate text-xs font-medium text-[var(--text-secondary)] sm:block">
              Trung tâm Bảo đảm kỹ thuật
            </p>
            <p className="truncate text-sm font-semibold text-[var(--accent)] sm:text-base">
              Hệ thống kiểm tra mô phỏng ADS-B
            </p>
          </div>

          <div className="ml-auto hidden shrink-0 items-center gap-2 text-sm text-[var(--text-secondary)] sm:flex">
            <UserCircle aria-hidden size={20} weight="regular" />
            <span>Không gian đào tạo</span>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100dvh-4rem)]">
        <aside
          className={`app-glass sticky top-16 hidden h-[calc(100dvh-4rem)] shrink-0 border-r border-[var(--border)] transition-[width] duration-200 md:flex-col motion-reduce:transition-none ${
            showDesktopSidebar ? "md:flex" : "md:hidden"
          } ${
            sidebarCollapsed ? "w-16" : "w-60"
          }`}
          aria-label="Thanh điều hướng"
        >
          <div className="relative z-10 flex h-full flex-col p-3">
            <button
              type="button"
              className={`mb-4 inline-flex size-10 items-center justify-center rounded text-[var(--text-secondary)] hover:bg-white hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                sidebarCollapsed ? "self-center" : "self-end"
              }`}
              onClick={() => setSidebarCollapsed((current) => !current)}
              aria-label={
                sidebarCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"
              }
              aria-expanded={!sidebarCollapsed}
            >
              <SidebarSimple aria-hidden size={21} weight="regular" />
            </button>

            <Navigation collapsed={sidebarCollapsed} />

            <div
              className={`mt-auto border-t border-[var(--border-strong)] pt-4 text-xs text-[var(--text-muted)] ${
                sidebarCollapsed ? "text-center" : "px-3"
              }`}
            >
              {sidebarCollapsed ? (
                <span aria-label="Công cụ đào tạo ADS-B">ADS-B</span>
              ) : (
                <span>Công cụ đào tạo ADS-B</span>
              )}
            </div>
          </div>
        </aside>

        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1">
          {children}
        </main>
      </div>

      {mobileNavigationOpen ? (
        <div
          className="fixed inset-0 top-16 z-40 md:hidden"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setMobileNavigationOpen(false);
            }
          }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#171717]/20"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setMobileNavigationOpen(false)}
          />
          <aside
            id="mobile-navigation"
            className="app-glass relative h-full w-[min(19rem,88vw)] border-r border-[var(--border)] shadow-[var(--shadow-panel)]"
            aria-label="Điều hướng trên thiết bị di động"
          >
            <div className="relative z-10 flex h-full flex-col p-4">
              <div className="mb-5 flex items-center justify-between border-b border-[var(--border-strong)] pb-4">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Điều hướng
                </span>
                <button
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded text-[var(--text-secondary)] hover:bg-white hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  aria-label="Đóng điều hướng"
                  onClick={() => setMobileNavigationOpen(false)}
                >
                  <X aria-hidden size={20} weight="regular" />
                </button>
              </div>
              <Navigation onNavigate={() => setMobileNavigationOpen(false)} />
              <p className="mt-auto border-t border-[var(--border-strong)] pt-4 text-xs text-[var(--text-muted)]">
                Công cụ đào tạo ADS-B
              </p>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
