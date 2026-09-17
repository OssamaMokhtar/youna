import { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "Youna — AI Therapist, Wellness Coach & Companion",
  description: "Your AI-powered emotional wellness companion. Personalized conversations, mood tracking, journaling, and daily support.",
};

export default function HomePage() {
  return <LandingPage />;
}
