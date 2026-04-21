"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  GraduationCap,
  Layers,
  Video,
  Calendar,
  BookOpen,
  ClipboardList,
  Star,
  Folder,
  Settings,
  LifeBuoy,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role?: "admin" | "teacher";
}

export function Sidebar({ role = "admin" }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    Staff: true,
    Curriculum: true,
  });

  const pathname = usePathname();

  const toggleMenu = (name: string) => {
    setExpandedMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const adminNavGroups = [
    {
      label: "OVERVIEW",
      items: [{ name: "Dashboard", icon: LayoutGrid, path: "/dashboard" }],
    },
    {
      label: "PEOPLE",
      items: [
        {
          name: "Staff",
          icon: Users,
          subItems: [
            { name: "Teachers", path: "/teachers" },
            { name: "Supervisors", path: "/supervisors" },
            { name: "Admins", path: "/admins" },
          ],
        },
        { name: "Students", icon: GraduationCap, path: "/students" },
        { name: "Age Groups", icon: Layers, path: "/age-groups" },
      ],
    },
    {
      label: "LEARNING",
      items: [
        { name: "Sessions", icon: Video, path: "/sessions", badge: 3 },
        { name: "Calendar", icon: Calendar, path: "/calendar" },
        {
          name: "Curriculum",
          icon: BookOpen,
          subItems: [
            { name: "Subjects", path: "/admin/curriculum" },
            { name: "Plan Templates", path: "/admin/study-plans/templates" },
          ],
        },
      ],
    },
    {
      label: "QUALITY",
      items: [
        { name: "Attendance", icon: ClipboardList, path: "/admin/attendance" },
        { name: "Evaluations", icon: Star, path: "/admin/evaluations" },
      ],
    },
    {
      label: "CONTENT",
      items: [
        { name: "Content Library", icon: Folder, path: "/admin/content" },
      ],
    },
    {
      label: "SYSTEM",
      items: [{ name: "Settings", icon: Settings, path: "/admin/settings" }],
    },
  ];

  const teacherNavGroups = [
    {
      label: "OVERVIEW",
      items: [{ name: "Dashboard", icon: LayoutGrid, path: "/dashboard" }],
    },
    {
      label: "MY WORK",
      items: [
        {
          name: "My Students",
          icon: GraduationCap,
          path: "/teacher/students",
          badge: 12,
        },
        { name: "Sessions", icon: Video, path: "/sessions", badge: 2 },
        { name: "Calendar", icon: Calendar, path: "/calendar" },
      ],
    },
    {
      label: "PROGRESS",
      items: [
        { name: "Study Plans", icon: BookOpen, path: "/teacher/study-plans" },
        {
          name: "Attendance",
          icon: ClipboardList,
          path: "/teacher/attendance",
        },
      ],
    },
    {
      label: "PROFILE",
      items: [
        { name: "My Profile", icon: Users, path: "/profile" },
        {
          name: "My Webmail",
          icon: Folder,
          path: "https://mail.miharab.com",
          external: true,
        },
      ],
    },
  ];

  const navGroups = role === "admin" ? adminNavGroups : teacherNavGroups;

  // Helper to check if a path is active (exact match for root, startsWith for nested)
  const isActivePath = (path: string, exact: boolean = false) => {
    if (exact) return pathname === path;
    return pathname.startsWith(path);
  };

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
            <span className="text-white font-arabic font-bold text-lg leading-none">
              م
            </span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-arabic font-bold text-lg leading-tight text-admin-text-primary">
                محراب
              </span>
              <span className="text-[10px] text-admin-text-muted uppercase tracking-wider">
                {role === "admin" ? "Admin Panel" : "Teacher Panel"}
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
              {group.items.map((item: any, itemIdx) => (
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
                          {item.subItems.map((subItem: any) => {
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
                      href={item.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 mx-2 rounded-md text-sm font-medium transition-colors group relative",
                        collapsed && "justify-center px-0 mx-2",
                        isActivePath(item.path, item.path === "/dashboard")
                          ? "bg-admin-primary-light text-admin-primary"
                          : "text-admin-text-secondary hover:bg-admin-hover",
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      {isActivePath(item.path, item.path === "/dashboard") && (
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-admin-primary rounded-r-full -ml-2" />
                      )}
                      <item.icon
                        className={cn(
                          "w-5 h-5 shrink-0",
                          isActivePath(item.path, item.path === "/dashboard")
                            ? "text-admin-primary"
                            : "text-admin-text-secondary",
                        )}
                      />
                      {!collapsed && (
                        <span className="flex-1">{item.name}</span>
                      )}
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
