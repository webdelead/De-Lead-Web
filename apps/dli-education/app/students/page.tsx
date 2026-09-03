import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DLI Students: Technology Courses: De' Lead International",
  description: "DLI Students is the technology education catalogue of De' Lead International: Python, web development, data, robotics, 3D design, Gen AI and block coding for kids. Mentor-led, project-first, online or offline.",
  alternates: { canonical: '/students' },
  openGraph: { title: "DLI Students: Technology Courses: De' Lead International", description: "DLI Students is the technology education catalogue of De' Lead International: Python, web development, data, robotics, 3D design, Gen AI and block coding for kids. Mentor-led, project-first, online or offline.", url: '/students' },
  twitter: { title: "DLI Students: Technology Courses: De' Lead International", description: "DLI Students is the technology education catalogue of De' Lead International: Python, web development, data, robotics, 3D design, Gen AI and block coding for kids. Mentor-led, project-first, online or offline." },
};

import { S01_svg } from "@/components/students/S01_svg";
import { S02_nav } from "@/components/students/S02_nav";
import { S03_top } from "@/components/students/S03_top";
import { S04_section } from "@/components/students/S04_section";
import { S05_catalogue } from "@/components/students/S05_catalogue";
import { S06_delivery } from "@/components/students/S06_delivery";
import { S07_heroes } from "@/components/students/S07_heroes";
import { S08_section } from "@/components/students/S08_section";
import { S09_ctaband } from "@/components/students/S09_ctaband";
import { S10_contact } from "@/components/students/S10_contact";
import { S11_footergrid } from "@/components/students/S11_footergrid";

export const revalidate = 3600;

export default function Page() {
  return (
    <>
      <S01_svg />
      <S02_nav />
      <S03_top />
      <S04_section />
      <S05_catalogue />
      <S06_delivery />
      <S07_heroes />
      <S08_section />
      <S09_ctaband />
      <S10_contact />
      <S11_footergrid />
    </>
  );
}
