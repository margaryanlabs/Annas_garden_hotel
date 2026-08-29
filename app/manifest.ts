import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Anna's Garden Hotel Tbilisi",
    short_name: "Anna's Garden",
    description: "A quiet, modern hotel stay in Tbilisi, Georgia.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f0e8",
    theme_color: "#203127",
    orientation: "portrait-primary",
  };
}
