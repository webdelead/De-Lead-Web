import { getSession } from "@/lib/authz";
import { buildNav } from "@/lib/nav";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const groups = buildNav(session);

  return (
    <div className="grid h-screen grid-rows-[auto_1fr] md:grid-cols-[240px_1fr] md:grid-rows-1">
      <aside className="hidden border-r bg-sidebar md:block">
        <Sidebar groups={groups} />
      </aside>
      <div className="flex min-h-0 flex-col">
        <Topbar
          name={session.user.name ?? "User"}
          email={session.user.email ?? ""}
          role={session.user.role}
        />
        <main className="min-h-0 flex-1 overflow-y-auto bg-muted/20 p-6">{children}</main>
      </div>
    </div>
  );
}
