"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";
import { getNavGroups, getPanelLabel } from "@/lib/auth/nav";
import type { Database } from "@/lib/supabase/database.types";

type UserRole = Database["public"]["Enums"]["user_role"];

interface SidebarProps {
  role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    Staff: true,
    Curriculum: true,
  });

  const pathname = usePathname();
  const navGroups = getNavGroups(role);
  const panelLabel = getPanelLabel(role);

  const toggleMenu = (name: string) => {
    setExpandedMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const isActivePath = (path: string, exact = false) =>
    exact ? pathname === path : pathname.startsWith(path);

  return (
    <aside
      className={cn(
        "relative h-full bg-admin-surface border-r border-admin-border transition-all duration-300 flex flex-col z-40",
        collapsed ? "w-[64px]" : "w-[240px]",
      )}
    >
      {/* Header */}
      <div className="p-6 flex flex-col items-center border-b border-admin-border">
        <div className="flex items-center gap-3 w-full">
          <div className="w-8 h-8 bg-admin-primary rounded flex items-center justify-center shrink-0">
            <span className="text-white font-arabic font-bold text-lg leading-none">م</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-arabic font-bold text-lg leading-tight text-admin-text-primary">
                محراب
              </span>
              <span className="text-[10px] text-admin-text-muted uppercase tracking-wider">
                {panelLabel}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-hide">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            {!collapsed && (
              <h3 className="px-4 text-[10px] font-semibold text-admin-text-muted uppercase tracking-wider mb-2">
                {group.label}
              </h3>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item, itemIdx) => (
                <li key={itemIdx}>
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-2 mx-2 rounded-md text-sm font-medium transition-colors group",
                          collapsed && "justify-center px-0 mx-2",
                          "text-admin-text-secondary hover:bg-admin-hover",
                        )}
                        title={collapsed ? item.name : undefined}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 shrink-0" />
                          {!collapsed && <span>{item.name}</span>}
                        </div>
                        {!collapsed &&
                          (expandedMenus[item.name] ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          ))}
                      </button>

                      {!collapsed && expandedMenus[item.name] && (
                        <ul className="mt-1 mb-2 space-y-0.5">
                          {item.subItems.map((subItem) => {
                            const active = isActivePath(subItem.path);
                            return (
                              <li key={subItem.name}>
                                <Link
                                  href={subItem.path}
                                  className={cn(
                                    "flex items-center pl-12 pr-4 py-2 mx-2 rounded-md text-sm font-medium transition-colors relative",
                                    active
                                      ? "bg-admin-primary-light text-admin-primary"
                                      : "text-admin-text-secondary hover:bg-admin-hover",
                                  )}
                                >
                                  {active && (
                                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-admin-primary rounded-r-full -ml-2" />
                                  )}
                                  <span>{subItem.name}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  ) : item.external ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 mx-2 rounded-md text-sm font-medium text-admin-text-secondary hover:bg-admin-hover transition-colors group",
                        collapsed && "justify-center px-0 mx-2",
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!collapsed && <span>{item.name}</span>}
                    </a>
                  ) : (
                    <Link
                      href={item.path!}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 mx-2 rounded-md text-sm font-medium transition-colors group relative",
                        collapsed && "justify-center px-0 mx-2",
                        isActivePath(item.path!, item.path === "/dashboard")
                          ? "bg-admin-primary-light text-admin-primary"
                          : "text-admin-text-secondary hover:bg-admin-hover",
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      {isActivePath(item.path!, item.path === "/dashboard") && (
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-admin-primary rounded-r-full -ml-2" />
                      )}
                      <item.icon
                        className={cn(
                          "w-5 h-5 shrink-0",
                          isActivePath(item.path!, item.path === "/dashboard")
                            ? "text-admin-primary"
                            : "text-admin-text-secondary",
                        )}
                      />
                      {!collapsed && <span className="flex-1">{item.name}</span>}
                      {!collapsed && item.badge && (
                        <span className="bg-admin-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-admin-border flex flex-col gap-2">
        <a
          href="#"
          className={cn(
            "flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium text-admin-text-secondary hover:bg-admin-hover transition-colors",
            collapsed && "justify-center",
          )}
          title={collapsed ? "Help & Docs" : undefined}
        >
          <LifeBuoy className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Help & Docs</span>}
        </a>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium text-admin-text-secondary hover:bg-admin-hover transition-colors",
            collapsed && "justify-center",
          )}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 shrink-0" />
          ) : (
            <ChevronLeft className="w-5 h-5 shrink-0" />
          )}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
