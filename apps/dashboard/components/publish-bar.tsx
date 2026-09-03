"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { publishVertical } from "@/lib/actions/content";
import { UploadCloud } from "lucide-react";

export function PublishBar({ vertical, canEdit }: { vertical: string; canEdit: boolean }) {
  const [pending, start] = useTransition();
  if (!canEdit) return null;
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() =>
        start(async () => {
          try {
            const r = await publishVertical(vertical as never);
            toast.success(
              r.triggered ? "Site rebuilding — live in ~1 min" : "Marked published (no deploy hook set)",
            );
          } catch {
            toast.error("Publish failed");
          }
        })
      }
    >
      <UploadCloud className="h-4 w-4" /> {pending ? "Publishing…" : "Publish to site"}
    </Button>
  );
}
