import { S01_top } from "@/components/S01_top";
import { S02_hero } from "@/components/S02_hero";
import { S03_facts } from "@/components/S03_facts";
import { S04_statement } from "@/components/S04_statement";
import { S05_about } from "@/components/S05_about";
import { S06_programmes } from "@/components/S06_programmes";
import { S07_section } from "@/components/S07_section";
import { S08_approach } from "@/components/S08_approach";
import { S09_trackrecord } from "@/components/S09_trackrecord";
import { S10_testimonials } from "@/components/S10_testimonials";
import { S11_team } from "@/components/S11_team";
import { S12_gallery } from "@/components/S12_gallery";
import { S13_cta } from "@/components/S13_cta";
import { S14_contact } from "@/components/S14_contact";
import { S15_wrap } from "@/components/S15_wrap";

// ISR: hourly ceiling; dashboard Publish hits /api/revalidate for instant refresh.
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <S01_top />
      <S02_hero />
      <S03_facts />
      <S04_statement />
      <S05_about />
      <S06_programmes />
      <S07_section />
      <S08_approach />
      <S09_trackrecord />
      <S10_testimonials />
      <S11_team />
      <S12_gallery />
      <S13_cta />
      <S14_contact />
      <S15_wrap />
    </>
  );
}
