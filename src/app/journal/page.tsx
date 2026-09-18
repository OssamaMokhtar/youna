import type { Metadata } from "next";
import Journaling from "@/components/Journaling";

export const metadata: Metadata = {
  title: "Journaling — Youna",
  description: "Free-form journaling, AI-guided prompts, and conversation-based reflection.",
};

export default function JournalPage() {
  return <Journaling />;
}
