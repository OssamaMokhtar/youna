import type { Metadata } from "next";
import MoodTracking from "@/components/MoodTracking";

export const metadata: Metadata = {
  title: "Mood Tracking — Youna",
  description: "Track your mood daily, spot patterns, and watch your emotional trends evolve.",
};

export default function MoodPage() {
  return <MoodTracking />;
}
