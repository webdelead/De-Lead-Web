"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { inviteUser, sendUserReset, setUserAccess, setUserActive } from "@/lib/actions/users";

type Grant = { vertical: string; level: "view" | "edit" };
interface U {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  grants: Grant[];
}

function verticalName(list: { key: string; name: string }[], key: string) {
  return list.find((v) => v.key === key)?.name ?? key;
}

export function UsersView({
  users,
  verticals,
}: {
  users: U[];
  verticals: { key: string; name: string }[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [creating, setCreating] = useState(false);
  const [access, setAccess] = useState<U | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <Button size="sm" onClick={() => setCreating(true)}>
          Invite user
        </Button>
      </div>

      <div className="rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>Active</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <Badge variant={u.role === "super_admin" ? "default" : "secondary"}>
                    {u.role.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {u.role === "super_admin" ? (
                    <span className="text-muted-foreground">all verticals</span>
                  ) : u.grants.length === 0 ? (
                    <span className="text-muted-foreground">none</span>
                  ) : (
                    <span>
                      {u.grants
                        .map((g) => `${verticalName(verticals, g.vertical)} (${g.level})`)
                        .join(", ")}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={u.isActive}
                    onCheckedChange={(v) =>
                      start(async () => {
                        const r = await setUserActive(u.id, v);
                        if (!r.ok) toast.error(r.error);
                        else router.refresh();
                      })
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {u.role !== "super_admin" && (
                      <Button variant="outline" size="sm" onClick={() => setAccess(u)}>
                        Access
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={pending}
                      onClick={() =>
                        start(async () => {
                          const r = await sendUserReset(u.id);
                          if (r.ok) toast.success("Password-reset email sent.");
                          else toast.error(r.error);
                        })
                      }
                    >
                      Send reset
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {creating && (
        <InviteDialog
          onClose={() => setCreating(false)}
          onDone={() => {
            setCreating(false);
            router.refresh();
          }}
        />
      )}

      {access && (
        <AccessDialog
          user={access}
          verticals={verticals}
          onClose={() => setAccess(null)}
          onSaved={() => {
            setAccess(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function InviteDialog({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [pending, start] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"staff" | "super_admin">("staff");

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite user</DialogTitle>
          <DialogDescription>
            Supabase emails them a link to set their own password. Grant per-vertical access
            afterwards with “Access”.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="mb-1 block">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff (per-vertical access)</SelectItem>
                <SelectItem value="super_admin">Super admin (everything)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={pending || !name || !email}
            onClick={() =>
              start(async () => {
                const r = await inviteUser({ name, email, role });
                if (!r.ok) toast.error(r.error);
                else {
                  toast.success("Invitation email sent.");
                  onDone();
                }
              })
            }
          >
            Send invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AccessDialog({
  user,
  verticals,
  onClose,
  onSaved,
}: {
  user: U;
  verticals: { key: string; name: string }[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [pending, start] = useTransition();
  const [grants, setGrants] = useState<Record<string, "none" | "view" | "edit">>(() => {
    const g: Record<string, "none" | "view" | "edit"> = {};
    for (const v of verticals) g[v.key] = "none";
    for (const gr of user.grants) g[gr.vertical] = gr.level;
    return g;
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user.name} — access</DialogTitle>
          <DialogDescription>
            “View” = read only; “Edit” = manage content + publish. Leads follow the same grants.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {verticals.map((v) => (
            <div key={v.key} className="flex items-center justify-between">
              <span className="text-sm">{v.name}</span>
              <Select
                value={grants[v.key]}
                onValueChange={(val) => setGrants((s) => ({ ...s, [v.key]: val as never }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No access</SelectItem>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={pending}
            onClick={() =>
              start(async () => {
                const list = Object.entries(grants)
                  .filter(([, lvl]) => lvl !== "none")
                  .map(([vertical, level]) => ({ vertical, level: level as "view" | "edit" }));
                await setUserAccess({ userId: user.id, grants: list });
                toast.success("Access updated");
                onSaved();
              })
            }
          >
            Save access
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
