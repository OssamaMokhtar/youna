import type { Metadata } from "next";
import InsightsDashboard from "@/components/InsightsDashboard";

export const metadata: Metadata = {
  title: "Insights · Youna",
  description: "Your wellness patterns, mood trends, journal sentiment, and coaching progress — all in one place.",
};

export default function InsightsPage() {
  return <InsightsDashboard />;
}
