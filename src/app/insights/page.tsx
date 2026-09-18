import type { Metadata } from "next";
import PersonalityInsights from "@/components/PersonalityInsights";

export const metadata: Metadata = {
  title: "Your Personality Insights — Youna",
  description: "Understand your personality across multiple frameworks — Big Five, HEXACO, Enneagram, DISC, and Love Languages.",
};

export default function InsightsPage() {
  return <PersonalityInsights />;
}
