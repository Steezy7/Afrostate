import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/afrostate/AdminDashboard";
import { getAdminState } from "@/lib/afrostate/waitlist.functions";

export const Route = createFileRoute("/admin")({
  loader: () => getAdminState({ data: {} }),
  head: () => ({ meta: [
    { title: "AFROSTATE / WAITLIST" },
    { name: "description", content: "Private AFROSTATE waitlist dashboard." },
    { property: "og:title", content: "AFROSTATE / WAITLIST" },
    { property: "og:description", content: "Private AFROSTATE waitlist dashboard." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex, nofollow" },
  ]}),
  component: () => <AdminDashboard initial={Route.useLoaderData()} />,
});