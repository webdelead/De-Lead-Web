import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tinkerchamps",
    short_name: "Tinkerchamps",
    description: "Rewiring young minds for a limitless future",
    start_url: "/",
    display: "standalone",
    background_color: "#562190",
    theme_color: "#562190",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/assets/TCLogo.webp",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
