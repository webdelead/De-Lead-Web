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
  size = "sm",
}: {
  vertical: string;
  value: string;
  initialUrl?: string;
  onChange: (id: string) => void;
  /** "lg" = the image is the point of this record (testimonials, cuttings,
   *  gallery…) — give it real space instead of a thumbnail-sized preview. */
  size?: "sm" | "lg";
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
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed");
      }
    });
  }

  const input = (
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
  );

  if (size === "lg") {
    return (
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="group relative flex aspect-[4/3] w-full max-w-xs items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted/40 transition-colors hover:border-primary/50"
        >
          {url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" draggable={false} className="h-full w-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-sm font-medium text-transparent transition-colors group-hover:bg-black/45 group-hover:text-white">
                {pending ? "Uploading…" : "Replace image"}
              </span>
            </>
          ) : (
            <span className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImagePlus className="h-7 w-7" />
              <span className="text-xs font-medium">
                {pending ? "Uploading…" : "Click to upload"}
              </span>
            </span>
          )}
        </button>
        {url && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              setUrl("");
              onChange("");
            }}
          >
            <X className="h-3.5 w-3.5" /> Remove image
          </Button>
        )}
        {input}
        <input type="hidden" value={value} readOnly />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {url ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" draggable={false} className="h-16 w-16 rounded border object-cover" />
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
      {input}
      <Button
        type="button"
        variant="outline"
        size="sm"
        loading={pending}
        onClick={() => inputRef.current?.click()}
      >
        {pending ? "Uploading…" : url ? "Replace" : "Upload"}
      </Button>
      <input type="hidden" value={value} readOnly />
    </div>
  );
}
