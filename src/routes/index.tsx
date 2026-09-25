import { createFileRoute } from "@tanstack/react-router";
import { PublicSite } from "@/components/afrostate/PublicSite";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "AFROSTATE — The State Is Coming" },
    { name: "description", content: "Fashion is a state of mind. Click the link to join the state." },
    { property: "og:title", content: "AFROSTATE — The State Is Coming" },
    { property: "og:description", content: "Fashion is a state of mind. Click the link to join the state." },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "https://afrostate.vercel.app/og-image.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: "https://afrostate.vercel.app/og-image.jpg" },
  ]}),
  component: PublicSite,
});
