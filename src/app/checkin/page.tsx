import type { Metadata } from "next";
import DailyCheckIn from "@/components/DailyCheckIn";

export const metadata: Metadata = {
  title: "Daily Check-in — Youna",
  description: "Daily mood, energy, and stress check-in with streak tracking.",
};

export default function CheckInPage() {
  return <DailyCheckIn />;
}
