import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Users, Briefcase, Mail, FileText, ArrowRight, Loader2, type LucideIcon } from "lucide-react";
import { teamApi, jobsApi, messagesApi, applicationsApi } from "@/lib/api";

const StatCard = ({
  label,
  value,
  icon: Icon,
  to,
  highlight,
  loading,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  to: string;
  highlight?: boolean;
  loading?: boolean;
}) => (
  <Link
    to={to}
    className={`group relative flex flex-col gap-3 rounded-xl border p-5 transition-all hover:shadow-lg ${
      highlight
        ? "border-primary/40 bg-primary/5 hover:bg-primary/10"
        : "border-border bg-card hover:border-primary/30"
    }`}
  >
    <div className="flex items-center justify-between">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          highlight ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
        }`}
      >
        <Icon size={18} />
      </div>
      <ArrowRight
        size={16}
        className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
      />
    </div>
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-3xl font-bold text-foreground">
        {loading ? <Loader2 size={20} className="animate-spin" /> : value}
      </p>
    </div>
  </Link>
);

const AdminDashboard = () => {
  const team = useQuery({ queryKey: ["team"], queryFn: teamApi.getAll });
  const jobs = useQuery({ queryKey: ["jobs"], queryFn: jobsApi.getAll });
  const messages = useQuery({ queryKey: ["messages"], queryFn: messagesApi.getAll });
  const apps = useQuery({ queryKey: ["applications"], queryFn: applicationsApi.getAll });

  const unreadMessages = (messages.data || []).filter((m) => !m.read).length;
  const openJobs = (jobs.data || []).filter((j) => j.status === "open").length;
  const pendingApps = (apps.data || []).filter((a) => a.status === "pending").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back. Here's what's happening across your site.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Unread messages"
          value={unreadMessages}
          icon={Mail}
          to="/admin/messages"
          highlight={unreadMessages > 0}
          loading={messages.isLoading}
        />
        <StatCard
          label="Team members"
          value={team.data?.length ?? 0}
          icon={Users}
          to="/admin/team"
          loading={team.isLoading}
        />
        <StatCard
          label="Open jobs"
          value={`${openJobs} / ${jobs.data?.length ?? 0}`}
          icon={Briefcase}
          to="/admin/jobs"
          loading={jobs.isLoading}
        />
        <StatCard
          label="Applications"
          value={pendingApps}
          icon={FileText}
          to="/admin/applications"
          loading={apps.isLoading}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-foreground">Recent messages</h2>
            <Link to="/admin/messages" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          {messages.isLoading ? (
            <Loader2 size={16} className="animate-spin text-muted-foreground" />
          ) : (messages.data || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          ) : (
            <ul className="space-y-2">
              {(messages.data || []).slice(0, 5).map((m) => (
                <li
                  key={m.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                >
                  <Mail
                    size={14}
                    className={m.read ? "text-muted-foreground" : "text-primary"}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{m.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{m.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-foreground">Active jobs</h2>
            <Link to="/admin/jobs" className="text-xs text-primary hover:underline">
              Manage
            </Link>
          </div>
          {jobs.isLoading ? (
            <Loader2 size={16} className="animate-spin text-muted-foreground" />
          ) : (jobs.data || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No jobs posted.</p>
          ) : (
            <ul className="space-y-2">
              {(jobs.data || []).slice(0, 5).map((j) => (
                <li
                  key={j.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                >
                  <Briefcase size={14} className="text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{j.title}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {j.location} · {j.status}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
