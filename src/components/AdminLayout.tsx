import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Briefcase, FileText, Mail, Edit, ArrowLeft, LogOut, Settings, Home, Sparkles, Wrench, Images, FilePenLine } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { messagesApi } from "@/lib/api";
import ThemeSwitcher from "./ThemeSwitcher";
import { Building2 } from "lucide-react";

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
  const { data: messages = [] } = useQuery({ queryKey: ["messages"], queryFn: messagesApi.getAll });
  const unread = messages.filter((m) => !m.read).length;

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 flex h-full w-56 flex-col overflow-y-auto border-r border-border bg-card">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <Link to="/" className="text-muted-foreground hover:text-primary"><ArrowLeft size={16} /></Link>
          <span className="font-heading text-sm font-bold text-foreground">Admin Panel</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            const showBadge = n.to === "/admin/messages" && unread > 0;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
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
      <main className="ml-56 flex-1">
        <div className="flex h-14 items-center justify-end gap-3 border-b border-border bg-card/50 px-8 backdrop-blur">
          <span className="text-xs text-muted-foreground">Quick theme</span>
          <ThemeSwitcher allowThemeControls persistChanges />
        </div>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
