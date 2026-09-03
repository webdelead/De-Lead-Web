import { S01_nav } from "@/components/S01_nav";
import { S02_top } from "@/components/S02_top";
import { S03_about } from "@/components/S03_about";
import { S04_invite } from "@/components/S04_invite";
import { S05_section } from "@/components/S05_section";
import { S06_modules } from "@/components/S06_modules";
import { S07_backers } from "@/components/S07_backers";
import { S08_safety } from "@/components/S08_safety";
import { S09_gallery } from "@/components/S09_gallery";
import { S10_testimonials } from "@/components/S10_testimonials";
import { S11_enquire } from "@/components/S11_enquire";
import { S12_footer } from "@/components/S12_footer";

// ISR: hourly ceiling; dashboard Publish hits /api/revalidate for instant refresh.
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <S01_nav />
      <S02_top />
      <S03_about />
      <S04_invite />
      <S05_section />
      <S06_modules />
      <S07_backers />
      <S08_safety />
      <S09_gallery />
      <S10_testimonials />
      <S11_enquire />
      <S12_footer />
    </>
  );
}
