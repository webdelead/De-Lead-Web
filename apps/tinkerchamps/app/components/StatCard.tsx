"use client";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

export default function StatCard({ icon, title, text }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 bg-[#3E136D] rounded-xl px-6 py-5">
      <div className="text-purple-300 text-xl">{icon}</div>

      <div>
        <h3 className="text-[#FBC333] text-3xl font-bold">{title}</h3>
        <p className="text-white/70 text-base">{text}</p>
      </div>
    </div>
  );
}
