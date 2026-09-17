import { Metadata } from "next";
import PersonalityAssessment from "@/components/PersonalityAssessment";

export const metadata: Metadata = {
  title: "Personality Assessment — Youna",
  description: "Help Youna understand your personality, communication style, and relationship patterns for a truly personalized experience.",
};

export default function AssessmentPage() {
  return <PersonalityAssessment />;
}
