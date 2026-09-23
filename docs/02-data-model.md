# Youna — Data model

> Status: AUTHORED · Updated 2026-09-23 · Owner: Ossama Mokhtar

**Today all user data is JSON in the browser's localStorage. It is unencrypted and never sent to a server,** except chat text when LLM mode is on.

## Browser storage (live)

| Key | Written by | Holds |
|---|---|---|
| `youna_mood_entries` | Mood tracker | Daily mood (5-point), note, date |
| `youna-mood-checkins` | Chat auto-logging, insights | Mood check-ins with source (`chat`, `checkin`…) |
| `youna_journal_entries` | Journal page | Entries: text, prompt, mood tag, timestamps |
| `youna-journal-entries`, `youna-saved-journal-entries` | Insights, chat | Journal data used by insights |
| `youna-coaching-sessions` | Coaching client | Completed program summaries |
| `youna-personality` | Assessment | Big Five scores, attachment style, goals, derived views |
| check-in entries + streak | Daily check-in | Mood (0–4), energy, stress, note |

**Known issue:** journal data is split across three keys written by different components, so insights may not see every entry (GAPS #4).

## Server schema (scaffolded, not in use)

`prisma/schema.prisma` defines `User`, `Account`, `Session`, `VerificationToken` (NextAuth), and `Profile`, `AssessmentResponse`, `ConversationMessage`, `MoodEntry`, `JournalEntry`, `DailyCheckIn`, `Goal`, `Habit`, `Subscription`, `MemoryEntry`. Nothing reads or writes these tables yet.

## Retention

Browser data stays until the user clears it. There is no export and no delete-all button yet (GAPS #5).
