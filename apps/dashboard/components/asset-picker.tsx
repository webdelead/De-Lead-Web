"use client";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadAsset } from "@/lib/actions/content";
import { ImagePlus, X } from "lucide-react";

export function AssetPicker({
  vertical,
  value,
  initialUrl,
  onChange,
}: {
  vertical: string;
  value: string;
  initialUrl?: string;
  onChange: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl ?? "");
  const [pending, start] = useTransition();

  function pick(file: File) {
    const fd = new FormData();
    fd.set("file", file);
    fd.set("vertical", vertical);
    start(async () => {
      try {
        const res = await uploadAsset(fd);
        onChange(res.id);
        setUrl(res.url);
        toast.success("Uploaded");
      } catch {
        toast.error("Upload failed");
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      {url ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="h-16 w-16 rounded border object-cover" />
          <button
            type="button"
            className="absolute -right-2 -top-2 rounded-full bg-background p-0.5 shadow"
            onClick={() => {
              setUrl("");
              onChange("");
            }}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded border border-dashed text-muted-foreground">
          <ImagePlus className="h-5 w-5" />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) pick(f);
        }}
      />
      <Button type="button" variant="outline" size="sm" disabled={pending} onClick={() => inputRef.current?.click()}>
        {pending ? "Uploading…" : url ? "Replace" : "Upload"}
      </Button>
      <input type="hidden" value={value} readOnly />
    </div>
  );
}
