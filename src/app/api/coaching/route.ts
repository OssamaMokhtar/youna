import { NextRequest, NextResponse } from "next/server";
import {
  CoachingProgramId,
  CoachingStep,
  getProgramById,
  COACHING_PROGRAMS,
} from "@/lib/coaching";
import { buildChatPrompt, type PersonalityContext } from "@/lib/prompts";

// ── In-memory coaching session store (MVP: single-user, localStorage in production) ──
// Each session is keyed by a sessionId (passed from client). Stores current program,
// current step index, and all user responses collected so far.
// In production, this lives in the database (CoachingSession, CoachingStep model).

type CoachingSessionData = {
  programId: CoachingProgramId;
  currentStepIndex: number;
  responses: Array<{ stepId: string; answer: string; timestamp: number }>;
  startedAt: number;
  completedAt?: number;
  isComplete: boolean;
};

const coachingSessions = new Map<string, CoachingSessionData>();

// ── Build the step-by-step coaching prompt ─────────────────────────────────────────

function buildCoachingPrompt(
  program: { name: string; framework: string; description: string; steps: CoachingStep[] },
  currentStepIndex: number,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  personality: PersonalityContext | undefined,
): string {
  const step = program.steps[currentStepIndex];
  if (!step) {
    // Program complete — no more steps
    return `You are Youna, an AI wellness companion grounded in ${program.framework} principles.

The coaching program "${program.name}" is now complete. The user has finished all the steps.

Acknowledge their completion warmly and briefly. Summarize what they worked through — the ${program.framework} framework they used and the key insight or shift they may have experienced. Do not coach further. Do not start a new exercise. If they want to continue, invite them to return to the main chat or start a different program.

Keep your response to 2-4 sentences. Warm, grounded, genuine. Not clinical. Not robotic. The user just did meaningful work — honor that.`;
  }

  const stepLabel = `# Step ${currentStepIndex + 1} of ${program.steps.length}: ${step.title}`;
  const instructionText = step.instruction;
  const exerciseNote = step.exercise ? `\n\n--- Guided exercise (read slowly, then respond) ---\n${step.exercise}\n--- End guided exercise ---` : "";
  const responseTypeNote = step.responseType === "multiple_choice"
    ? `\n\nResponse options: ${step.options?.join(", ")}`
    : "";

  const system = `You are Youna, an AI wellness companion.

You are now running a structured ${program.framework} coaching program called "${program.name}": ${program.description}

${stepLabel}

 INSTRUCTION FOR THIS STEP:
${instructionText}${exerciseNote}${responseTypeNote}

 IMPORTANT GUIDELINES:
- Deliver ONLY the instruction above. Do not add preamble, do not summarize, do not ask "are you ready?". The user has already chosen to start this program — deliver the step content directly.
- If the step has options (multiple_choice), list them clearly after the instruction.
- If the step has a guided exercise (mindfulness, body scan), present it as a clearly marked block the user can read through.
- Keep your tone warm, personal, and grounded. Not clinical. Not robotic. Talk like someone who genuinely cares.
- Do NOT coach beyond this step. The program is structured — deliver this step, then wait for the user's response.
- If the user gives an answer that is off-topic, gently bring them back to the step.
- Do not mention frameworks, protocols, or methodology by name unless it naturally fits.
- This is step ${currentStepIndex + 1} of ${program.steps.length}. Do not rush. The user can move at their own pace.`;

  return system;
}

// ── Parse coaching response from LLM and prepare next step ────────────────────────

function processCoachingResponse(
  programId: CoachingProgramId,
  sessionId: string,
  userAnswer: string,
  currentStepIndex: number,
): { nextStepIndex: number; younaResponse: string; isComplete: boolean } {
  const session = coachingSessions.get(sessionId);
  if (!session || session.programId !== programId) {
    return { nextStepIndex: currentStepIndex, younaResponse: "I lost track of where we are. Let's start fresh.", isComplete: false };
  }

  const program = getProgramById(programId);
  if (!program) return { nextStepIndex: currentStepIndex, younaResponse: "Something went wrong with this program.", isComplete: false };

  const currentStep = program.steps[currentStepIndex];
  if (!currentStep) {
    return { nextStepIndex: currentStepIndex, younaResponse: "This program has no more steps.", isComplete: true };
  }

  // Record the response
  session.responses.push({ stepId: currentStep.id, answer: userAnswer, timestamp: Date.now() });

  // If this is the final step, mark complete
  if (currentStep.isFinal) {
    session.isComplete = true;
    session.completedAt = Date.now();
    coachingSessions.set(sessionId, session);

    // Build completion reflection from the step's reflection text + acknowledgment
    const completionText = `${currentStep.reflection}\n\nYou've completed the ${program.name} program. That was meaningful work —${program.framework.toLowerCase()} isn't about quick fixes, it's about building skills that last. Come back anytime you want to go deeper, or start a different program when it feels right.`;
    return { nextStepIndex: currentStepIndex + 1, younaResponse: completionText, isComplete: true };
  }

  // Advance to next step
  const nextIndex = currentStepIndex + 1;
  session.currentStepIndex = nextIndex;
  coachingSessions.set(sessionId, session);

  const nextStep = program.steps[nextIndex];
  if (!nextStep) {
    // Shouldn't happen if isFinal is set correctly, but guard anyway
    session.isComplete = true;
    session.completedAt = Date.now();
    coachingSessions.set(sessionId, session);
    return { nextStepIndex: nextIndex, younaResponse: `You've completed the ${program.name} program. Thank you for the work you put into it.`, isComplete: true };
  }

  // Return the next step's instruction, plus the current step's reflection woven in
  const younaResponse = `${currentStep.reflection}\n\n${nextStep.instruction}${nextStep.exercise ? `\n\n--- Guided exercise ---\n${nextStep.exercise}\n--- End guided exercise ---` : ""}${nextStep.responseType === "multiple_choice" ? `\n\nResponse options: ${nextStep.options?.join(", ")}` : ""}`;
  return { nextStepIndex: nextIndex, younaResponse, isComplete: false };
}

// ── Start a new coaching session ────────────────────────────────────────────────────

function startCoachingSession(sessionId: string, programId: CoachingProgramId): CoachingSessionData {
  const session: CoachingSessionData = {
    programId,
    currentStepIndex: 0,
    responses: [],
    startedAt: Date.now(),
    isComplete: false,
  };
  coachingSessions.set(sessionId, session);
  return session;
}

function parsePersonality(body: unknown): PersonalityContext | undefined {
  if (!body || typeof body !== "object") return undefined;
  const p = body as Record<string, unknown>;
  if (!p.personality || typeof p.personality !== "object") return undefined;
  const obj = p.personality as Record<string, unknown>;
  return {
    assessmentComplete: obj.assessmentComplete === true,
    bigFive: obj.bigFive && typeof obj.bigFive === "object" ? {
      openness: (obj.bigFive as Record<string, unknown>).openness as number | undefined,
      conscientiousness: (obj.bigFive as Record<string, unknown>).conscientiousness as number | undefined,
      extraversion: (obj.bigFive as Record<string, unknown>).extraversion as number | undefined,
      agreeableness: (obj.bigFive as Record<string, unknown>).agreeableness as number | undefined,
      neuroticism: (obj.bigFive as Record<string, unknown>).neuroticism as number | undefined,
    } : undefined,
    attachmentStyle: typeof obj.attachmentStyle === "string" ? obj.attachmentStyle : undefined,
    loveLanguages: Array.isArray(obj.loveLanguages) ? obj.loveLanguages as string[] : undefined,
  };
}

// ── POST /api/coaching/start ───────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  let body: { sessionId?: string; programId?: string; answer?: string; personality?: unknown };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (action === "start") {
    const sessionId = body.sessionId ?? crypto.randomUUID();
    const programId = body.programId as CoachingProgramId | undefined;
    if (!programId || !getProgramById(programId)) {
      return NextResponse.json({
        error: "Valid programId is required",
        availablePrograms: COACHING_PROGRAMS.map((p) => ({ id: p.id, name: p.name, framework: p.framework })),
      }, { status: 400 });
    }
    const session = startCoachingSession(sessionId, programId);
    const program = getProgramById(programId)!;
    const step = program.steps[0];
    const personality = parsePersonality(body);
    const firstInstruction = step.instruction
      + (step.exercise ? `\n\n--- Guided exercise ---\n${step.exercise}\n--- End guided exercise ---` : "")
      + (step.responseType === "multiple_choice" ? `\n\nResponse options: ${step.options?.join(", ")}` : "");
    return NextResponse.json({
      sessionId, programId: session.programId, stepIndex: 0, stepTitle: step.title,
      instruction: firstInstruction, responseType: step.responseType, options: step.options,
      isComplete: false, totalSteps: program.steps.length,
    });
  }

  if (action === "respond") {
    const sessionId = body.sessionId;
    const answer = body.answer?.trim();
    if (!sessionId || !answer) return NextResponse.json({ error: "sessionId and answer are required" }, { status: 400 });
    const session = coachingSessions.get(sessionId);
    if (!session) return NextResponse.json({ error: "Session not found. Start a program first." }, { status: 404 });
    if (session.isComplete) return NextResponse.json({ error: "This program is already complete. Start a new one." }, { status: 400 });
    const program = getProgramById(session.programId);
    if (!program) return NextResponse.json({ error: "Program not found." }, { status: 404 });
    const result = processCoachingResponse(session.programId, sessionId, answer, session.currentStepIndex);
    return NextResponse.json({
      sessionId, programId: session.programId,
      stepIndex: result.nextStepIndex < program.steps.length ? result.nextStepIndex : session.currentStepIndex,
      younaResponse: result.younaResponse, isComplete: result.isComplete, currentStepIndex: session.currentStepIndex,
    });
  }

  return NextResponse.json({
    programs: COACHING_PROGRAMS.map((p) => ({
      id: p.id, name: p.name, framework: p.framework, description: p.description,
      estimatedDuration: p.estimatedDuration, bestFor: p.bestFor,
      totalSteps: p.steps.length, requiresAssessment: p.requiresAssessment,
    })),
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "programs") {
    return NextResponse.json({
      programs: COACHING_PROGRAMS.map((p) => ({
        id: p.id, name: p.name, framework: p.framework, description: p.description,
        estimatedDuration: p.estimatedDuration, bestFor: p.bestFor,
        totalSteps: p.steps.length, requiresAssessment: p.requiresAssessment,
      })),
    });
  }

  if (action === "status") {
    const sessionId = searchParams.get("sessionId");
    if (!sessionId) return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    const session = coachingSessions.get(sessionId);
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    const program = getProgramById(session.programId);
    return NextResponse.json({
      sessionId, programId: session.programId, programName: program?.name, framework: program?.framework,
      currentStepIndex: session.currentStepIndex, totalSteps: program?.steps.length,
      isComplete: session.isComplete, startedAt: session.startedAt, completedAt: session.completedAt,
      responseCount: session.responses.length,
    });
  }

  if (action === "clear") {
    const sessionId = searchParams.get("sessionId");
    if (sessionId) coachingSessions.delete(sessionId);
    return NextResponse.json({ cleared: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
