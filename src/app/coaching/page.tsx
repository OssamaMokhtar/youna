import type { Metadata } from "next";
import CoachingLibrary from "@/components/CoachingLibrary";

export const metadata: Metadata = {
  title: "Coaching programs · Youna",
  description: "Self-guided skills exercises drawn from CBT, DBT, ACT, EFT, SFBT and mindfulness. Not therapy.",
};

// /coaching was linked from the Insights dashboard but had no page (404).
export default function CoachingPage() {
  return <CoachingLibrary />;
}
