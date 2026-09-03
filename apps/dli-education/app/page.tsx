import { S01_sec } from "@/components/index/S01_sec";
import { S02_nav } from "@/components/index/S02_nav";
import { S03_top } from "@/components/index/S03_top";
import { S04_audiences } from "@/components/index/S04_audiences";
import { S05_section } from "@/components/index/S05_section";
import { S06_learn } from "@/components/index/S06_learn";
import { S07_courses } from "@/components/index/S07_courses";
import { S08_outcomes } from "@/components/index/S08_outcomes";
import { S09_section } from "@/components/index/S09_section";
import { S10_section } from "@/components/index/S10_section";
import { S11_ctaband } from "@/components/index/S11_ctaband";
import { S12_contact } from "@/components/index/S12_contact";
import { S13_footergrid } from "@/components/index/S13_footergrid";

export const revalidate = 3600;

export default function Page() {
  return (
    <>
      <S01_sec />
      <S02_nav />
      <S03_top />
      <S04_audiences />
      <S05_section />
      <S06_learn />
      <S07_courses />
      <S08_outcomes />
      <S09_section />
      <S10_section />
      <S11_ctaband />
      <S12_contact />
      <S13_footergrid />
    </>
  );
}
