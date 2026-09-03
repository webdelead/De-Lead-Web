import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export default function Forbidden() {
  return (
    <div className="mx-auto max-w-md space-y-4 py-20 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">No access</h1>
      <Alert variant="destructive" title="You don't have permission to view this" className="text-left">
        Your account isn&apos;t granted access to this vertical. Ask a super admin to add a
        <span className="font-medium text-foreground"> view</span> or
        <span className="font-medium text-foreground"> edit</span> grant for it under
        Admin → Users.
      </Alert>
      <Button asChild variant="outline">
        <Link href="/">Back to dashboard</Link>
      </Button>
    </div>
  );
}
