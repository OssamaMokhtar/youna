// ── Coaching Program Engine ────────────────────────────────────────────────────────
// AI coaching programs: structured CBT / DBT / ACT / EFT / SFBT / Mindfulness flows
// that guide users through therapeutic exercises in chat — not freeform conversation.
//
// Each program is a step-based flow. Youna delivers the right step content, then waits
// for the user's response before advancing. The user can pause/resume and the program
// persists across sessions (localStorage for MVP, DB in production).

// ── Program definitions ────────────────────────────────────────────────────────────

export type CoachingProgramId =
  | "cbt_thought_record"
  | "cbt_cognitive_distortion"
  | "dbt_distress_tolerance"
  | "dbt_emotion_regulation"
  | "act_values_clarification"
  | "act_mindful_presence"
  | "eft_emotion_mapping"
  | "sfbt_solutions_focus"
  | "mindfulness_body_scan"
  | "mindfulness_three_minutes";

export interface CoachingStep {
  id: string;
  title: string;
  instruction: string;        // what Youna says to introduce this step
  responseType: "text" | "multiple_choice" | "scale_1_10" | "journal" | "none";
  options?: string[];         // for multiple_choice
  // After user responds, Youna reflects and moves to next step
  reflection: string;         // what Youna says after receiving the user's answer
  nextStepId?: string;        // explicit next step (falls back to linear order)
  isFinal?: boolean;          // if true, this is the closing step
  exercise?: string;          // longer guided exercise text (mindfulness, body scan, etc.)
}

export interface CoachingProgram {
  id: CoachingProgramId;
  name: string;
  framework: "CBT" | "DBT" | "ACT" | "EFT" | "SFBT" | "Mindfulness";
  description: string;
  estimatedDuration: string;  // e.g. "5-10 minutes"
  bestFor: string[];          // tags describing when this program is a good fit
  steps: CoachingStep[];
  // True if the program can be started without an assessment (all programs can, but
  // some get better recommendations when DNA is available)
  requiresAssessment: boolean;
}

// ── Individual program step definitions ──────────────────────────────────────────

const CBT_THOUGHT_RECORD_STEPS: CoachingStep[] = [
  {
    id: "cbt_tr_1",
    title: "Situation",
    instruction: "Let's start with a thought record — a core CBT tool that helps you slow down the connection between what happens, what you think, and how you feel. I'll guide you through it step by step.\n\nFirst: what's the situation? Just describe what happened — the event, the moment, the trigger. Keep it factual for now, like you're describing it to a friend who wasn't there.",
    responseType: "text",
    reflection: "Thank you. I've noted that situation. Now let's look at what went through your mind in that moment.",
    nextStepId: "cbt_tr_2",
  },
  {
    id: "cbt_tr_2",
    title: "Automatic Thoughts",
    instruction: "In that moment, what thoughts popped into your head? These are usually quick, automatic — the kind you might not even notice you're thinking. Don't worry about whether they're 'true' yet — just capture them.\n\nWhat went through your mind?",
    responseType: "text",
    reflection: "Those are the automatic thoughts. Now let's look at how they landed in your body and emotions.",
    nextStepId: "cbt_tr_3",
  },
  {
    id: "cbt_tr_3",
    title: "Emotions & Intensity",
    instruction: "What emotions came up for you in that situation? Name as many as you can — and for each one, rate the intensity from 0 (not at all) to 10 (as strong as it gets).\n\nFor example: 'sadness — 7, anxiety — 5, shame — 4.'",
    responseType: "text",
    reflection: "You've now mapped the situation, the thoughts, and the emotions. That in itself is a meaningful pause — most people move through this chain without ever stopping to look at it. Let's look at the thoughts more carefully now.",
    nextStepId: "cbt_tr_4",
  },
  {
    id: "cbt_tr_4",
    title: "Evidence For",
    instruction: "Let's take one of those automatic thoughts — whichever feels most prominent or distressing — and look at it like a hypothesis, not a fact.\n\nWhat evidence supports this thought? What actually happened that makes this thought feel true?\n\nList what you can observe — facts, not interpretations.",
    responseType: "text",
    reflection: "Good — you've captured what supports the thought. Now the other side.",
    nextStepId: "cbt_tr_5",
  },
  {
    id: "cbt_tr_5",
    title: "Evidence Against",
    instruction: "Now the counter-evidence. What doesn't support this thought? What's missing from it? What would a thoughtful, fair-minded person say about this situation?\n\nSometimes the evidence against is obvious once you look for it. Sometimes it takes effort — that's normal.",
    responseType: "text",
    reflection: "Now let's see what a more balanced thought might look like.",
    nextStepId: "cbt_tr_6",
  },
  {
    id: "cbt_tr_6",
    title: "Balanced Thought",
    instruction: "Based on everything you've looked at — the situation, the automatic thought, the emotions, the evidence for and against — what's a more balanced, realistic thought?\n\nIt doesn't have to be positive. It just has to be accurate. Something you could actually believe.",
    responseType: "text",
    reflection: "That balanced thought is the heart of this exercise. Let's see how it lands.",
    nextStepId: "cbt_tr_7",
  },
  {
    id: "cbt_tr_7",
    title: "Re-rate Emotions",
    instruction: "Now that you have a more balanced thought, re-rate the emotions you named earlier. Same 0-10 scale.\n\nHas anything shifted? Even a small change is meaningful — the thought record is showing you that thoughts are mutable, and so are the feelings they create.",
    responseType: "text",
    reflection: "Look at what you just did: you slowed down an automatic chain, examined it honestly, and found a more balanced way through. That's the CBT muscle — and every time you practice it, it gets a little stronger.",
    isFinal: true,
  },
];

const CBT_COGNITIVE_DISTORTION_STEPS: CoachingStep[] = [
  {
    id: "cbt_cd_1",
    title: "The Thought",
    instruction: "Cognitive distortions are patterns of thinking that feel true but aren't accurate — they're the mind's shortcuts that sometimes lead us astray. Let's identify one.\n\nWhat's a thought you've been having lately that feels sticky — hard to let go of, even if part of you knows it might not be fully true?",
    responseType: "text",
    reflection: "That's the thought we'll look at. Now let's see which distortion pattern it might fit — this is about understanding the pattern, not judging yourself for having it.",
    nextStepId: "cbt_cd_2",
  },
  {
    id: "cbt_cd_2",
    title: "Distortion Identification",
    instruction: "Here are the most common cognitive distortions. Read through them and notice which one feels closest to your thought:\n\n• Catastrophizing — expecting the worst possible outcome\n• Mind reading — assuming you know what others are thinking\n• All-or-nothing thinking — seeing things as black or white, no middle\n• Overgeneralization — one event = always, everything is this way\n• Emotional reasoning — 'I feel it, so it must be true'\n• Should statements — 'I should / they should'\n• Personalization — taking things personally that aren't about you\n\nWhich one resonates most with your thought? Or does it feel like a mix?",
    responseType: "multiple_choice",
    options: [
      "Catastrophizing",
      "Mind reading",
      "All-or-nothing thinking",
      "Overgeneralization",
      "Emotional reasoning",
      "Should statements",
      "Personalization",
      "A mix / not sure",
    ],
    reflection: "That's a helpful label — naming the pattern is the first step in loosening its grip. Now let's look at the thought through that lens.",
    nextStepId: "cbt_cd_3",
  },
  {
    id: "cbt_cd_3",
    title: "Reframing",
    instruction: "Now — what would this thought look like if it weren't filtered through that distortion? Not forced positivity — just accuracy.\n\nRewrite it in a way that a thoughtful, fair-minded version of you would say it.",
    responseType: "text",
    reflection: "That's the reframe. Not necessarily 'happy' — just more true. That's the work.",
    isFinal: true,
  },
];

const DBT_DISTRESS_TOLERANCE_STEPS: CoachingStep[] = [
  {
    id: "dbttdt_1",
    title: "Check the Temperature",
    instruction: "Distress tolerance skills are for moments when emotion is so intense that you can't think straight — and trying to 'solve' it would make it worse. The goal here isn't to fix the problem. It's to survive the moment without making it worse.\n\nOn a scale of 0-10, how intense is what you're feeling right now?",
    responseType: "scale_1_10",
    reflection: "Thank you. The intensity matters because it tells us how much the body is driving right now. Let's start with a physical reset — this is the DBT 'TIPP' skill, and the first letter is Temperature.",
    nextStepId: "dbttdt_2",
  },
  {
    id: "dbttdt_2",
    title: "Temperature (TIPP)",
    instruction: "The TIPP skill uses your body's physiology to bring the temperature of your nervous system down. The T is for Temperature.\n\nIf you can, try one of these right now:\n\n• Splash cold water on your face, or hold something cold against your cheeks or the back of your neck\n• If you can't do that right now, imagine a cold, crisp scene — snow, a cold lake, cold air on your face\n\nThe goal is the mammalian dive reflex — cold on the face signals the body to slow the heart rate. It's a physical reset, not a mental one.\n\nDid you try it? How do you feel now, even slightly?",
    responseType: "text",
    reflection: "Good. Even a small shift is the right direction. The body leads when the mind can't — that's the whole point of distress tolerance. Let's keep going.",
    nextStepId: "dbttdt_3",
  },
  {
    id: "dbttdt_3",
    title: "Intense Exercise (TIPP)",
    instruction: "The second TIPP letter is Intense exercise. This isn't about fitness — it's about using physical exertion to discharge the nervous system energy that intense emotion creates.\n\nIf you can, anything that gets your heart rate up for even a minute helps: brisk walking fast, jumping jacks, running in place, pushing against a wall.\n\nIf you can't do that now, that's OK — the point is to know the option exists for next time.",
    responseType: "text",
    reflection: "Either way, you've now activated two of the four TIPP skills. Let's move to the P — Paced breathing.",
    nextStepId: "dbttdt_4",
  },
  {
    id: "dbttdt_4",
    title: "Paced Breathing (TIPP)",
    instruction: "The P in TIPP is Paced breathing — slowing the breath to signal safety to the nervous system.\n\nTry this now, even for 30 seconds:\n\nBreathe in for 4 seconds. Hold gently for 2. Breathe out for 6 seconds. Repeat.\n\nThe longer exhale is what signals the parasympathetic nervous system — the 'rest and digest' branch. It's physiology, not philosophy.",
    responseType: "text",
    reflection: "Good. Three of the four TIPP skills now. The last is Prequisites — the things you need to be able to tolerate.",
    nextStepId: "dbttdt_5",
  },
  {
    id: "dbttdt_5",
    title: "Paired Muscle Relaxation (TIPP)",
    instruction: "The last T is Paired muscle relaxation — tensing and releasing muscle groups to discharge the physical tension that intense emotion creates.\n\nTry this: tense your hands into fists as hard as you can for 5 seconds. Then release. Notice the difference.\n\nIf you want to go further: tense your shoulders up to your ears, hold, release. Tense your legs, hold, release.\n\nThe contrast between tension and release is what teaches the body what 'relaxed' actually feels like.",
    responseType: "text",
    reflection: "You've now walked through all four TIPP skills. If you're in a moment of crisis, any one of these can help. If you're just practicing, you've built the muscle for when you need it.",
    nextStepId: "dbttdt_6",
  },
  {
    id: "dbttdt_6",
    title: "Self-Soothing with the 5 Senses",
    instruction: "Beyond TIPP, DBT has the self-soothing skill — using each of the five senses to bring gentle comfort in a moment of distress. This isn't about fixing anything — it's about being kind to yourself while the moment passes.\n\nTake a moment to name one thing in each category that you can use right now or remember:\n\n• Vision: something beautiful to look at\n• Hearing: something calming to listen to\n• Smell: a scent that grounds you\n• Taste: something that feels comforting\n• Touch: a texture or sensation that feels soothing",
    responseType: "text",
    reflection: "Those are your self-soothing tools. In a moment of distress, you don't have to figure out what to do — you already have this list. That's the value of the skill: it's pre-loaded.",
    isFinal: true,
  },
];

const DBT_EMOTION_REGULATION_STEPS: CoachingStep[] = [
  {
    id: "dbter_1",
    title: "Name the Emotion",
    instruction: "Emotion regulation in DBT starts with the opposite of where most people start: naming the emotion precisely. The more specific the name, the more you can work with it.\n\nWhat emotion are you feeling right now? Try to name it as specifically as you can — not just 'bad' or 'stressed' but the actual emotion. There might be more than one.",
    responseType: "text",
    reflection: "Good. Naming is the first act of regulation — you've taken it from something that's happening to you to something you can look at.",
    nextStepId: "dbter_2",
  },
  {
    id: "dbter_2",
    title: "Check the Facts",
    instruction: "Now the DBT 'Check the Facts' skill: does the intensity of your emotion match the facts of the situation?\n\nEmotions are valid — they're real. But their intensity doesn't always match the facts. Your emotion might be 8/10, but the situation might only warrant a 4/10.\n\nWhat are the actual facts of what happened? Just the facts — not the interpretation.",
    responseType: "text",
    reflection: "Now compare: the emotion intensity vs. the facts. If they don't match, that's not a judgment — it's information. It tells you something useful.",
    nextStepId: "dbter_3",
  },
  {
    id: "dbter_3",
    title: "Opposite Action",
    instruction: "One of the most powerful DBT emotion regulation skills is Opposite Action: when the emotion doesn't match the facts, the most effective thing is often to do the opposite of what the emotion is pushing you toward.\n\nFor example:\n• Fear says 'avoid' — opposite action is 'approach gently'\n• Anger says 'attack' — opposite action is 'gentle, respectful distance'\n• Sadness says 'isolate' — opposite action is 'reach out, even a little'\n• Shame says 'hide' — opposite action is 'be visible, even briefly'\n\nWhat is your emotion pushing you to do? And what would the opposite action look like — even a tiny version of it?",
    responseType: "text",
    reflection: "That's the opposite action — and even considering it, let alone trying a small version, is the work. The emotion doesn't have to disappear for the opposite action to help.",
    isFinal: true,
  },
];

const ACT_VALUES_CLARIFICATION_STEPS: CoachingStep[] = [
  {
    id: "act_vc_1",
    title: "A Moment of Space",
    instruction: "ACT — Acceptance and Commitment Therapy — starts from a different place than most approaches. It's not about fixing thoughts or reducing symptoms. It's about clarifying what matters to you and taking action toward it, even with difficult thoughts and feelings present.\n\nBefore we start, take a breath. Just one. Notice the space around you, the fact that you're here, in this moment, reading this. That's the starting point — being present.",
    responseType: "text",
    reflection: "That's the first ACT move: arriving in the present moment. Now let's get to what matters.",
    nextStepId: "act_vc_2",
  },
  {
    id: "act_vc_2",
    title: "Values — What Matters",
    instruction: "In ACT, values are directions you want to move in — not destinations you arrive at. They're like a compass, not a map. And they're chosen, not imposed.\n\nI'm going to list some values domains. For each one, notice what comes up for you — not whether you 'have' it or 'don't have' it, but whether it matters to you.\n\nFamily · Relationships · Health · Work / vocation · Creativity · Learning · Community · Spirituality · Fun / play · Personal growth · Contribution / service · Integrity / authenticity\n\nWhich 2-3 feel most alive or most important to you right now?",
    responseType: "text",
    reflection: "Those are your active values — the directions that matter most to you right now. Values can change over time, and that's fine — they're alive, not fixed.",
    nextStepId: "act_vc_3",
  },
  {
    id: "act_vc_3",
    title: "Values in Action",
    instruction: "Now the key ACT question: what's one small, concrete action you could take in the next 24 hours that moves you toward one of those values?\n\nIt doesn't have to be big. It doesn't have to solve anything. It just has to be a step in the direction of what matters to you.\n\nFor example: if 'connection' matters, one action might be texting someone you've been meaning to reach out to.",
    responseType: "text",
    reflection: "That's a committed action — a small step in the direction of what matters. ACT is built on accumulating these, not waiting for the perfect moment.",
    nextStepId: "act_vc_4",
  },
  {
    id: "act_vc_4",
    title: "Make Room for the Hard Stuff",
    instruction: "Here's the thing about values-based action: difficult thoughts and feelings usually show up. That's not a sign you're doing it wrong — it's a sign you're doing something that matters.\n\nSo the last ACT question: if difficult thoughts or feelings come up as you take that action — what's your stance toward them?\n\nACT doesn't ask you to eliminate them. It asks you to make room for them, notice them, and keep going anyway. Like sitting in a busy train station — the trains come and go, but you don't have to get on every one of them.",
    responseType: "text",
    reflection: "That's the ACT synthesis: know your values, take small steps toward them, and make room for the difficult stuff that comes along for the ride. That's not a one-time exercise — it's a way of living.",
    isFinal: true,
  },
];

const ACT_MINDFUL_PRESENCE_STEPS: CoachingStep[] = [
  {
    id: "act_mp_1",
    title: "Arriving",
    instruction: "This is a short mindfulness exercise grounded in ACT. The goal isn't to clear your mind — it's to notice what's here, right now, without trying to change it.\n\nSit comfortably if you can. Uncross your legs. Rest your hands. Take one slow breath in — and let it out.\n\nThat's it. You've started.",
    responseType: "text",
    reflection: "Good. No special state to achieve. Just being here.",
    nextStepId: "act_mp_2",
  },
  {
    id: "act_mp_2",
    title: "Notice 5 Things",
    instruction: "Now a simple ACT exercise: notice 5 things.\n\nLook around — and name 5 things you can see. Just name them. A chair. The light. A color. Nothing fancy.\n\nThen name 4 things you can feel in your body right now — the weight of your body in the chair, your feet on the floor, the air on your skin.\n\nThen 3 things you can hear.\n\nThen 2 things you can smell.\n\nThen 1 thing you can taste.",
    responseType: "text",
    reflection: "That's the exercise — simple, but not always easy. The point is that you brought your attention to the present moment through your senses. That's mindfulness.",
    nextStepId: "act_mp_3",
  },
  {
    id: "act_mp_3",
    title: "Notice Thoughts",
    instruction: "Now the ACT twist: notice your thoughts.\n\nWithout trying to change them, without trying to make them go away, just notice them. Like cars passing on a road — you don't have to get in every car. You're the road, not the cars.\n\nWhat thoughts are here right now? Just name them.",
    responseType: "text",
    reflection: "That's the ACT defusion move — you're not your thoughts, you're the one noticing them. Even for a moment, that's a different relationship to your mind.",
    isFinal: true,
  },
];

const EFT_EMOTION_MAPPING_STEPS: CoachingStep[] = [
  {
    id: "eft_em_1",
    title: "Identify the Primary Emotion",
    instruction: "Emotionally Focused Therapy (EFT) works with the idea that our most visible emotions are often secondary — reactions to the primary emotions underneath. The primary emotions are the vulnerable ones: fear, sadness, shame, loneliness, hurt.\n\nRight now, what's the most visible emotion on the surface? The one that feels loud or reactive? Name it.",
    responseType: "text",
    reflection: "That's the secondary emotion — the protector. Now let's look underneath.",
    nextStepId: "eft_em_2",
  },
  {
    id: "eft_em_2",
    title: "Find the Primary Emotion",
    instruction: "Underneath that secondary emotion, what's the more vulnerable feeling? The one that's harder to name, harder to feel?\n\nCommon primary emotions: fear of abandonment, sadness about loss, shame about not being enough, loneliness, hurt from being misunderstood, fear of rejection, grief.\n\nWhat's underneath?",
    responseType: "text",
    reflection: "That's the primary emotion — the vulnerable one underneath the protective one. This is where EFT does its work.",
    nextStepId: "eft_em_3",
  },
  {
    id: "eft_em_3",
    title: "The Need Underneath",
    instruction: "Every primary emotion points to a need. Fear usually points to a need for safety. Sadness points to a need for comfort or meaning. Shame points to a need for acceptance. Loneliness points to a need for connection.\n\nWhat's the need underneath your primary emotion? Not the strategy — the actual need.",
    responseType: "text",
    reflection: "That's the need. And needs are legitimate — they're part of being human. Now the last step: what would it look like to meet that need, even a little?",
    nextStepId: "eft_em_4",
  },
  {
    id: "eft_em_4",
    title: "Self-Compassion Response",
    instruction: "The final EFT move: respond to that primary emotion and need with compassion. Not fixing it — just being present with it, the way you'd be present with someone you love who was feeling this way.\n\nWhat would you say to yourself, or do for yourself, that would acknowledge this primary emotion and this need? Even one sentence.",
    responseType: "text",
    reflection: "That self-compassion response — even one sentence — is a meaningful act. It shifts the relationship to the emotion from fighting it to being with it. That's the EFT path.",
    isFinal: true,
  },
];

const SFBT_SOLUTIONS_FOCUS_STEPS: CoachingStep[] = [
  {
    id: "sfbt_sf_1",
    title: "The Present",
    instruction: "Solution-Focused Brief Therapy (SFBT) has a simple premise: you don't need to fully understand the problem to start solving it. You just need to know what 'better' looks like, and take one small step toward it.\n\nSo let's start with the present — not to analyze it, but to locate the cracks where things are already working. What's one thing in your life right now that's functioning OK — maybe not great, but OK?",
    responseType: "text",
    reflection: "That's the SFBT starting point: finding what's already working, however small. Now let's get specific about what 'better' would look like.",
    nextStepId: "sfbt_sf_2",
  },
  {
    id: "sfbt_sf_2",
    title: "The Preferred Future",
    instruction: "The SFBT miracle question, adapted: if, overnight, a miracle happened and this situation was resolved — what would be different? Not how you'd feel — what would you actually do differently the next morning?\n\nSmall, concrete things. What would you notice?",
    responseType: "text",
    reflection: "That's the preferred future — concrete and observable. Now let's find the smallest version of it that's already happening.",
    nextStepId: "sfbt_sf_3",
  },
  {
    id: "sfbt_sf_3",
    title: "Exceptions",
    instruction: "Here's the SFBT exception question: in the past, when has this situation been slightly better — even a little bit? When has the miracle partially happened?\n\nWhat was different in those moments? What were you doing? Who were you with? What was the context?",
    responseType: "text",
    reflection: "Those are your exceptions — the moments when things were already moving in the right direction. SFBT builds on these, not on analyzing the problem.",
    nextStepId: "sfbt_sf_4",
  },
  {
    id: "sfbt_sf_4",
    title: "The Next Small Step",
    instruction: "The final SFBT question: what's the smallest, most concrete thing you could do in the next 24 hours that moves you even 1% toward that preferred future?\n\nNot the big solution — just the next small step.",
    responseType: "text",
    reflection: "That's a solution-focused step — small, concrete, in the direction of what you want. SFBT doesn't ask you to solve everything tomorrow. It asks you to take one useful step today.",
    isFinal: true,
  },
];

const MINDFULNESS_BODY_SCAN_STEPS: CoachingStep[] = [
  {
    id: "mind_bs_1",
    title: "Settling In",
    instruction: "This is a body scan — a mindfulness practice that moves attention slowly through the body, noticing sensations without trying to change them.\n\nFind a comfortable position — sitting or lying down. Uncross your legs and arms. Rest your hands. Close your eyes if that feels comfortable, or soften your gaze.\n\nTake three slow breaths. In through the nose, out through the mouth. No goal — just arriving.",
    responseType: "text",
    exercise: "Take your time with this. Three slow breaths. Notice the weight of your body. Notice the contact points — where your body meets the chair or the floor. You're not trying to relax — you're just noticing.",
    reflection: "Good. You've arrived. Now the scan begins — slowly.",
    nextStepId: "mind_bs_2",
  },
  {
    id: "mind_bs_2",
    title: "Feet and Legs",
    instruction: "Bring your attention to your feet. Not trying to change anything — just noticing what's there.\n\nWhat do you feel in your feet? Warmth, cold, pressure, tingling, numbness, the contact of socks or shoes? Whatever is there, that's what's there.\n\nNow move up to your legs. Calves, knees, thighs. Same thing — just noticing.",
    responseType: "text",
    exercise: "Spend as long as you want here. There's no right answer. If you feel nothing, that's a sensation too — 'nothing' is a valid noticing. If your mind wanders, that's normal — just bring it back.",
    reflection: "Good. You're moving through the body, one region at a time. That's the practice.",
    nextStepId: "mind_bs_3",
  },
  {
    id: "mind_bs_3",
    title: "Torso and Belly",
    instruction: "Now bring attention to your torso — your chest and belly.\n\nNotice the rise and fall of your breath. Not controlling it — just watching it happen.\n\nNotice any sensations in your belly — tightness, softness, movement, warmth, nothing. Whatever is there.",
    responseType: "text",
    exercise: "The belly is where many of us hold tension without noticing. Just bringing attention here, without trying to fix anything, is the practice.",
    reflection: "Good. The breath and the belly — central to the body's regulation. Just noticing is enough.",
    nextStepId: "mind_bs_4",
  },
  {
    id: "mind_bs_4",
    title: "Hands, Arms, Shoulders",
    instruction: "Now your hands, arms, and shoulders.\n\nNotice your hands — the palms, the fingers, the contact they're making. Notice your arms. Notice your shoulders — are they up or down? Tense or relaxed? No need to change — just notice.",
    responseType: "text",
    exercise: "Shoulders are a common place we hold stress. Just bringing attention here — without trying to force them down — is the practice.",
    reflection: "Good. You're moving through the whole body, region by region, with curiosity rather than judgment.",
    nextStepId: "mind_bs_5",
  },
  {
    id: "mind_bs_5",
    title: "Face and Head",
    instruction: "Now the face and head.\n\nNotice your jaw — is it clenched or loose? Your tongue — where is it? Your forehead — wrinkled or smooth? Your eyes — behind closed lids or open, soft.\n\nThe face is where we hold so much — expression, tension, the effort of being. Just noticing.",
    responseType: "text",
    exercise: "If you find tension in the face, notice it without trying to fix it. The noticing is the practice. If it releases on its own, that's a bonus.",
    reflection: "Good. You've scanned the whole body — from feet to face. That's the practice.",
    nextStepId: "mind_bs_6",
  },
  {
    id: "mind_bs_6",
    title: "Whole Body",
    instruction: "Now expand your attention to the whole body at once.\n\nFeel the body as one — the weight, the shape, the contact with the chair or floor. Notice the breath moving through the whole body.\n\nStay here for a few breaths. No goal. Just being.",
    responseType: "text",
    exercise: "A few slow breaths, feeling the whole body. This is the integration — you've moved from part to whole.",
    reflection: "That's the body scan. You don't need to feel anything special — you just practiced bringing attention to your body, region by region, without judgment. That's mindfulness.",
    isFinal: true,
  },
];

const MINDFULNESS_THREE_MINUTES_STEPS: CoachingStep[] = [
  {
    id: "mind_3m_1",
    title: "Minute One — Arriving",
    instruction: "This is the 3-minute breathing space — a core mindfulness practice. Three minutes, three steps.\n\nMinute one: arriving. Sit comfortably. Close your eyes or soften your gaze. Take one slow breath.\n\nAsk yourself: what's my experience right now? Thoughts, feelings, body sensations. Just name them. No need to change them.",
    responseType: "text",
    exercise: "Naming takes 30 seconds. 'I'm feeling anxious. I'm having the thought that... My shoulders are tight.' That's it. You've arrived.",
    reflection: "Good. You've named what's here. That's minute one.",
    nextStepId: "mind_3m_2",
  },
  {
    id: "mind_3m_2",
    title: "Minute Two — Gathering",
    instruction: "Minute two: gathering. Bring your attention to the breath — specifically to the physical sensation of breathing.\n\nThe air at the nostrils. The rise and fall of the chest or belly. Pick one place and stay there.\n\nThe mind will wander — that's what minds do. When you notice it, gently bring it back to the breath. No judgment. The returning is the practice.",
    responseType: "text",
    exercise: "Stay with the breath for this minute. Every time the mind wanders, bring it back. That's the whole practice — noticing and returning.",
    reflection: "Good. The mind wandered, and you brought it back. That's exactly the practice. Minute two done.",
    nextStepId: "mind_3m_3",
  },
  {
    id: "mind_3m_3",
    title: "Minute Three — Expanding",
    instruction: "Minute three: expanding. Now widen your attention from the breath to the whole body — and then to the whole moment.\n\nFeel the body as a whole. The breath moving through it. The space around it. The room you're in.\n\nThen, when you're ready, bring the practice to a close.",
    responseType: "text",
    exercise: "A few more breaths, feeling the whole body. Then gently open your eyes if they were closed.",
    reflection: "That's the 3-minute breathing space — arriving, gathering, expanding. Three minutes, three steps. You can do this anywhere, anytime.",
    isFinal: true,
  },
];

// ── Program registry ──────────────────────────────────────────────────────────────

export const COACHING_PROGRAMS: CoachingProgram[] = [
  {
    id: "cbt_thought_record",
    name: "Thought Record",
    framework: "CBT",
    description: "A structured CBT exercise that walks you through the connection between situation, thought, and emotion — ending with a more balanced thought.",
    estimatedDuration: "8-12 minutes",
    bestFor: ["anxiety", "negative thoughts", "overthinking", "cognitive distortions"],
    steps: CBT_THOUGHT_RECORD_STEPS,
    requiresAssessment: false,
  },
  {
    id: "cbt_cognitive_distortion",
    name: "Cognitive Distortion Check",
    framework: "CBT",
    description: "Identify a sticky thought, label the distortion pattern behind it, and reframe it accurately.",
    estimatedDuration: "4-6 minutes",
    bestFor: ["negative thoughts", "catastrophizing", "mind reading", "all or nothing thinking"],
    steps: CBT_COGNITIVE_DISTORTION_STEPS,
    requiresAssessment: false,
  },
  {
    id: "dbt_distress_tolerance",
    name: "Distress Tolerance",
    framework: "DBT",
    description: "DBT's TIPP skills (Temperature, Intense exercise, Paced breathing, Paired muscle relaxation) plus self-soothing — for moments of high emotional intensity.",
    estimatedDuration: "6-10 minutes",
    bestFor: ["high intensity emotions", "crisis moments", "overwhelm", "panic"],
    steps: DBT_DISTRESS_TOLERANCE_STEPS,
    requiresAssessment: false,
  },
  {
    id: "dbt_emotion_regulation",
    name: "Emotion Regulation",
    framework: "DBT",
    description: "Name the emotion, check the facts, and practice opposite action — a DBT sequence for when emotion doesn't match the situation.",
    estimatedDuration: "5-7 minutes",
    bestFor: ["emotional intensity", "emotion regulation", "strong emotions"],
    steps: DBT_EMOTION_REGULATION_STEPS,
    requiresAssessment: false,
  },
  {
    id: "act_values_clarification",
    name: "Values Clarification",
    framework: "ACT",
    description: "Clarify what matters to you, identify one small committed action, and make room for the difficult stuff that comes along.",
    estimatedDuration: "5-7 minutes",
    bestFor: ["feeling stuck", "lack of direction", "values confusion", "life decisions"],
    steps: ACT_VALUES_CLARIFICATION_STEPS,
    requiresAssessment: false,
  },
  {
    id: "act_mindful_presence",
    name: "Mindful Presence",
    framework: "ACT",
    description: "A short ACT mindfulness exercise: notice 5 things, then notice your thoughts as passing events rather than facts.",
    estimatedDuration: "3-5 minutes",
    bestFor: ["mindfulness practice", "present moment awareness", "stress", "rumination"],
    steps: ACT_MINDFUL_PRESENCE_STEPS,
    requiresAssessment: false,
  },
  {
    id: "eft_emotion_mapping",
    name: "Emotion Mapping",
    framework: "EFT",
    description: "Map from a secondary (protective) emotion down to the primary (vulnerable) emotion, identify the need underneath, and respond with self-compassion.",
    estimatedDuration: "5-7 minutes",
    bestFor: ["strong emotions", "relationship feelings", "emotional confusion", "self-compassion"],
    steps: EFT_EMOTION_MAPPING_STEPS,
    requiresAssessment: false,
  },
  {
    id: "sfbt_solutions_focus",
    name: "Solutions Focus",
    framework: "SFBT",
    description: "A solution-focused brief therapy sequence: find what's already working, define the preferred future, find exceptions, and take the next small step.",
    estimatedDuration: "4-6 minutes",
    bestFor: ["feeling stuck", "problem-solving", "lack of direction", "small steps"],
    steps: SFBT_SOLUTIONS_FOCUS_STEPS,
    requiresAssessment: false,
  },
  {
    id: "mindfulness_body_scan",
    name: "Body Scan",
    framework: "Mindfulness",
    description: "A guided body scan — moving attention slowly through the body from feet to face, noticing sensations without judgment.",
    estimatedDuration: "8-12 minutes",
    bestFor: ["relaxation", "body awareness", "stress", "sleep", "mindfulness practice"],
    steps: MINDFULNESS_BODY_SCAN_STEPS,
    requiresAssessment: false,
  },
  {
    id: "mindfulness_three_minutes",
    name: "3-Minute Breathing Space",
    framework: "Mindfulness",
    description: "A three-minute mindfulness exercise: arriving, gathering on the breath, and expanding to the whole moment.",
    estimatedDuration: "3-4 minutes",
    bestFor: ["quick reset", "stress", "present moment", "anytime practice"],
    steps: MINDFULNESS_THREE_MINUTES_STEPS,
    requiresAssessment: false,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────────

export function getProgramById(id: CoachingProgramId): CoachingProgram | undefined {
  return COACHING_PROGRAMS.find((p) => p.id === id);
}

export function getProgramsForFramework(framework: CoachingProgram["framework"]): CoachingProgram[] {
  return COACHING_PROGRAMS.filter((p) => p.framework === framework);
}

export function getAllFrameworks(): CoachingProgram["framework"][] {
  return [...new Set(COACHING_PROGRAMS.map((p) => p.framework))];
}

export function getRecommendedPrograms(bigFive?: { neuroticism?: number; openness?: number; conscientiousness?: number }): CoachingProgramId[] {
  const recommendations: CoachingProgramId[] = [];

  if (bigFive?.neuroticism !== undefined && bigFive.neuroticism >= 3.5) {
    recommendations.push("dbt_emotion_regulation", "dbt_distress_tolerance", "mindfulness_three_minutes");
  }
  if (bigFive?.neuroticism !== undefined && bigFive.neuroticism <= 2.5 && bigFive?.openness !== undefined && bigFive.openness <= 2) {
    recommendations.push("act_values_clarification", "act_mindful_presence");
  }
  if (bigFive?.conscientiousness !== undefined && bigFive.conscientiousness >= 3.5) {
    recommendations.push("cbt_thought_record", "cbt_cognitive_distortion");
  }
  return recommendations;
}

export function getFrameworkEmphasisRecommendation(frameworkEmphasis: string[]): CoachingProgramId[] {
  const map: Record<string, CoachingProgramId[]> = {
    "CBT": ["cbt_thought_record", "cbt_cognitive_distortion"],
    "DBT": ["dbt_emotion_regulation", "dbt_distress_tolerance"],
    "ACT": ["act_values_clarification", "act_mindful_presence"],
    "EFT": ["eft_emotion_mapping"],
    "SFBT": ["sfbt_solutions_focus"],
    "Mindfulness": ["mindfulness_body_scan", "mindfulness_three_minutes"],
  };
  const result: CoachingProgramId[] = [];
  for (const f of frameworkEmphasis) {
    const mapped = map[f];
    if (mapped) result.push(...mapped);
  }
  return result;
}
