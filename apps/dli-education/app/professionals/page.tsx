import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DLI Professionals: Future Skills: De' Lead International",
  description: "DLI Professionals delivers future-skills and soft-skills training from De' Lead International: design thinking, leadership, communication, entrepreneurship, and applied Gen AI for educators and HR teams.",
  alternates: { canonical: '/professionals' },
  openGraph: { title: "DLI Professionals: Future Skills: De' Lead International", description: "DLI Professionals delivers future-skills and soft-skills training from De' Lead International: design thinking, leadership, communication, entrepreneurship, and applied Gen AI for educators and HR teams.", url: '/professionals' },
  twitter: { title: "DLI Professionals: Future Skills: De' Lead International", description: "DLI Professionals delivers future-skills and soft-skills training from De' Lead International: design thinking, leadership, communication, entrepreneurship, and applied Gen AI for educators and HR teams." },
};

import { S01_svg } from "@/components/professionals/S01_svg";
import { S02_nav } from "@/components/professionals/S02_nav";
import { S03_top } from "@/components/professionals/S03_top";
import { S04_section } from "@/components/professionals/S04_section";
import { S05_areas } from "@/components/professionals/S05_areas";
import { S06_genai } from "@/components/professionals/S06_genai";
import { S07_who } from "@/components/professionals/S07_who";
import { S08_section } from "@/components/professionals/S08_section";
import { S09_section } from "@/components/professionals/S09_section";
import { S10_ctaband } from "@/components/professionals/S10_ctaband";
import { S11_contact } from "@/components/professionals/S11_contact";
import { S12_footergrid } from "@/components/professionals/S12_footergrid";

export const revalidate = 3600;

export default function Page() {
  return (
    <>
      <S01_svg />
      <S02_nav />
      <S03_top />
      <S04_section />
      <S05_areas />
      <S06_genai />
      <S07_who />
      <S08_section />
      <S09_section />
      <S10_ctaband />
      <S11_contact />
      <S12_footergrid />
    </>
  );
}
