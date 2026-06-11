import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Mail,
  Edit,
  ArrowLeft,
  LogOut,
  Settings,
  Home,
  Sparkles,
  Wrench,
  Images,
  FilePenLine,
  Building2,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { messagesApi } from "@/lib/api";
import ThemeSwitcher from "./ThemeSwitcher";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/home", label: "Home Content", icon: Home },
  { to: "/admin/works", label: "Works", icon: Sparkles },
  { to: "/admin/project-details", label: "Project Details", icon: FilePenLine },
  { to: "/admin/services", label: "What We Do", icon: Wrench },
  { to: "/admin/inside", label: "Life at citizen infotech", icon: Images },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { to: "/admin/applications", label: "Applications", icon: FileText },
  { to: "/admin/pages", label: "Page Editor", icon: Edit },
  { to: "/admin/settings", label: "Theme & Settings", icon: Settings },
  { to: "/admin/departments", label: "Departments", icon: Building2 },
];

const AdminLayout = () => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: messages = [] } = useQuery({ queryKey: ["messages"], queryFn: messagesApi.getAll });
  const unread = messages.filter((m) => !m.read).length;

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-56 flex-col overflow-y-auto border-r border-border bg-card transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              <ArrowLeft size={16} />
            </Link>
            <span className="font-heading text-sm font-bold text-foreground">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            const showBadge = n.to === "/admin/messages" && unread > 0;
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <n.icon size={16} />
                <span className="flex-1">{n.label}</span>
                {showBadge && (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="m-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <LogOut size={16} /> Sign out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="min-h-screen flex-1 md:ml-56 flex flex-col">
        {/* Header Toolbar */}
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-card/50 px-4 md:px-8 backdrop-blur">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground md:hidden hover:bg-secondary"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>

          {/* Spacer when on desktop to push theme switch to right */}
          <div className="hidden md:block" />

          {/* Quick Theme Controls */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">Quick theme</span>
            <ThemeSwitcher allowThemeControls persistChanges />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 md:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
