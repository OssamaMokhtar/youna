import { Metadata } from "next";
import AssessmentComponent from "@/components/PersonalityAssessment";

export const metadata: Metadata = {
  title: "Personality Assessment — Youna",
  description: "Help Youna understand your personality.",
};

export default function AssessmentPage() {
  return <AssessmentComponent />;
}
