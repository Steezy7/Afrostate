import { createFileRoute } from "@tanstack/react-router";
import { PublicSite } from "@/components/afrostate/PublicSite";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "AFROSTATE — The State Is Coming" },
    { name: "description", content: "AFROSTATE is a contemporary streetwear brand built around culture, identity, creativity and the energy of a new generation. Join the waiting list for Drop 001." },
    { property: "og:title", content: "AFROSTATE — The State Is Coming" },
    { property: "og:description", content: "AFROSTATE is a contemporary streetwear brand built around culture, identity, creativity and the energy of a new generation. Join the waiting list for Drop 001." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: PublicSite,
});
