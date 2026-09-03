import { S01_nav } from "@/components/S01_nav";
import { S02_top } from "@/components/S02_top";
import { S03_marquee } from "@/components/S03_marquee";
import { S04_trust } from "@/components/S04_trust";
import { S05_program } from "@/components/S05_program";
import { S06_story } from "@/components/S06_story";
import { S07_phases } from "@/components/S07_phases";
import { S08_impact } from "@/components/S08_impact";
import { S09_reality } from "@/components/S09_reality";
import { S10_projects } from "@/components/S10_projects";
import { S11_video } from "@/components/S11_video";
import { S12_voices } from "@/components/S12_voices";
import { S13_delead } from "@/components/S13_delead";
import { S14_cred } from "@/components/S14_cred";
import { S15_gallery } from "@/components/S15_gallery";
import { S16_stake } from "@/components/S16_stake";
import { S17_press } from "@/components/S17_press";
import { S18_partner } from "@/components/S18_partner";
import { S19_wrap } from "@/components/S19_wrap";
import { S20_lightbox } from "@/components/S20_lightbox";

// ISR: hourly rebuild ceiling; the dashboard Publish button hits
// /api/revalidate for instant refreshes.
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <S01_nav />
      <S02_top />
      <S03_marquee />
      <S04_trust />
      <S05_program />
      <S06_story />
      <S07_phases />
      <S08_impact />
      <S09_reality />
      <S10_projects />
      <S11_video />
      <S12_voices />
      <S13_delead />
      <S14_cred />
      <S15_gallery />
      <S16_stake />
      <S17_press />
      <S18_partner />
      <S19_wrap />
      <S20_lightbox />
    </>
  );
}
