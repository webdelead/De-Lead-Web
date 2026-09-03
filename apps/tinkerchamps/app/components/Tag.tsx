"use client";

export default function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 bg-[#3E136D] text-white px-4 py-2 rounded-full">
      {children}
    </span>
  );
}
