"use client";

import { useState, useMemo } from "react";
import {
  Sparkles, Heart, Brain, Shield, Users, Target, BookOpen,
  Link2, Zap, Activity, Star, Check, ArrowRight, ArrowLeft
} from "lucide-react";
import {
  scoreFullDNA,
  EmotionalDNAScores,
  CognitiveDNAScores,
  RelationshipDNAScores,
  MotivationDNAScores,
  BehavioralDNAScores,
  WellnessDNAScores,
} from "@/lib/personality";

// ── Question bank types ──────────────────────────────────────────────────────

interface DNAQuestion {
  id: string;
  question: string;
  options: { label: string; value: number; description: string }[];
}

// ── Emotional DNA questions (27 items → 13 sub-dimensions) ──────────────────

const EMOTIONAL_QUESTIONS: DNAQuestion[] = [
  // granularity (3 items)
  { id: "em_gran_1", question: "When you feel something, how precisely can you name it?", options: [
    { label: "I can name exactly what I feel", value: 5, description: "Granular emotional vocabulary" },
    { label: "I struggle to put it into words", value: 1, description: "Emotions feel blurry" },
  ]},
  { id: "em_gran_2", question: "Do you notice subtle differences between similar feelings?", options: [
    { label: "Yes — I distinguish frustration from disappointment", value: 5, description: "Fine-grained awareness" },
    { label: "Not really — they all feel similar", value: 1, description: "Coarse emotional awareness" },
  ]},
  { id: "em_gran_3", question: "When asked 'how are you feeling?', how specific is your answer?", options: [
    { label: "I name the exact emotion and why", value: 5, description: "Precise" },
    { label: "I give a vague answer like 'okay' or 'stressed'", value: 1, description: "General" },
  ]},
  // regulation — reappraisal (2)
  { id: "em_reg_rap_1", question: "When something upsetting happens, can you reframe it in a less upsetting way?", options: [
    { label: "Yes — I readily find a different angle", value: 5, description: "Reappraisal comes naturally" },
    { label: "Rarely — I stay stuck in the initial reaction", value: 1, description: "Hard to reframe" },
  ]},
  { id: "em_reg_rap_2", question: "Do you believe your interpretation of events shapes how you feel?", options: [
    { label: "Strongly — I can choose my perspective", value: 5, description: "Believe in reappraisal" },
    { label: "Not really — events just happen to me", value: 1, description: "Feel powerless over interpretation" },
  ]},
  // regulation — suppression (2)
  { id: "em_reg_sup_1", question: "When you feel something difficult, do you push it down or hide it?", options: [
    { label: "Often — I keep emotions to myself", value: 5, description: "Suppression tendency" },
    { label: "Almost never — I express or process", value: 1, description: "Low suppression" },
  ]},
  { id: "em_reg_sup_2", question: "Do you feel it's inappropriate to show strong emotions?", options: [
    { label: "Yes — emotions should stay private", value: 5, description: "Suppression norm" },
    { label: "No — expressing emotions is healthy", value: 1, description: "Expression acceptable" },
  ]},
  // regulation — acceptance (2)
  { id: "em_reg_acc_1", question: "When you feel anxious or sad, can you just let the feeling be there without fighting it?", options: [
    { label: "Yes — I can make room for it", value: 5, description: "Acceptance-oriented" },
    { label: "No — I must fix or escape it immediately", value: 1, description: "Resistance tendency" },
  ]},
  { id: "em_reg_acc_2", question: "Do you see difficult emotions as passing states rather than problems to solve?", options: [
    { label: "Yes — they come and go", value: 5, description: "Accepting" },
    { label: "No — I treat them as threats", value: 1, description: "Threat-oriented" },
  ]},
  // regulation — expression (2)
  { id: "em_reg_exp_1", question: "How comfortable are you expressing your feelings to others?", options: [
    { label: "Very comfortable — I share openly", value: 5, description: "High expression comfort" },
    { label: "Very uncomfortable — I keep it inside", value: 1, description: "Low expression comfort" },
  ]},
  { id: "em_reg_exp_2", question: "Do you have people you can be emotionally honest with?", options: [
    { label: "Yes — several people", value: 5, description: "Strong support" },
    { label: "No — I'm emotionally self-contained", value: 1, description: "Limited emotional sharing" },
  ]},
  // regulation — distraction (2)
  { id: "em_reg_dist_1", question: "When something bothers you, do you distract yourself to cope?", options: [
    { label: "Often — I scroll, watch, or busy myself", value: 5, description: "Distraction coping" },
    { label: "Almost never — I sit with it", value: 1, description: "Sit-with-it style" },
  ]},
  { id: "em_reg_dist_2", question: "Is distraction your first response to emotional discomfort?", options: [
    { label: "Yes — it's my default", value: 5, description: "Default distraction" },
    { label: "No — I try to process first", value: 1, description: "Process-first" },
  ]},
  // regulation — ritual (2)
  { id: "em_reg_rit_1", question: "Do you have practices that help you regulate emotionally (breathing, walking, music)?", options: [
    { label: "Yes — several reliable practices", value: 5, description: "Ritual toolkit" },
    { label: "No — I don't have go-to practices", value: 1, description: "No ritual toolkit" },
  ]},
  { id: "em_reg_rit_2", question: "When you're dysregulated, do you have a reliable way to return to balance?", options: [
    { label: "Yes — something I do consistently", value: 5, description: "Reliable regulation" },
    { label: "No — I wing it each time", value: 1, description: "No reliable method" },
  ]},
  // regulation — withdrawal (2)
  { id: "em_reg_with_1", question: "When emotions are intense, do you withdraw from others?", options: [
    { label: "Yes — I isolate to cope", value: 5, description: "Withdrawal coping" },
    { label: "No — I reach out or stay present", value: 1, description: "Stay-engaged" },
  ]},
  { id: "em_reg_with_2", question: "Does emotional intensity make you want to be alone?", options: [
    { label: "Yes — solitude helps me regulate", value: 5, description: "Solitude-seeking" },
    { label: "No — I prefer connection when upset", value: 1, description: "Connection-seeking" },
  ]},
  // regulation — problem solve (2)
  { id: "em_reg_ps_1", question: "When you feel stressed, do you focus on solving the problem causing it?", options: [
    { label: "Yes — I target the source", value: 5, description: "Problem-solving approach" },
    { label: "No — I focus on the feeling itself", value: 1, description: "Emotion-focused" },
  ]},
  { id: "em_reg_ps_2", question: "Is 'fix the problem' your primary emotional regulation strategy?", options: [
    { label: "Yes — action over feeling", value: 5, description: "Problem-first" },
    { label: "No — I attend to the emotion", value: 1, description: "Emotion-first" },
  ]},
  // trigger sensitivity (2)
  { id: "em_trig_1", question: "How easily do things trigger strong emotional reactions in you?", options: [
    { label: "Very easily — I'm highly reactive", value: 5, description: "High trigger sensitivity" },
    { label: "Rarely — I stay even-keeled", value: 1, description: "Low trigger sensitivity" },
  ]},
  { id: "em_trig_2", question: "Small frustrations tend to escalate into big emotional responses for you?", options: [
    { label: "Yes — I escalate quickly", value: 5, description: "High escalation" },
    { label: "No — I stay proportional", value: 1, description: "Proportional response" },
  ]},
  // recovery speed (2)
  { id: "em_rec_1", question: "After an emotional upset, how long does it take you to return to baseline?", options: [
    { label: "Quickly — I recover in minutes or hours", value: 5, description: "Fast recovery" },
    { label: "A long time — I dwell for days", value: 1, description: "Slow recovery" },
  ]},
  { id: "em_rec_2", question: "Do emotional events stay with you for a long time?", options: [
    { label: "Yes — I replay them", value: 5, description: "Long dwell time" },
    { label: "No — I move on relatively quickly", value: 1, description: "Short dwell time" },
  ]},
  // expression comfort (1 — already covered above, use regulation-expression)
  // alexithymia tendency (2)
  { id: "em_alex_1", question: "Do you sometimes feel emotions in your body without being able to name them?", options: [
    { label: "Yes — I feel something but can't label it", value: 5, description: "Alexithymia tendency" },
    { label: "No — I can usually name what I feel", value: 1, description: "Good emotional labeling" },
  ]},
  { id: "em_alex_2", question: "Do you struggle to identify what you're feeling in the moment?", options: [
    { label: "Yes — it's often unclear", value: 5, description: "Identification difficulty" },
    { label: "No — I know what I feel", value: 1, description: "Clear identification" },
  ]},
  // emotional avoidance (2)
  { id: "em_avoid_1", question: "Do you try to avoid thinking about difficult emotions?", options: [
    { label: "Yes — I steer clear of them", value: 5, description: "Emotional avoidance" },
    { label: "No — I face them directly", value: 1, description: "Emotional approach" },
  ]},
  { id: "em_avoid_2", question: "Is it uncomfortable for you to sit with your own feelings?", options: [
    { label: "Yes — I prefer not to", value: 5, description: "Avoidance comfort" },
    { label: "No — I can be with my feelings", value: 1, description: "Approach comfort" },
  ]},
  // body awareness (2)
  { id: "em_body_1", question: "Can you feel emotions as physical sensations in your body?", options: [
    { label: "Yes — I notice where I hold tension, warmth, etc.", value: 5, description: "High body awareness" },
    { label: "No — I don't connect emotions to body", value: 1, description: "Low body awareness" },
  ]},
  { id: "em_body_2", question: "When you're stressed, do you notice where it shows up physically?", options: [
    { label: "Yes — I feel it in my chest, stomach, etc.", value: 5, description: "Somatic awareness" },
    { label: "No — I just feel 'stressed'", value: 1, description: "Non-somatic" },
  ]},
  // primary emotion access (2)
  { id: "em_primary_1", question: "Can you identify the core emotion beneath your surface reaction?", options: [
    { label: "Yes — I can go beneath the surface", value: 5, description: "Primary access" },
    { label: "No — I stay at the surface reaction", value: 1, description: "Surface-level only" },
  ]},
  { id: "em_primary_2", question: "When you're angry, can you tell if there's sadness or fear underneath?", options: [
    { label: "Yes — I can find the primary emotion", value: 5, description: "Deep access" },
    { label: "No — anger is just anger to me", value: 1, description: "Surface-only" },
  ]},
];

// ── Cognitive DNA questions (20 items → 13 sub-dimensions) ──────────────────

const COGNITIVE_QUESTIONS: DNAQuestion[] = [
  // cognitive style — reflective (2)
  { id: "cog_style_ref_1", question: "How do you typically process information?", options: [
    { label: "I reflect carefully before deciding", value: 5, description: "Reflective" },
    { label: "I go with my gut and adjust later", value: 1, description: "Intuitive" },
  ]},
  { id: "cog_style_ref_2", question: "When you have a decision to make, what's your instinct?", options: [
    { label: "Think it through thoroughly", value: 5, description: "Reflective" },
    { label: "Decide quickly based on feel", value: 1, description: "Intuitive" },
  ]},
  // cognitive style — intuitive (2)
  { id: "cog_style_int_1", question: "Do you often have strong gut feelings about things?", options: [
    { label: "Yes — my intuition is usually right", value: 5, description: "Strong intuition" },
    { label: "No — I trust analysis over instinct", value: 1, description: "Analysis-preferring" },
  ]},
  { id: "cog_style_int_2", question: "How often do you make decisions without much conscious reasoning?", options: [
    { label: "Often — I just know", value: 5, description: "Highly intuitive" },
    { label: "Rarely — I always reason it out", value: 1, description: "Deliberate" },
  ]},
  // need for cognition (2)
  { id: "cog_nfc_1", question: "Do you enjoy thinking deeply about complex problems?", options: [
    { label: "Yes — I love a good mental challenge", value: 5, description: "High need for cognition" },
    { label: "No — I prefer things simple", value: 1, description: "Low need for cognition" },
  ]},
  { id: "cog_nfc_2", question: "How much do you enjoy activities that require mental effort?", options: [
    { label: "I seek them out", value: 5, description: "High NFC" },
    { label: "I avoid them when I can", value: 1, description: "Low NFC" },
  ]},
  // ambiguity tolerance (2)
  { id: "cog_amb_1", question: "How comfortable are you with unclear or uncertain situations?", options: [
    { label: "Very comfortable — ambiguity doesn't bother me", value: 5, description: "High tolerance" },
    { label: "Very uncomfortable — I need clarity", value: 1, description: "Low tolerance" },
  ]},
  { id: "cog_amb_2", question: "When you don't have enough information, can you move forward anyway?", options: [
    { label: "Yes — I can act amid uncertainty", value: 5, description: "Comfortable with ambiguity" },
    { label: "No — I need more data first", value: 1, description: "Need clarity" },
  ]},
  // rumination propensity (2)
  { id: "cog_rum_1", question: "Do you find yourself thinking about the same thing over and over?", options: [
    { label: "Yes — I get stuck in thought loops", value: 5, description: "High rumination" },
    { label: "No — I move on after thinking", value: 1, description: "Low rumination" },
  ]},
  { id: "cog_rum_2", question: "After a difficult event, do you keep replaying it in your mind?", options: [
    { label: "Yes — I dwell on it extensively", value: 5, description: "High dwell" },
    { label: "No — I process and move on", value: 1, description: "Low dwell" },
  ]},
  // optimism bias (2)
  { id: "cog_opt_1", question: "Do you tend to expect good outcomes more than bad ones?", options: [
    { label: "Yes — I'm naturally optimistic", value: 5, description: "Optimistic" },
    { label: "No — I expect things to go wrong", value: 1, description: "Pessimistic" },
  ]},
  { id: "cog_opt_2", question: "When you think about the future, is your default expectation positive?", options: [
    { label: "Yes — I expect things to work out", value: 5, description: "Positive default" },
    { label: "No — I brace for problems", value: 1, description: "Negative default" },
  ]},
  // distortion — mind reading (2)
  { id: "cog_dist_mr_1", question: "Do you often assume you know what others are thinking about you?", options: [
    { label: "Yes — I read people's minds (and usually assume negative)", value: 5, description: "Mind-reading tendency" },
    { label: "No — I check rather than assume", value: 1, description: "Low mind-reading" },
  ]},
  { id: "cog_dist_mr_2", question: "Do you catch yourself thinking 'they probably think I'm...' without evidence?", options: [
    { label: "Yes — I do this often", value: 5, description: "Mind-reading distortion" },
    { label: "No — I stay grounded in what I know", value: 1, description: "Grounded" },
  ]},
  // distortion — catastrophizing (2)
  { id: "cog_dist_cat_1", question: "When something goes wrong, do you tend to imagine the worst-case scenario?", options: [
    { label: "Yes — I jump to the worst outcome", value: 5, description: "Catastrophizing" },
    { label: "No — I stay realistic", value: 1, description: "Realistic" },
  ]},
  { id: "cog_dist_cat_2", question: "Do you find yourself thinking 'this is going to be a disaster' before knowing the outcome?", options: [
    { label: "Yes — I catastrophize frequently", value: 5, description: "High catastrophizing" },
    { label: "No — I stay proportional", value: 1, description: "Proportional" },
  ]},
  // distortion — overgeneralization (2)
  { id: "cog_dist_og_1", question: "When one thing goes wrong, do you tend to think everything is going wrong?", options: [
    { label: "Yes — I generalize from one event", value: 5, description: "Overgeneralizing" },
    { label: "No — I see events as specific", value: 1, description: "Specific" },
  ]},
  { id: "cog_dist_og_2", question: "Do you catch yourself using words like 'always' or 'never' about negative events?", options: [
    { label: "Yes — I overgeneralize often", value: 5, description: "Overgeneralization" },
    { label: "No — I stay specific", value: 1, description: "Specific" },
  ]},
  // distortion — all or nothing (2)
  { id: "cog_dist_aon_1", question: "Do you tend to see things as either perfect or a total failure?", options: [
    { label: "Yes — black and white thinking", value: 5, description: "All-or-nothing" },
    { label: "No — I see the shades of gray", value: 1, description: "Nuanced" },
  ]},
  { id: "cog_dist_aon_2", question: "Is your standard for success extremely high — anything less is failure?", options: [
    { label: "Yes — perfectionist or nothing", value: 5, description: "All-or-nothing standard" },
    { label: "No — I accept good-enough", value: 1, description: "Flexible standard" },
  ]},
  // distortion — emotional reasoning (2)
  { id: "cog_dist_er_1", question: "Do you trust your feelings as evidence of the truth?", options: [
    { label: "Yes — if I feel it, it must be true", value: 5, description: "Emotional reasoning" },
    { label: "No — feelings aren't facts", value: 1, description: "Separate feeling from fact" },
  ]},
  { id: "cog_dist_er_2", question: "Do you think 'I feel like a failure, so I must be one'?", options: [
    { label: "Yes — feelings guide my conclusions about reality", value: 5, description: "Emotional reasoning" },
    { label: "No — I separate feeling from fact", value: 1, description: "Separate" },
  ]},
  // analysis paralysis (2)
  { id: "cog_ap_1", question: "Do you sometimes spend so long analyzing a decision that you get stuck?", options: [
    { label: "Yes — I over-analyze and delay", value: 5, description: "Analysis paralysis" },
    { label: "No — I decide and move", value: 1, description: "Decisive" },
  ]},
  { id: "cog_ap_2", question: "Is it hard for you to make a decision because you want to consider every angle?", options: [
    { label: "Yes — I get stuck in analysis", value: 5, description: "High paralysis" },
    { label: "No — I can decide with incomplete information", value: 1, description: "Comfortable deciding" },
  ]},
  // information processing speed (2)
  { id: "cog_ips_1", question: "How quickly do you process new information?", options: [
    { label: "Quickly — I absorb and respond fast", value: 5, description: "Fast processing" },
    { label: "Slowly — I need time to process", value: 1, description: "Slow processing" },
  ]},
  { id: "cog_ips_2", question: "Do you prefer to take your time with decisions rather than decide quickly?", options: [
    { label: "Yes — I like to reflect", value: 5, description: "Deliberate pace" },
    { label: "No — I decide on the spot", value: 1, description: "Fast pace" },
  ]},
];

// ── Relationship DNA questions (21 items → 11 sub-dimensions) ────────────────

const RELATIONSHIP_QUESTIONS: DNAQuestion[] = [
  // attachment anxiety (3)
  { id: "rel_att_anx_1", question: "I worry that my close relationships won't last.", options: [
    { label: "Strongly agree — I often fear loss", value: 5, description: "High attachment anxiety" },
    { label: "Strongly disagree — I trust relationships", value: 1, description: "Low attachment anxiety" },
  ]},
  { id: "rel_att_anx_2", question: "I worry that people I'm close to don't really love me.", options: [
    { label: "Strongly agree — I doubt others' love", value: 5, description: "High doubt" },
    { label: "Strongly disagree — I feel secure in love", value: 1, description: "Low doubt" },
  ]},
  { id: "rel_att_anx_3", question: "When I'm apart from someone I love, I worry something bad will happen.", options: [
    { label: "Strongly agree — separation anxiety", value: 5, description: "Separation anxiety" },
    { label: "Strongly disagree — I'm fine with distance", value: 1, description: "Comfortable with distance" },
  ]},
  { id: "rel_att_anx_4", question: "I need a lot of reassurance that people care about me.", options: [
    { label: "Strongly agree — I need frequent reassurance", value: 5, description: "High reassurance need" },
    { label: "Strongly disagree — I feel secure without it", value: 1, description: "Self-assured" },
  ]},
  // attachment avoidance (3)
  { id: "rel_att_av_1", question: "I prefer not to show people how I feel deeply.", options: [
    { label: "Strongly agree — I keep emotions private", value: 5, description: "High avoidance" },
    { label: "Strongly disagree — I share openly", value: 1, description: "Low avoidance" },
  ]},
  { id: "rel_att_av_2", question: "I'm comfortable being independent and don't need close relationships.", options: [
    { label: "Strongly agree — independence is enough", value: 5, description: "High self-reliance" },
    { label: "Strongly disagree — I value close connection", value: 1, description: "Connection-valuing" },
  ]},
  { id: "rel_att_av_3", question: "I find it hard to let myself depend on others.", options: [
    { label: "Strongly agree — dependence feels unsafe", value: 5, description: "High avoidance" },
    { label: "Strongly disagree — I'm comfortable relying on others", value: 1, description: "Comfortable dependence" },
  ]},
  { id: "rel_att_av_4", question: "I don't like getting too close to people — it feels like losing myself.", options: [
    { label: "Strongly agree — closeness threatens independence", value: 5, description: "Engulfment fear" },
    { label: "Strongly disagree — closeness doesn't threaten me", value: 1, description: "Comfortable closeness" },
  ]},
  // communication directness (2)
  { id: "rel_comm_dir_1", question: "When something bothers me in a relationship, I bring it up directly.", options: [
    { label: "Strongly agree — I speak directly", value: 5, description: "Direct communication" },
    { label: "Strongly disagree — I avoid bringing it up", value: 1, description: "Indirect / avoidant" },
  ]},
  { id: "rel_comm_dir_2", question: "I'm comfortable telling people what I need from them.", options: [
    { label: "Strongly agree — I ask clearly", value: 5, description: "Clear asker" },
    { label: "Strongly disagree — I hope they figure it out", value: 1, description: "Indirect" },
  ]},
  // conflict — confront (2)
  { id: "rel_conf_con_1", question: "When there's a disagreement, I address it head-on rather than letting it go.", options: [
    { label: "Strongly agree — I engage directly", value: 5, description: "Confrontational (healthy)" },
    { label: "Strongly disagree — I prefer to let it pass", value: 1, description: "Conflict-avoidant" },
  ]},
  { id: "rel_conf_con_2", question: "I'm willing to have uncomfortable conversations to resolve issues.", options: [
    { label: "Strongly agree — I lean into discomfort", value: 5, description: "Comfort with hard talk" },
    { label: "Strongly disagree — I avoid uncomfortable talks", value: 1, description: "Avoids hard talk" },
  ]},
  // conflict — avoid (2)
  { id: "rel_conf_avoid_1", question: "When conflict arises, my instinct is to keep the peace rather than address it.", options: [
    { label: "Strongly agree — I prioritize peace", value: 5, description: "Peace-priority" },
    { label: "Strongly disagree — I prioritize resolution", value: 1, description: "Resolution-priority" },
  ]},
  { id: "rel_conf_avoid_2", question: "I often let things go rather than risk a confrontation.", options: [
    { label: "Strongly agree — I let things slide", value: 5, description: "High avoidance" },
    { label: "Strongly disagree — I address things", value: 1, description: "Addresses things" },
  ]},
  // conflict — accommodate (2)
  { id: "rel_conf_acc_1", question: "I tend to give in during disagreements to maintain harmony.", options: [
    { label: "Strongly agree — I accommodate others", value: 5, description: "High accommodation" },
    { label: "Strongly disagree — I stand my ground", value: 1, description: "Low accommodation" },
  ]},
  { id: "rel_conf_acc_2", question: "My priority in conflict is making sure everyone feels okay, even if it means I compromise a lot.", options: [
    { label: "Strongly agree — harmony over being right", value: 5, description: "Harmony-focused" },
    { label: "Strongly disagree — I care about the outcome", value: 1, description: "Outcome-focused" },
  ]},
  // intimacy pacing (2)
  { id: "rel_int_pace_1", question: "How quickly do you open up to new people?", options: [
    { label: "Slowly — I take time to trust", value: 5, description: "Slow-paced" },
    { label: "Quickly — I open up fast", value: 1, description: "Fast-paced" },
  ]},
  { id: "rel_int_pace_2", question: "I prefer to build trust gradually rather than all at once.", options: [
    { label: "Strongly agree — gradual trust", value: 5, description: "Gradual pacer" },
    { label: "Strongly disagree — I trust quickly", value: 1, description: "Quick truster" },
  ]},
  // trust baseline (2)
  { id: "rel_trust_1", question: "My default assumption about people is that they have good intentions.", options: [
    { label: "Strongly agree — I trust readily", value: 5, description: "High trust baseline" },
    { label: "Strongly disagree — I'm cautious", value: 1, description: "Low trust baseline" },
  ]},
  { id: "rel_trust_2", question: "When someone does something ambiguous, I assume the best rather than the worst.", options: [
    { label: "Strongly agree — I give benefit of the doubt", value: 5, description: "High trust" },
    { label: "Strongly disagree — I assume the worst", value: 1, description: "Low trust" },
  ]},
  // social energy budget (2)
  { id: "rel_social_energy_1", question: "After social events, I need significant time alone to recharge.", options: [
    { label: "Strongly agree — high social energy cost", value: 5, description: "Introverted energy" },
    { label: "Strongly disagree — I'm energized by socializing", value: 1, description: "Extroverted energy" },
  ]},
  { id: "rel_social_energy_2", question: "Social interaction drains me more than it energizes me.", options: [
    { label: "Strongly agree — social is draining", value: 5, description: "Draining" },
    { label: "Strongly disagree — social is energizing", value: 1, description: "Energizing" },
  ]},
  // people reading accuracy (2)
  { id: "rel_people_read_1", question: "I'm good at reading what others are feeling without them saying it.", options: [
    { label: "Strongly agree — I read people well", value: 5, description: "High accuracy" },
    { label: "Strongly disagree — I miss social cues", value: 1, description: "Low accuracy" },
  ]},
  { id: "rel_people_read_2", question: "I can usually tell when someone is upset, even if they don't say it.", options: [
    { label: "Strongly agree — I notice shifts", value: 5, description: "High attunement" },
    { label: "Strongly disagree — I miss it", value: 1, description: "Low attunement" },
  ]},
  // interdependence style (2)
  { id: "rel_interdep_1", question: "In close relationships, do you prefer an interdependent style (shared life) or independent (separate lives)?", options: [
    { label: "Interdependent — we're a team, lives intertwined", value: 5, description: "Interdependent" },
    { label: "Independent — we're partners but separate", value: 1, description: "Independent" },
  ]},
  { id: "rel_interdep_2", question: "How much do you prefer your life to be intertwined with your close relationships?", options: [
    { label: "Very intertwined — shared everything", value: 5, description: "High interdependence" },
    { label: "Very separate — autonomous lives", value: 1, description: "Low interdependence" },
  ]},
];

// ── Motivation DNA questions (13 items → 13 sub-dimensions) ──────────────────

const MOTIVATION_QUESTIONS: DNAQuestion[] = [
  // SDT — autonomy (2)
  { id: "mot_sdt_aut_1", question: "I feel like my daily activities are chosen by me, not imposed on me.", options: [
    { label: "Strongly agree — I'm self-directed", value: 5, description: "High autonomy" },
    { label: "Strongly disagree — I feel controlled", value: 1, description: "Low autonomy" },
  ]},
  { id: "mot_sdt_aut_2", question: "My actions align with my own values rather than external expectations.", options: [
    { label: "Strongly agree — I act from my values", value: 5, description: "Autonomous" },
    { label: "Strongly disagree — I act from pressure", value: 1, description: "Controlled" },
  ]},
  // SDT — competence (2)
  { id: "mot_sdt_comp_1", question: "I feel capable and effective in what I do.", options: [
    { label: "Strongly agree — I feel competent", value: 5, description: "High competence" },
    { label: "Strongly disagree — I feel ineffective", value: 1, description: "Low competence" },
  ]},
  { id: "mot_sdt_comp_2", question: "I believe I can grow and improve at things I care about.", options: [
    { label: "Strongly agree — I'm capable of growth", value: 5, description: "High competence" },
    { label: "Strongly disagree — I feel stuck", value: 1, description: "Low competence" },
  ]},
  // SDT — relatedness (2)
  { id: "mot_sdt_rel_1", question: "I feel a sense of belonging and connection with others.", options: [
    { label: "Strongly agree — I feel connected", value: 5, description: "High relatedness" },
    { label: "Strongly disagree — I feel isolated", value: 1, description: "Low relatedness" },
  ]},
  { id: "mot_sdt_rel_2", question: "I have people I feel genuinely close to.", options: [
    { label: "Strongly agree — I have close bonds", value: 5, description: "High relatedness" },
    { label: "Strongly disagree — I feel disconnected", value: 1, description: "Low relatedness" },
  ]},
  // intrinsic orientation (1)
  { id: "mot_intrin_1", question: "I do things because I genuinely enjoy them, not for external rewards.", options: [
    { label: "Strongly agree — I'm intrinsically driven", value: 5, description: "High intrinsic" },
    { label: "Strongly disagree — I need external motivation", value: 1, description: "Low intrinsic" },
  ]},
  // extrinsic orientation (1)
  { id: "mot_extrin_1", question: "I'm motivated more by external rewards and recognition than internal satisfaction.", options: [
    { label: "Strongly agree — external rewards drive me", value: 5, description: "High extrinsic" },
    { label: "Strongly disagree — I'm internally motivated", value: 1, description: "Low extrinsic" },
  ]},
  // identified regulation (1)
  { id: "mot_id_reg_1", question: "I do things because I personally value them, even if they're not fun.", options: [
    { label: "Strongly agree — I act from personal endorsement", value: 5, description: "High identified regulation" },
    { label: "Strongly disagree — I struggle to find personal meaning", value: 1, description: "Low identified regulation" },
  ]},
  // introjected regulation (1)
  { id: "mot_intro_reg_1", question: "I do things to avoid guilt or shame rather than from genuine desire.", options: [
    { label: "Strongly agree — I'm driven by internal pressure", value: 5, description: "High introjection" },
    { label: "Strongly disagree — I act from choice", value: 1, description: "Low introjection" },
  ]},
  // external regulation (1)
  { id: "mot_ext_reg_1", question: "I do things primarily because others expect me to.", options: [
    { label: "Strongly agree — external expectations drive me", value: 5, description: "High external regulation" },
    { label: "Strongly disagree — my own reasons matter more", value: 1, description: "Low external regulation" },
  ]},
  // growth mindset (1)
  { id: "mot_gm_1", question: "I believe my abilities can be developed through effort and learning.", options: [
    { label: "Strongly agree — growth mindset", value: 5, description: "Growth mindset" },
    { label: "Strongly disagree — abilities are fixed", value: 1, description: "Fixed mindset" },
  ]},
  // avoidance motivation (1)
  { id: "mot_avoid_1", question: "I'm more motivated by avoiding negative outcomes than pursuing positive ones.", options: [
    { label: "Strongly agree — avoidance drives me", value: 5, description: "High avoidance" },
    { label: "Strongly disagree — I pursue positive goals", value: 1, description: "High approach" },
  ]},
  // approach motivation (1)
  { id: "mot_app_1", question: "I'm energized by moving toward what I want rather than away from what I fear.", options: [
    { label: "Strongly agree — approach-oriented", value: 5, description: "High approach" },
    { label: "Strongly disagree — I'm driven by fear of failure", value: 1, description: "High avoidance" },
  ]},
  // streak motivation (1)
  { id: "mot_streak_1", question: "Keeping a streak alive is a powerful motivator for me.", options: [
    { label: "Strongly agree — streaks matter a lot", value: 5, description: "High streak motivation" },
    { label: "Strongly disagree — streaks don't motivate me", value: 1, description: "Low streak motivation" },
  ]},
  // outcome motivation (1)
  { id: "mot_outcome_1", question: "I'm motivated by the concrete outcome I'll achieve, not just the process.", options: [
    { label: "Strongly agree — outcomes drive me", value: 5, description: "High outcome focus" },
    { label: "Strongly disagree — I value the journey", value: 1, description: "Process focus" },
  ]},
];

// ── Behavioral DNA questions (10 items → 10 sub-dimensions) ──────────────────

const BEHAVIORAL_QUESTIONS: DNAQuestion[] = [
  // self-monitoring frequency (2)
  { id: "beh_sm_1", question: "How often do you reflect on your own behavior and choices?", options: [
    { label: "Frequently — I self-monitor regularly", value: 5, description: "High self-monitoring" },
    { label: "Rarely — I don't reflect much", value: 1, description: "Low self-monitoring" },
  ]},
  { id: "beh_sm_2", question: "Do you notice patterns in your own behavior over time?", options: [
    { label: "Yes — I see my patterns clearly", value: 5, description: "High pattern awareness" },
    { label: "No — my behavior feels random to me", value: 1, description: "Low pattern awareness" },
  ]},
  // self-report accuracy (2)
  { id: "beh_sra_1", question: "When you describe your feelings or behavior, how accurate are you?", options: [
    { label: "Very accurate — I know myself well", value: 5, description: "High self-report accuracy" },
    { label: "Not very — I misjudge myself", value: 1, description: "Low self-report accuracy" },
  ]},
  { id: "beh_sra_2", question: "Do you tend to see yourself more positively or negatively than is accurate?", options: [
    { label: "I see myself accurately", value: 5, description: "Accurate self-view" },
    { label: "I have a skewed self-view (positive or negative)", value: 1, description: "Skewed self-view" },
  ]},
  // routine structure orientation (2)
  { id: "beh_rs_1", question: "How much do you thrive on clear routines and structure?", options: [
    { label: "A lot — routines make me feel grounded", value: 5, description: "High structure orientation" },
    { label: "Not at all — I resist structure", value: 1, description: "Low structure orientation" },
  ]},
  { id: "beh_rs_2", question: "Do you have established daily routines that you follow consistently?", options: [
    { label: "Yes — I have strong routines", value: 5, description: "Routine-oriented" },
    { label: "No — my days are unstructured", value: 1, description: "Unstructured" },
  ]},
  // impulse regulation (2)
  { id: "beh_ir_1", question: "How easily can you pause an impulse before acting on it?", options: [
    { label: "Very easily — I have strong impulse control", value: 5, description: "High impulse regulation" },
    { label: "Not easily — I act on impulse", value: 1, description: "Low impulse regulation" },
  ]},
  { id: "beh_ir_2", question: "Do you often act on impulse and then regret it?", options: [
    { label: "Yes — I act impulsively and regret it", value: 5, description: "High impulse issues" },
    { label: "No — I think before I act", value: 1, description: "Low impulse issues" },
  ]},
  // habit formation susceptibility (2)
  { id: "beh_hfs_1", question: "How easily do you form new habits?", options: [
    { label: "Very easily — habits come naturally", value: 5, description: "High habit formation" },
    { label: "Very difficultly — habits are hard", value: 1, description: "Low habit formation" },
  ]},
  { id: "beh_hfs_2", question: "Once you start a new behavior, how long does it take to become automatic?", options: [
    { label: "Quickly — habits form fast", value: 5, description: "Fast habit formation" },
    { label: "Slowly — habits take a long time", value: 1, description: "Slow habit formation" },
  ]},
  // environmental cue sensitivity (1)
  { id: "beh_ecs_1", question: "How much do environmental cues (time, place, other people) trigger your behaviors?", options: [
    { label: "A lot — cues strongly drive my behavior", value: 5, description: "High cue sensitivity" },
    { label: "Not much — I act independently of cues", value: 1, description: "Low cue sensitivity" },
  ]},
  // implementation intention readiness (1)
  { id: "beh_iir_1", question: "Do you naturally think in 'if-then' terms (if X happens, I'll do Y)?", options: [
    { label: "Yes — I plan in if-then form", value: 5, description: "High IIR readiness" },
    { label: "No — I don't plan that way", value: 1, description: "Low IIR readiness" },
  ]},
  // consistency tendency (1)
  { id: "beh_cons_1", question: "Once you commit to something, how consistent are you?", options: [
    { label: "Very consistent — I follow through", value: 5, description: "High consistency" },
    { label: "Not consistent — I drift off", value: 1, description: "Low consistency" },
  ]},
  // flexibility tendency (1)
  { id: "beh_flex_1", question: "When your plans change, how well do you adapt?", options: [
    { label: "Very well — I'm flexible and adaptable", value: 5, description: "High flexibility" },
    { label: "Poorly — changes throw me off", value: 1, description: "Low flexibility" },
  ]},
  // self-reflection depth (1)
  { id: "beh_sr_1", question: "How deeply do you reflect on your experiences and what they mean for you?", options: [
    { label: "Very deeply — I extract meaning and insight", value: 5, description: "High reflection depth" },
    { label: "Not deeply — I skim the surface", value: 1, description: "Low reflection depth" },
  ]},
];

// ── Wellness DNA questions (12 items → 12 sub-dimensions) ────────────────────

const WELLNESS_QUESTIONS: DNAQuestion[] = [
  // stress baseline (2)
  { id: "wl_stress_base_1", question: "How would you describe your typical stress level?", options: [
    { label: "High — I carry a lot of stress", value: 5, description: "High stress baseline" },
    { label: "Low — I'm generally relaxed", value: 1, description: "Low stress baseline" },
  ]},
  { id: "wl_stress_base_2", question: "How often do you feel stressed in your daily life?", options: [
    { label: "Very often — stress is frequent", value: 5, description: "High frequency stress" },
    { label: "Rarely — I'm mostly calm", value: 1, description: "Low frequency stress" },
  ]},
  // stress trigger count (2)
  { id: "wl_stress_trig_1", question: "How many different things tend to trigger stress for you?", options: [
    { label: "Many — lots of things stress me", value: 5, description: "High trigger count" },
    { label: "Few — only specific things trigger me", value: 1, description: "Low trigger count" },
  ]},
  { id: "wl_stress_trig_2", question: "How easily do small things send you into stress?", options: [
    { label: "Very easily — small things trigger me", value: 5, description: "High sensitivity" },
    { label: "Not easily — I need big things to stress me", value: 1, description: "Low sensitivity" },
  ]},
  // energy baseline (2)
  { id: "wl_energy_base_1", question: "How would you describe your typical energy level?", options: [
    { label: "High — I have lots of energy", value: 5, description: "High energy baseline" },
    { label: "Low — I often feel drained", value: 1, description: "Low energy baseline" },
  ]},
  { id: "wl_energy_base_2", question: "How often do you feel fatigued or low-energy?", options: [
    { label: "Very often — fatigue is frequent", value: 5, description: "High fatigue" },
    { label: "Rarely — I have good energy", value: 1, description: "Low fatigue" },
  ]},
  // energy drain sources (2)
  { id: "wl_energy_drain_1", question: "What drains your energy the most?", options: [
    { label: "Work and obligations", value: 5, description: "Work drain" },
    { label: "Social interaction", value: 4, description: "Social drain" },
    { label: "Emotional processing", value: 3, description: "Emotional drain" },
    { label: "Physical demands", value: 2, description: "Physical drain" },
    { label: "Uncertainty and worry", value: 1, description: "Mental drain" },
  ]},
  { id: "wl_energy_drain_2", question: "What replenishes your energy the most?", options: [
    { label: "Rest and solitude", value: 5, description: "Rest replenishes" },
    { label: "Connecting with close people", value: 4, description: "Connection replenishes" },
    { label: "Movement and exercise", value: 3, description: "Movement replenishes" },
    { label: "Creative or meaningful work", value: 2, description: "Meaning replenishes" },
    { label: "Nature and outdoors", value: 1, description: "Nature replenishes" },
  ]},
  // recovery method effectiveness (2)
  { id: "wl_rec_eff_1", question: "How well do your current stress-recovery methods work for you?", options: [
    { label: "Very well — they work great", value: 5, description: "High effectiveness" },
    { label: "Poorly — they don't help much", value: 1, description: "Low effectiveness" },
  ]},
  { id: "wl_rec_eff_2", question: "When you're stressed, do you have reliable ways to recover?", options: [
    { label: "Yes — I have effective recovery tools", value: 5, description: "Strong recovery" },
    { label: "No — I don't have good recovery methods", value: 1, description: "Weak recovery" },
  ]},
  // sleep quality self-report (2)
  { id: "wl_sleep_1", question: "How would you rate your sleep quality?", options: [
    { label: "Very good — I sleep well", value: 5, description: "High sleep quality" },
    { label: "Poor — I sleep badly", value: 1, description: "Low sleep quality" },
  ]},
  { id: "wl_sleep_2", question: "Do you wake up feeling rested?", options: [
    { label: "Yes — I wake up refreshed", value: 5, description: "Restorative sleep" },
    { label: "No — I wake up tired", value: 1, description: "Non-restorative sleep" },
  ]},
  // lifestyle health self-report (1)
  { id: "wl_lifestyle_1", question: "How would you describe your overall lifestyle health (movement, nutrition, sleep, stress management)?", options: [
    { label: "Very healthy — I take good care of myself", value: 5, description: "High lifestyle health" },
    { label: "Poor — I neglect my health", value: 1, description: "Low lifestyle health" },
  ]},
  // wellness goal hierarchy (1)
  { id: "wl_goal_hier_1", question: "How clear are you about your wellness priorities and goals?", options: [
    { label: "Very clear — I know what matters", value: 5, description: "Clear wellness goals" },
    { label: "Not clear — I'm unsure what to focus on", value: 1, description: "Unclear wellness goals" },
  ]},
  // openness to interventions (1)
  { id: "wl_open_int_1", question: "How open are you to trying new approaches to improving your wellness?", options: [
    { label: "Very open — I love to try new things", value: 5, description: "High openness" },
    { label: "Not open — I stick with what I know", value: 1, description: "Low openness" },
  ]},
  // somatic awareness (1)
  { id: "wl_som_1", question: "How tuned in are you to your body's signals (fatigue, tension, hunger, etc.)?", options: [
    { label: "Very tuned in — I notice body signals", value: 5, description: "High somatic awareness" },
    { label: "Not tuned in — I ignore body signals", value: 1, description: "Low somatic awareness" },
  ]},
  // help seeking style (1)
  { id: "wl_help_1", question: "When you're struggling, how likely are you to seek help or support?", options: [
    { label: "Very likely — I reach out", value: 5, description: "High help-seeking" },
    { label: "Very unlikely — I handle it alone", value: 1, description: "Low help-seeking" },
  ]},
  // ritual comfort (1)
  { id: "wl_ritual_1", question: "How comfortable are you with incorporating rituals or routines into your wellness practice?", options: [
    { label: "Very comfortable — rituals appeal to me", value: 5, description: "High ritual comfort" },
    { label: "Not comfortable — rituals feel rigid", value: 1, description: "Low ritual comfort" },
  ]},
];

// ── Step type (extended with 6 new DNA axes) ──────────────────────────────────

type Step =
  | "welcome"
  | "questions-phase1"
  | "questions-hexo"
  | "questions-enneagram"
  | "questions-disc"
  | "questions-love"
  | "attachment"
  | "goals"
  | "questions-emotional"
  | "questions-cognitive"
  | "questions-relationship"
  | "questions-motivation"
  | "questions-behavioral"
  | "questions-wellness"
  | "complete";

// ── Assessment component ──────────────────────────────────────────────────────
// ── Phase One questions (existing) ────────────────────────────────────────────

const phaseOneQuestions = [
  {
    id: "energy",
    question: "How do you typically recharge your energy?",
    options: [
      { label: "Time alone", value: 1, description: "Solitude restores me" },
      { label: "Time with others", value: 5, description: "Socializing energizes me" },
    ],
  },
  {
    id: "structure",
    question: "How do you approach plans and schedules?",
    options: [
      { label: "I love structure", value: 1, description: "Plans give me peace" },
      { label: "I prefer flexibility", value: 5, description: "I go with the flow" },
    ],
  },
  {
    id: "emotions",
    question: "How do you relate to your emotions?",
    options: [
      { label: "I feel deeply", value: 5, description: "Emotions are vivid to me" },
      { label: "I keep emotions private", value: 1, description: "I process internally" },
    ],
  },
  {
    id: "decisions",
    question: "How do you usually make decisions?",
    options: [
      { label: "Logic and analysis", value: 1, description: "I weigh the facts" },
      { label: "Values and feelings", value: 5, description: "I follow my gut" },
    ],
  },
  {
    id: "change",
    question: "How do you handle new experiences?",
    options: [
      { label: "I love novelty", value: 5, description: "New things excite me" },
      { label: "I prefer familiarity", value: 1, description: "Known is comfortable" },
    ],
  },
  {
    id: "conflict",
    question: "When there's disagreement, I tend to...",
    options: [
      { label: "Avoid it", value: 1, description: "Harmony matters" },
      { label: "Address it directly", value: 5, description: "I speak my truth" },
    ],
  },
];

const attachmentOptions = [
  { label: "Comfortable with closeness", value: "secure", description: "I trust and connect easily" },
  { label: "I worry about abandonment", value: "anxious", description: "I sometimes fear losing connection" },
  { label: "I value independence", value: "avoidant", description: "I keep some distance" },
  { label: "I want closeness but find it hard", value: "fearful", description: "I'm cautious about getting close" },
];

// ── HEXACO questions (existing) ──────────────────────────────────────────────

interface HexacoQuestion {
  id: string;
  dimension: "honestyHumility" | "emotionality" | "extraversion" | "agreeableness" | "conscientiousness" | "openness";
  question: string;
  options: { label: string; value: number; description: string }[];
}

const hexacoQuestions: HexacoQuestion[] = [
  {
    id: "HH_q1",
    dimension: "honestyHumility",
    question: "If I knew I could never get caught, I would still not cheat or steal.",
    options: [
      { label: "Strongly agree", value: 5, description: "My honesty isn't just about consequences" },
      { label: "Strongly disagree", value: 1, description: "I'd take the opportunity if there were no risks" },
    ],
  },
  {
    id: "HH_q2",
    dimension: "honestyHumility",
    question: "I would never accept a bribe, even if it were very large.",
    options: [
      { label: "Strongly agree", value: 5, description: "I don't let money sway my ethics" },
      { label: "Strongly disagree", value: 1, description: "Money changes what's reasonable" },
    ],
  },
  {
    id: "EM_q1",
    dimension: "emotionality",
    question: "I feel my emotions very intensely.",
    options: [
      { label: "Strongly agree", value: 5, description: "I feel things vividly" },
      { label: "Strongly disagree", value: 1, description: "I stay emotionally even" },
    ],
  },
  {
    id: "EM_q2",
    dimension: "emotionality",
    question: "When I'm stressed, I need someone to lean on.",
    options: [
      { label: "Strongly agree", value: 5, description: "I seek support when overwhelmed" },
      { label: "Strongly disagree", value: 1, description: "I handle stress alone" },
    ],
  },
  {
    id: "EX_q1",
    dimension: "extraversion",
    question: "I like to be the center of attention in social situations.",
    options: [
      { label: "Strongly agree", value: 5, description: "I enjoy being noticed" },
      { label: "Strongly disagree", value: 1, description: "I prefer to stay in the background" },
    ],
  },
  {
    id: "AG_q1",
    dimension: "agreeableness",
    question: "I usually forgive people who have hurt me.",
    options: [
      { label: "Strongly agree", value: 5, description: "I let go of grudges easily" },
      { label: "Strongly disagree", value: 1, description: "I hold onto hurts" },
    ],
  },
  {
    id: "CO_q1",
    dimension: "conscientiousness",
    question: "I always keep my promises, even when it's difficult.",
    options: [
      { label: "Strongly agree", value: 5, description: "My word is absolute" },
      { label: "Strongly disagree", value: 1, description: "Circumstances can change things" },
    ],
  },
  {
    id: "OP_q1",
    dimension: "openness",
    question: "I enjoy thinking about abstract ideas and philosophical questions.",
    options: [
      { label: "Strongly agree", value: 5, description: "I love abstract thinking" },
      { label: "Strongly disagree", value: 1, description: "I prefer concrete, practical thinking" },
    ],
  },
];

// ── Enneagram questions (existing) ──────────────────────────────────────────

interface EnneagramQuestion {
  id: string;
  question: string;
  options: { label: string; value: number; description: string }[];
}

const enneagramQuestions: EnneagramQuestion[] = [
  {
    id: "EN_q1",
    question: "What matters most to you in life?",
    options: [
      { label: "Being capable and knowledgeable", value: 5, description: "You want to understand things deeply" },
      { label: "Feeling secure and supported", value: 6, description: "You value stability and trust" },
      { label: "Being peaceful and happy", value: 9, description: "You want harmony and contentment" },
      { label: "Being loved and needed", value: 2, description: "You find meaning in helping others" },
      { label: "Being joyful and free", value: 7, description: "You want to experience everything" },
    ],
  },
  {
    id: "EN_q2",
    question: "Under stress, you tend to...",
    options: [
      { label: "Withdraw and analyze", value: 5, description: "You go inward to figure things out" },
      { label: "Worry and seek reassurance", value: 6, description: "You anticipate what could go wrong" },
      { label: "Numb out and tune out", value: 9, description: "You distract yourself to cope" },
      { label: "Become more helpful than usual", value: 2, description: "You pour energy into others" },
      { label: "Become scattered and active", value: 7, description: "You keep moving to avoid feeling" },
    ],
  },
  {
    id: "EN_q3",
    question: "What's your biggest fear?",
    options: [
      { label: "Being useless or incompetent", value: 5, description: "You worry about not knowing enough" },
      { label: "Being without support or guidance", value: 6, description: "You worry about facing things alone" },
      { label: "Loss and separation", value: 9, description: "You worry about things falling apart" },
      { label: "Being unloved or unwanted", value: 2, description: "You worry about being alone" },
      { label: "Being trapped or deprived", value: 7, description: "You worry about missing out" },
    ],
  },
  {
    id: "EN_q4",
    question: "Which word best describes your natural energy?",
    options: [
      { label: "Observant", value: 5, description: "You notice things others miss" },
      { label: "Loyal", value: 6, description: "You show up for people consistently" },
      { label: "Easygoing", value: 9, description: "You adapt to whatever's happening" },
      { label: "Caring", value: 2, description: "You bring warmth to every room" },
      { label: "Spontaneous", value: 7, description: "You keep things lively and unexpected" },
    ],
  },
];

// ── DISC questions (existing) ────────────────────────────────────────────────

interface DiscQuestion {
  id: string;
  question: string;
  options: { label: string; value: "D" | "I" | "S" | "C"; description: string }[];
}

const discQuestions: DiscQuestion[] = [
  {
    id: "DISC_q1",
    question: "In a team project, you naturally take the role of...",
    options: [
      { label: "The driver — pushing toward the goal", value: "D", description: "Results-oriented, decisive" },
      { label: "The motivator — keeping everyone energized", value: "I", description: "Enthusiastic, persuasive" },
      { label: "The stabilizer — making sure we get along", value: "S", description: "Patient, supportive" },
      { label: "The analyst — checking the details", value: "C", description: "Precise, quality-focused" },
    ],
  },
  {
    id: "DISC_q2",
    question: "When facing a deadline, you...",
    options: [
      { label: "Push hard and make quick calls", value: "D", description: "Time pressure sharpens your focus" },
      { label: "Bring energy and rally the team", value: "I", description: "You thrive in the sprint" },
      { label: "Stay steady and keep things on track", value: "S", description: "You're the calm in the crunch" },
      { label: "Double-check everything for accuracy", value: "C", description: "You won't ship anything sloppy" },
    ],
  },
  {
    id: "DISC_q3",
    question: "People usually describe you as...",
    options: [
      { label: "Direct and confident", value: "D", description: "You say what you mean" },
      { label: "Warm and charismatic", value: "I", description: "People are drawn to you" },
      { label: "Reliable and thoughtful", value: "S", description: "People know they can count on you" },
      { label: "Careful and thorough", value: "C", description: "You do things the right way" },
    ],
  },
  {
    id: "DISC_q4",
    question: "In a disagreement, you...",
    options: [
      { label: "State your position clearly and debate it", value: "D", description: "You engage head-on" },
      { label: "Try to find common ground and connect", value: "I", description: "You smooth things over with warmth" },
      { label: "Listen and look for a compromise", value: "S", description: "You want everyone to feel heard" },
      { label: "Use facts and logic to resolve it", value: "C", description: "You let the evidence decide" },
    ],
  },
  {
    id: "DISC_q5",
    question: "What environment helps you do your best work?",
    options: [
      { label: "Fast-paced with clear targets", value: "D", description: "You want to move and win" },
      { label: "Collaborative and social", value: "I", description: "You do best with people around" },
      { label: "Stable and predictable", value: "S", description: "You need consistency to thrive" },
      { label: "Quiet with time to focus deeply", value: "C", description: "You need space for precision" },
    ],
  },
];

// ── Love Languages questions (existing) ─────────────────────────────────────

interface LoveLanguageQuestion {
  id: string;
  question: string;
  options: { label: string; value: "words" | "acts" | "gifts" | "time" | "touch"; description: string }[];
}

const loveLanguageQuestions: LoveLanguageQuestion[] = [
  {
    id: "LL_q1",
    question: "When you feel most appreciated by someone, it's usually when they...",
    options: [
      { label: "Say something kind or encouraging", value: "words", description: "You hear it in their words" },
      { label: "Do something helpful for you", value: "acts", description: "Actions speak louder" },
      { label: "Give you a thoughtful gift", value: "gifts", description: "The gesture means a lot" },
      { label: "Give you their full, undivided attention", value: "time", description: "Presence is everything" },
      { label: "Show physical affection", value: "touch", description: "A hug, a hand on your shoulder" },
    ],
  },
  {
    id: "LL_q2",
    question: "The thing you value most in a relationship is...",
    options: [
      { label: "Feeling verbally affirmed", value: "words", description: "You need to hear the love" },
      { label: "Seeing effort and thoughtfulness", value: "acts", description: "Love shows up in what people do" },
      { label: "Receiving tokens and surprises", value: "gifts", description: "Gifts say 'I was thinking of you'" },
      { label: "Quality time together", value: "time", description: "Time is the real gift" },
      { label: "Physical closeness and warmth", value: "touch", description: "Touch connects you" },
    ],
  },
  {
    id: "LL_q3",
    question: "When someone is hurting, you show you care by...",
    options: [
      { label: "Saying the right thing to comfort them", value: "words", description: "Your words bring comfort" },
      { label: "Doing something practical to help", value: "acts", description: "You take action" },
      { label: "Bringing them something meaningful", value: "gifts", description: "A gift says 'I see you'" },
      { label: "Sitting with them, present and patient", value: "time", description: "You stay when it matters" },
      { label: "Offering a hug or physical presence", value: "touch", description: "Touch says 'I'm here'" },
    ],
  },
  {
    id: "LL_q4",
    question: "The worst way someone can ignore you is by...",
    options: [
      { label: "Never saying they appreciate you", value: "words", description: "Silence feels like rejection" },
      { label: "Never helping even when they could", value: "acts", description: "Inaction feels like indifference" },
      { label: "Never acknowledging special moments", value: "gifts", description: "Forgotten moments hurt" },
      { label: "Always being too busy for you", value: "time", description: "Absence feels like loss" },
      { label: "Pulling away physically", value: "touch", description: "Distance hurts deeply" },
    ],
  },
  {
    id: "LL_q5",
    question: "Which gesture would make your whole week?",
    options: [
      { label: "A heartfelt text or note", value: "words", description: "Words stick with you" },
      { label: "Someone doing something to make your life easier", value: "acts", description: "Acts lighten the load" },
      { label: "A small gift that shows they know you", value: "gifts", description: "Thoughtfulness is the gift" },
      { label: "An uninterrupted afternoon together", value: "time", description: "Time is the rarest gift" },
      { label: "A long hug or holding hands", value: "touch", description: "Touch grounds you" },
    ],
  },
];

export default function PersonalityAssessment() {
  // ── State ──────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Phase One + Phase Two answers (existing)
  const [phaseOneAnswers, setPhaseOneAnswers] = useState<Record<string, number>>({});
  const [hexacoAnswers, setHexacoAnswers] = useState<Record<string, number>>({});
  const [enneagramAnswers, setEnneagramAnswers] = useState<Record<string, number>>({});
  const [discAnswers, setDiscAnswers] = useState<Record<string, "D" | "I" | "S" | "C">>({});
  const [loveLanguageAnswers, setLoveLanguageAnswers] = useState<
    Record<string, "words" | "acts" | "gifts" | "time" | "touch">
  >({});
  const [attachmentStyle, setAttachmentStyle] = useState<string>("");
  const [goals, setGoals] = useState("");

  // Phase Three extended DNA answers (new)
  const [emotionalAnswers, setEmotionalAnswers] = useState<Record<string, number>>({});
  const [cognitiveAnswers, setCognitiveAnswers] = useState<Record<string, number>>({});
  const [relationshipAnswers, setRelationshipAnswers] = useState<Record<string, number>>({});
  const [motivationAnswers, setMotivationAnswers] = useState<Record<string, number>>({});
  const [behavioralAnswers, setBehavioralAnswers] = useState<Record<string, number>>({});
  const [wellnessAnswers, setWellnessAnswers] = useState<Record<string, number>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Question counts ────────────────────────────────────────────────────
  const totalQuestions =
    phaseOneQuestions.length +
    hexacoQuestions.length +
    enneagramQuestions.length +
    discQuestions.length +
    loveLanguageQuestions.length +
    EMOTIONAL_QUESTIONS.length +
    COGNITIVE_QUESTIONS.length +
    RELATIONSHIP_QUESTIONS.length +
    MOTIVATION_QUESTIONS.length +
    BEHAVIORAL_QUESTIONS.length +
    WELLNESS_QUESTIONS.length +
    1; // +1 for attachment selection

  // ── Progress ───────────────────────────────────────────────────────────
  const answeredCount = useMemo(() => {
    let count = 0;
    count += Object.keys(phaseOneAnswers).length;
    count += Object.keys(hexacoAnswers).length;
    count += Object.keys(enneagramAnswers).length;
    count += Object.keys(discAnswers).length;
    count += Object.keys(loveLanguageAnswers).length;
    count += Object.keys(emotionalAnswers).length;
    count += Object.keys(cognitiveAnswers).length;
    count += Object.keys(relationshipAnswers).length;
    count += Object.keys(motivationAnswers).length;
    count += Object.keys(behavioralAnswers).length;
    count += Object.keys(wellnessAnswers).length;
    return count;
  }, [phaseOneAnswers, hexacoAnswers, enneagramAnswers, discAnswers, loveLanguageAnswers,
    emotionalAnswers, cognitiveAnswers, relationshipAnswers, motivationAnswers,
    behavioralAnswers, wellnessAnswers]);

  const progressPct = Math.min(100, Math.round((answeredCount / totalQuestions) * 100));

  // ── Handlers ───────────────────────────────────────────────────────────
  const handlePhaseOneAnswer = (value: number) => {
    const q = phaseOneQuestions[currentQuestion];
    setPhaseOneAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (currentQuestion < phaseOneQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 200);
    } else {
      setCurrentQuestion(0);
      setStep("questions-hexo");
    }
  };

  const handleHexacoAnswer = (value: number) => {
    const q = hexacoQuestions[currentQuestion];
    setHexacoAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (currentQuestion < hexacoQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 200);
    } else {
      setCurrentQuestion(0);
      setStep("questions-enneagram");
    }
  };

  const handleEnneagramAnswer = (value: number) => {
    const q = enneagramQuestions[currentQuestion];
    setEnneagramAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (currentQuestion < enneagramQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 200);
    } else {
      setCurrentQuestion(0);
      setStep("questions-disc");
    }
  };

  const handleDiscAnswer = (value: "D" | "I" | "S" | "C") => {
    const q = discQuestions[currentQuestion];
    setDiscAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (currentQuestion < discQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 200);
    } else {
      setCurrentQuestion(0);
      setStep("questions-love");
    }
  };

  const handleLoveLanguageAnswer = (value: "words" | "acts" | "gifts" | "time" | "touch") => {
    const q = loveLanguageQuestions[currentQuestion];
    setLoveLanguageAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (currentQuestion < loveLanguageQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 200);
    } else {
      setCurrentQuestion(0);
      setStep("attachment");
    }
  };

  // ── Phase Three answer handlers ────────────────────────────────────────
  const handleEmotionalAnswer = (value: number) => {
    const q = EMOTIONAL_QUESTIONS[currentQuestion];
    setEmotionalAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (currentQuestion < EMOTIONAL_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 200);
    } else {
      setCurrentQuestion(0);
      setStep("questions-cognitive");
    }
  };

  const handleCognitiveAnswer = (value: number) => {
    const q = COGNITIVE_QUESTIONS[currentQuestion];
    setCognitiveAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (currentQuestion < COGNITIVE_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 200);
    } else {
      setCurrentQuestion(0);
      setStep("questions-relationship");
    }
  };

  const handleRelationshipAnswer = (value: number) => {
    const q = RELATIONSHIP_QUESTIONS[currentQuestion];
    setRelationshipAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (currentQuestion < RELATIONSHIP_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 200);
    } else {
      setCurrentQuestion(0);
      setStep("questions-motivation");
    }
  };

  const handleMotivationAnswer = (value: number) => {
    const q = MOTIVATION_QUESTIONS[currentQuestion];
    setMotivationAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (currentQuestion < MOTIVATION_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 200);
    } else {
      setCurrentQuestion(0);
      setStep("questions-behavioral");
    }
  };

  const handleBehavioralAnswer = (value: number) => {
    const q = BEHAVIORAL_QUESTIONS[currentQuestion];
    setBehavioralAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (currentQuestion < BEHAVIORAL_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 200);
    } else {
      setCurrentQuestion(0);
      setStep("questions-wellness");
    }
  };

  const handleWellnessAnswer = (value: number) => {
    const q = WELLNESS_QUESTIONS[currentQuestion];
    setWellnessAnswers((prev) => ({ ...prev, [q.id]: value }));
    if (currentQuestion < WELLNESS_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 200);
    } else {
      setCurrentQuestion(0);
      setStep("attachment");
    }
  };

  const handleAttachmentSelect = (value: string) => {
    setAttachmentStyle(value);
    setTimeout(() => setStep("goals"), 200);
  };

  const handleSubmit = () => {
    if (!goals.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setStep("complete");
      setIsSubmitting(false);
    }, 1200);
  };

  // ── Scoring (reuse logic from personality.ts via scoreFullDNA where possible) ──
  // For now, replicate the scoring inline so the UI is self-contained

  const bigFiveScores = {
    openness: phaseOneAnswers["change"] || 3,
    conscientiousness:
      phaseOneAnswers["structure"] === 1 ? 4.5 : phaseOneAnswers["structure"] === 5 ? 1.5 : 3,
    extraversion:
      phaseOneAnswers["energy"] === 5 ? 4.5 : phaseOneAnswers["energy"] === 1 ? 1.5 : 3,
    agreeableness:
      phaseOneAnswers["conflict"] === 5 ? 4.0 : phaseOneAnswers["conflict"] === 1 ? 2.0 : 3,
    neuroticism:
      phaseOneAnswers["emotions"] === 5 ? 3.5 : phaseOneAnswers["emotions"] === 1 ? 1.5 : 2.5,
  };

  const hexacoScores = {
    honestyHumility:
      (hexacoAnswers["HH_q1"] || 3 + hexacoAnswers["HH_q2"] || 3) / 2 +
      (hexacoAnswers["HH_q1"] || 0 + hexacoAnswers["HH_q2"] || 0) / 2,
    emotionality: (hexacoAnswers["EM_q1"] || 3 + hexacoAnswers["EM_q2"] || 3) / 2,
    extraversion: hexacoAnswers["EX_q1"] || 3,
    agreeableness: hexacoAnswers["AG_q1"] || 3,
    conscientiousness: hexacoAnswers["CO_q1"] || 3,
    openness: hexacoAnswers["OP_q1"] || 3,
  };

  // Enneagram scoring (reuse existing logic)
  const enneagramType = (() => {
    const vals = Object.values(enneagramAnswers);
    if (vals.length === 0) return null;
    const q1 = enneagramAnswers["EN_q1"] || 0;
    const q2 = enneagramAnswers["EN_q2"] || 0;
    const q3 = enneagramAnswers["EN_q3"] || 0;
    const q4 = enneagramAnswers["EN_q4"] || 0;
    const q5 = enneagramAnswers["EN_q5"] || 0;
    const scores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    if (q1 >= 4) scores[5] += 2;
    if (q1 >= 3) scores[6] += 1;
    if (q1 <= 2) scores[9] += 1;
    if (q2 === 5) scores[5] += 3; if (q2 === 6) scores[6] += 3;
    if (q2 === 9) scores[9] += 3; if (q2 === 2) scores[2] += 2;
    if (q2 === 7) scores[7] += 2;
    if (q3 === 5) scores[5] += 3; if (q3 === 6) scores[6] += 2;
    if (q3 === 9) scores[9] += 2; if (q3 === 2) scores[2] += 2;
    if (q3 === 7) scores[7] += 2;
    if (q4 === 5) scores[5] += 3; if (q4 === 6) scores[6] += 2;
    if (q4 === 9) scores[9] += 2; if (q4 === 2) scores[2] += 2;
    if (q4 === 7) scores[7] += 2;
    if (q5 === 5) scores[5] += 2; if (q5 === 6) scores[6] += 2;
    if (q5 === 9) scores[9] += 2; if (q5 === 2) scores[2] += 2;
    if (q5 === 7) scores[7] += 2;
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top = parseInt(sorted[0][0]);
    if (sorted.length > 1 && sorted[1][1] > 0 && Math.abs(sorted[0][1] - sorted[1][1]) <= 1) {
      return top > parseInt(sorted[1][0]) ? top : parseInt(sorted[1][0]);
    }
    return top;
  })();

  // DISC scoring (reuse existing logic)
  const discType = (() => {
    const counts = { D: 0, I: 0, S: 0, C: 0 };
    Object.values(discAnswers).forEach((v) => counts[v]++);
    const max = Math.max(...Object.values(counts));
    if (counts.D === max) return "D";
    if (counts.I === max) return "I";
    if (counts.S === max) return "S";
    return "C";
  })();

  // Love Languages (reuse existing logic)
  const loveLangs = (() => {
    const map: Record<string, number> = { words: 0, acts: 0, gifts: 0, time: 0, touch: 0 };
    Object.entries(loveLanguageAnswers).forEach(([k, v]) => {
      map[v as string] = (map[v as string] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([k]) => k as "words" | "acts" | "gifts" | "time" | "touch");
  })();

  // ── Phase Three DNA scoring (mirrors scoreFullDNA logic) ────────────────

  // Emotional DNA
  const emotionalScores = (() => {
    const dimensions: (keyof EmotionalDNAScores)[] = [
      "granularity", "regulationReappraisal", "regulationSuppression",
      "regulationAcceptance", "regulationExpression", "regulationDistraction",
      "regulationRitual", "regulationWithdrawal", "regulationProblemSolve",
      "triggerSensitivity", "recoverySpeed", "expressionComfort",
      "alexithymiaTendency", "emotionalAvoidance", "bodyAwareness",
      "primaryEmotionAccess",
    ];
    const prefixMap: Record<string, string> = {
      granularity: "em_gran",
      regulationReappraisal: "em_reg_rap",
      regulationSuppression: "em_reg_sup",
      regulationAcceptance: "em_reg_acc",
      regulationExpression: "em_reg_exp",
      regulationDistraction: "em_reg_dist",
      regulationRitual: "em_reg_rit",
      regulationWithdrawal: "em_reg_with",
      regulationProblemSolve: "em_reg_ps",
      triggerSensitivity: "em_trig",
      recoverySpeed: "em_rec",
      expressionComfort: "em_exp_comfort",
      alexithymiaTendency: "em_alex",
      emotionalAvoidance: "em_avoid",
      bodyAwareness: "em_body",
      primaryEmotionAccess: "em_primary",
    };
    const result: Record<string, number> = {};
    for (const dim of dimensions) {
      const vals = Object.entries(emotionalAnswers)
        .filter(([id]) => id.startsWith(prefixMap[dim]))
        .map(([, v]) => v);
      result[dim] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 3;
    }
    return result as unknown as EmotionalDNAScores;
  })();

  // Cognitive DNA
  const cognitiveScores = (() => {
    const dimensions: (keyof CognitiveDNAScores)[] = [
      "cognitiveStyleReflective", "cognitiveStyleIntuitive", "needForCognition",
      "ambiguityTolerance", "ruminationPropensity", "optimismBias",
      "distortionMindReading", "distortionCatastrophizing", "distortionOvergeneralization",
      "distortionAllOrNothing", "distortionEmotionalReasoning", "analysisParalysis",
      "informationProcessingSpeed",
    ];
    const prefixMap: Record<string, string> = {
      cognitiveStyleReflective: "cog_style_ref",
      cognitiveStyleIntuitive: "cog_style_int",
      needForCognition: "cog_nfc",
      ambiguityTolerance: "cog_amb",
      ruminationPropensity: "cog_rum",
      optimismBias: "cog_opt",
      distortionMindReading: "cog_dist_mr",
      distortionCatastrophizing: "cog_dist_cat",
      distortionOvergeneralization: "cog_dist_og",
      distortionAllOrNothing: "cog_dist_aon",
      distortionEmotionalReasoning: "cog_dist_er",
      analysisParalysis: "cog_ap",
      informationProcessingSpeed: "cog_ips",
    };
    const result: Record<string, number> = {};
    for (const dim of dimensions) {
      const vals = Object.entries(cognitiveAnswers)
        .filter(([id]) => id.startsWith(prefixMap[dim]))
        .map(([, v]) => v);
      result[dim] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 3;
    }
    return result as unknown as CognitiveDNAScores;
  })();

  // Relationship DNA
  const relationshipScores = (() => {
    const dimensions: (keyof RelationshipDNAScores)[] = [
      "attachmentAnxiety", "attachmentAvoidance", "communicationDirect",
      "conflictConfront", "conflictAvoid", "conflictAccommodate",
      "intimacyPacing", "trustBaseline", "socialEnergyBudget",
      "peopleReadingAccuracy", "interdependenceStyle",
    ];
    const prefixMap: Record<string, string> = {
      attachmentAnxiety: "rel_att_anx",
      attachmentAvoidance: "rel_att_av",
      communicationDirect: "rel_comm_dir",
      conflictConfront: "rel_conf_con",
      conflictAvoid: "rel_conf_avoid",
      conflictAccommodate: "rel_conf_acc",
      intimacyPacing: "rel_int_pace",
      trustBaseline: "rel_trust",
      socialEnergyBudget: "rel_social_energy",
      peopleReadingAccuracy: "rel_people_read",
      interdependenceStyle: "rel_interdep",
    };
    const result: Record<string, number> = {};
    for (const dim of dimensions) {
      const vals = Object.entries(relationshipAnswers)
        .filter(([id]) => id.startsWith(prefixMap[dim]))
        .map(([, v]) => v);
      result[dim] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 3;
    }
    return result as unknown as RelationshipDNAScores;
  })();

  // Motivation DNA
  const motivationScores = (() => {
    const dimensions: (keyof MotivationDNAScores)[] = [
      "sdtAutonomy", "sdtCompetence", "sdtRelatedness", "intrinsicOrientation",
      "extrinsicOrientation", "identifiedRegulation", "introjectedRegulation",
      "externalRegulation", "growthMindset", "avoidanceMotivation",
      "approachMotivation", "streakMotivation", "outcomeMotivation",
    ];
    const prefixMap: Record<string, string> = {
      sdtAutonomy: "mot_sdt_aut",
      sdtCompetence: "mot_sdt_comp",
      sdtRelatedness: "mot_sdt_rel",
      intrinsicOrientation: "mot_intrin",
      extrinsicOrientation: "mot_extrin",
      identifiedRegulation: "mot_id_reg",
      introjectedRegulation: "mot_intro_reg",
      externalRegulation: "mot_ext_reg",
      growthMindset: "mot_gm",
      avoidanceMotivation: "mot_avoid",
      approachMotivation: "mot_app",
      streakMotivation: "mot_streak",
      outcomeMotivation: "mot_outcome",
    };
    const result: Record<string, number> = {};
    for (const dim of dimensions) {
      const vals = Object.entries(motivationAnswers)
        .filter(([id]) => id.startsWith(prefixMap[dim]))
        .map(([, v]) => v);
      result[dim] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 3;
    }
    return result as unknown as MotivationDNAScores;
  })();

  // Behavioral DNA
  const behavioralScores = (() => {
    const dimensions: (keyof BehavioralDNAScores)[] = [
      "selfMonitoringFrequency", "selfReportAccuracy", "routineStructureOrientation",
      "impulseRegulation", "habitFormationSusceptibility", "environmentalCueSensitivity",
      "implementationIntentionReadiness", "consistencyTendency", "flexibilityTendency",
      "selfReflectionDepth",
    ];
    const prefixMap: Record<string, string> = {
      selfMonitoringFrequency: "beh_sm",
      selfReportAccuracy: "beh_sra",
      routineStructureOrientation: "beh_rs",
      impulseRegulation: "beh_ir",
      habitFormationSusceptibility: "beh_hfs",
      environmentalCueSensitivity: "beh_ecs",
      implementationIntentionReadiness: "beh_iir",
      consistencyTendency: "beh_cons",
      flexibilityTendency: "beh_flex",
      selfReflectionDepth: "beh_sr",
    };
    const result: Record<string, number> = {};
    for (const dim of dimensions) {
      const vals = Object.entries(behavioralAnswers)
        .filter(([id]) => id.startsWith(prefixMap[dim]))
        .map(([, v]) => v);
      result[dim] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 3;
    }
    return result as unknown as BehavioralDNAScores;
  })();

  // Wellness DNA
  const wellnessScores = (() => {
    const dimensions: (keyof WellnessDNAScores)[] = [
      "stressBaseline", "stressTriggerCount", "energyBaseline", "energyDrainSources",
      "recoveryMethodEffectiveness", "sleepQualitySelfReport", "lifestyleHealthSelfReport",
      "wellnessGoalHierarchy", "opennessToInterventions", "somaticAwareness",
      "helpSeekingStyle", "ritualComfort",
    ];
    const prefixMap: Record<string, string> = {
      stressBaseline: "wl_stress_base",
      stressTriggerCount: "wl_stress_trig",
      energyBaseline: "wl_energy_base",
      energyDrainSources: "wl_energy_drain",
      recoveryMethodEffectiveness: "wl_rec_eff",
      sleepQualitySelfReport: "wl_sleep",
      lifestyleHealthSelfReport: "wl_lifestyle",
      wellnessGoalHierarchy: "wl_goal_hier",
      opennessToInterventions: "wl_open_int",
      somaticAwareness: "wl_som",
      helpSeekingStyle: "wl_help",
      ritualComfort: "wl_ritual",
    };
    const result: Record<string, number> = {};
    for (const dim of dimensions) {
      const vals = Object.entries(wellnessAnswers)
        .filter(([id]) => id.startsWith(prefixMap[dim]))
        .map(([, v]) => v);
      result[dim] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 3;
    }
    return result as unknown as WellnessDNAScores;
  })();

  // Attachment style derivation (reuse existing logic)
  const anxietyScore = Math.max(1, Math.min(5,
    Object.entries(relationshipAnswers)
      .filter(([id]) => id.startsWith("rel_att_anx"))
      .map(([, v]) => v)
      .reduce((a, b) => a + b, 0) / Math.max(1, Object.entries(relationshipAnswers).filter(([id]) => id.startsWith("rel_att_anx")).length)
  ));
  const avoidanceScore = Math.max(1, Math.min(5,
    Object.entries(relationshipAnswers)
      .filter(([id]) => id.startsWith("rel_att_av"))
      .map(([, v]) => v)
      .reduce((a, b) => a + b, 0) / Math.max(1, Object.entries(relationshipAnswers).filter(([id]) => id.startsWith("rel_att_av")).length)
  ));
  const derivedAttachment = (() => {
    if (attachmentStyle) return attachmentStyle as "secure" | "anxious" | "avoidant" | "fearful";
    if (anxietyScore >= 3.5 && avoidanceScore < 3) return "anxious";
    if (anxietyScore < 3 && avoidanceScore >= 3.5) return "avoidant";
    if (anxietyScore >= 3.5 && avoidanceScore >= 3.5) return "fearful";
    return "secure";
  })();

  // Communication style
  const commDirect = relationshipScores.communicationDirect || 3;
  const communicationStyle = commDirect >= 4 ? "Warm and direct — you share your feelings openly"
    : commDirect <= 2 ? "Respectful and patient — you appreciate space and autonomy"
    : "Balanced — you communicate warmly but respectfully";

  // ── Derived summaries (reuse existing personalityTypeLabel logic) ───────
  const personalityTypeLabel = (): string => {
    const vals = Object.values(phaseOneAnswers);
    if (vals.length === 0) return "Balanced";
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    if (avg >= 4) return "Explorer — curious, open, flexible";
    if (avg >= 2.5) return "Balancer — moderate, adaptable";
    return "Anchorer — stable, loyal, grounded";
  };

  const enneagramDescriptions: Record<number, { name: string; fear: string; desire: string; growth: string }> = {
    1: { name: "The Reformer", fear: "Being corrupt or defective", desire: "To be good and right", growth: "Type 7" },
    2: { name: "The Helper", fear: "Being unloved", desire: "To be loved and needed", growth: "Type 4" },
    3: { name: "The Achiever", fear: "Being worthless", desire: "To be valuable and admired", growth: "Type 6" },
    4: { name: "The Individualist", fear: "Having no identity", desire: "To be unique and authentic", growth: "Type 1" },
    5: { name: "The Investigator", fear: "Being useless or incompetent", desire: "To be capable and know", growth: "Type 8" },
    6: { name: "The Loyalist", fear: "Being without support", desire: "To have security and guidance", growth: "Type 9" },
    7: { name: "The Enthusiast", fear: "Being deprived or trapped", desire: "To be happy and free", growth: "Type 5" },
    8: { name: "The Challenger", fear: "Being harmed or controlled", desire: "To protect and be strong", growth: "Type 2" },
    9: { name: "The Peacemaker", fear: "Loss and separation", desire: "To have inner stability", growth: "Type 3" },
  };

  const loveLangLabels: Record<string, string> = {
    words: "Words of Affirmation", acts: "Acts of Service", gifts: "Receiving Gifts",
    time: "Quality Time", touch: "Physical Touch",
  };

  const loveLangEmojis: Record<string, string> = {
    words: "💬", acts: "🛠️", gifts: "🎁", time: "⏰", touch: "🤝",
  };

  const discDescriptions: Record<string, string> = {
    D: "Direct, results-driven, competitive — you take charge",
    I: "Enthusiastic, persuasive, social — you bring energy",
    S: "Patient, supportive, reliable — you keep things steady",
    C: "Precise, analytical, quality-focused — you get it right",
  };

  const attachmentLabels: Record<string, string> = {
    secure: "Secure — comfortable with closeness and independence",
    anxious: "Anxious — sensitive to connection and distance",
    avoidant: "Avoidant — values independence, cautious about closeness",
    fearful: "Fearful — wants connection but fears it",
  };

  // ── Framework emphasis from Phase Three DNA ─────────────────────────────
  const frameworkEmphasis = (() => {
    const fw: string[] = [];
    if (emotionalScores.regulationSuppression >= 4 || emotionalScores.alexithymiaTendency >= 4) fw.push("EFT");
    if (emotionalScores.regulationAcceptance >= 4) fw.push("ACT");
    if (cognitiveScores.distortionMindReading >= 4 || cognitiveScores.distortionCatastrophizing >= 4 ||
        cognitiveScores.distortionOvergeneralization >= 4 || cognitiveScores.distortionAllOrNothing >= 4 ||
        cognitiveScores.distortionEmotionalReasoning >= 4 || cognitiveScores.ruminationPropensity >= 4) fw.push("CBT");
    if (cognitiveScores.ruminationPropensity >= 4) fw.push("ACT");
    if (cognitiveScores.ambiguityTolerance <= 2) fw.push("ACT");
    if (cognitiveScores.analysisParalysis >= 4) fw.push("SFBT");
    if (behavioralScores.impulseRegulation <= 2) fw.push("DBT");
    if (behavioralScores.habitFormationSusceptibility <= 2) fw.push("SFBT");
    if (behavioralScores.routineStructureOrientation >= 4) fw.push("SFBT");
    if (motivationScores.intrinsicOrientation <= 2 || motivationScores.identifiedRegulation <= 2 ||
        motivationScores.sdtAutonomy <= 2 || motivationScores.introjectedRegulation >= 4) fw.push("ACT");
    if (motivationScores.growthMindset <= 2) fw.push("CBT");
    if (motivationScores.avoidanceMotivation >= 4) { fw.push("ACT"); fw.push("SFBT"); }
    if (motivationScores.sdtCompetence <= 2) { fw.push("SFBT"); fw.push("CBT"); }
    if (motivationScores.sdtRelatedness <= 2) fw.push("EFT");
    if (wellnessScores.stressBaseline >= 4) { fw.push("DBT"); fw.push("Mindfulness"); }
    if (wellnessScores.energyBaseline <= 2) { fw.push("DBT"); fw.push("ACT"); }
    if (wellnessScores.opennessToInterventions >= 4) fw.push("Mindfulness");
    if (wellnessScores.somaticAwareness >= 4) { fw.push("Mindfulness"); fw.push("EFT"); }
    if (wellnessScores.recoveryMethodEffectiveness <= 2) { fw.push("DBT"); fw.push("Mindfulness"); }
    if (bigFiveScores.neuroticism >= 3.5) { fw.push("DBT"); }
    if (bigFiveScores.openness >= 3.5) fw.push("ACT");
    if (derivedAttachment === "anxious" || derivedAttachment === "avoidant" || derivedAttachment === "fearful") {
      fw.push("EFT");
    }
    return [...new Set(fw)];
  })();

  const coachingRecommendations = (() => {
    const recs: string[] = [];
    if (emotionalScores.granularity <= 2 || emotionalScores.alexithymiaTendency >= 4 || emotionalScores.primaryEmotionAccess <= 2) recs.push("Emotional Awareness & Expression");
    if (emotionalScores.regulationSuppression >= 4) recs.push("Emotional Expression");
    if (emotionalScores.regulationAcceptance >= 4) recs.push("Acceptance Practices");
    if (emotionalScores.regulationRitual >= 4) recs.push("Regulation Skills");
    if (cognitiveScores.distortionMindReading >= 4 || cognitiveScores.distortionCatastrophizing >= 4 ||
        cognitiveScores.distortionOvergeneralization >= 4 || cognitiveScores.distortionAllOrNothing >= 4 ||
        cognitiveScores.distortionEmotionalReasoning >= 4) recs.push("Thought Awareness");
    if (cognitiveScores.ruminationPropensity >= 4) { recs.push("Thought Awareness"); recs.push("Regulation Skills"); }
    if (cognitiveScores.ambiguityTolerance <= 2) recs.push("Tolerance for Uncertainty");
    if (cognitiveScores.analysisParalysis >= 4) recs.push("Progress & Momentum");
    if (relationshipScores.communicationDirect <= 2 || relationshipScores.conflictAvoid >= 4 ||
        relationshipScores.intimacyPacing <= 2) recs.push("Relationship Coaching");
    if (motivationScores.intrinsicOrientation <= 2 || motivationScores.identifiedRegulation <= 2 ||
        motivationScores.sdtAutonomy <= 2 || motivationScores.introjectedRegulation >= 4) recs.push("Values & Direction");
    if (motivationScores.growthMindset <= 2) recs.push("Growth Mindset");
    if (motivationScores.avoidanceMotivation >= 4) { recs.push("Values & Direction"); recs.push("Progress & Momentum"); }
    if (motivationScores.sdtCompetence <= 2) { recs.push("Progress & Momentum"); recs.push("Regulation Skills"); }
    if (motivationScores.sdtRelatedness <= 2) recs.push("Emotional Awareness & Expression");
    if (behavioralScores.selfMonitoringFrequency <= 2) { recs.push("Progress & Momentum"); }
    if (behavioralScores.impulseRegulation <= 2) recs.push("Regulation Skills");
    if (behavioralScores.routineStructureOrientation >= 4) recs.push("Progress & Momentum");
    if (behavioralScores.habitFormationSusceptibility <= 2) recs.push("Progress & Momentum");
    if (behavioralScores.implementationIntentionReadiness >= 4) recs.push("Progress & Momentum");
    if (wellnessScores.stressBaseline >= 4) { recs.push("Regulation Skills"); recs.push("Mindful Presence"); }
    if (wellnessScores.energyBaseline <= 2) { recs.push("Regulation Skills"); recs.push("Values & Direction"); }
    if (wellnessScores.sleepQualitySelfReport <= 2) recs.push("Wellness Programs");
    if (wellnessScores.opennessToInterventions >= 4) recs.push("Wellness Exploration");
    if (wellnessScores.somaticAwareness >= 4) recs.push("Mindful Presence");
    if (wellnessScores.recoveryMethodEffectiveness <= 2) { recs.push("Regulation Skills"); recs.push("Mindful Presence"); }
    if (bigFiveScores.neuroticism >= 3.5) recs.push("Regulation Skills");
    if (bigFiveScores.openness >= 3.5) recs.push("Values & Direction");
    if (derivedAttachment === "anxious" || derivedAttachment === "avoidant" || derivedAttachment === "fearful") recs.push("Emotional Awareness & Expression");
    return [...new Set(recs)];
  })();

  const strengths = (() => {
    const s: string[] = [];
    if (bigFiveScores.neuroticism <= 2) s.push("Emotional stability — steady under pressure");
    if (bigFiveScores.openness >= 3.5) s.push("Openness to new perspectives — curious and reflective");
    if (bigFiveScores.conscientiousness >= 3.5) s.push("Structure and follow-through — capable of sustained effort");
    if (bigFiveScores.agreeableness >= 3.5) s.push("Harmony and collaboration — values connection");
    if (derivedAttachment === "secure") s.push("Secure attachment — comfortable with closeness");
    if (emotionalScores.regulationAcceptance >= 4) s.push("Acceptance-oriented regulation — makes room for difficult emotions");
    if (emotionalScores.regulationRitual >= 4) s.push("Ritual-based regulation — has practices that help");
    if (cognitiveScores.cognitiveStyleReflective >= 4) s.push("Reflective cognitive style — thoughtful and analytical");
    if (cognitiveScores.optimismBias >= 4) s.push("Optimistic outlook — expects good outcomes");
    if (relationshipScores.trustBaseline >= 4) s.push("Trust baseline — assumes good intent");
    if (relationshipScores.peopleReadingAccuracy >= 4) s.push("People-reading accuracy — attuned to others");
    if (motivationScores.intrinsicOrientation >= 4 || motivationScores.identifiedRegulation >= 4) s.push("Internally motivated — acts from personal values");
    if (motivationScores.growthMindset >= 4) s.push("Growth mindset — believes in development");
    if (motivationScores.streakMotivation >= 4) s.push("Streak motivation — consistent when tracked");
    if (behavioralScores.routineStructureOrientation >= 4) s.push("Structure orientation — thrives with routines");
    if (behavioralScores.implementationIntentionReadiness >= 4) s.push("Implementation-intention readiness — thinks in if-then plans");
    if (behavioralScores.consistencyTendency >= 4) s.push("Consistency — follows through on commitments");
    if (wellnessScores.opennessToInterventions >= 4) s.push("Openness to new wellness approaches — willing to explore");
    if (wellnessScores.somaticAwareness >= 4) s.push("Somatic awareness — tuned into body signals");
    return [...new Set(s)];
  })();

  const growthAreas = (() => {
    const g: string[] = [];
    if (bigFiveScores.neuroticism >= 3.5) g.push("Emotional regulation — high reactivity, learning to modulate intense feelings");
    if (bigFiveScores.openness <= 2) g.push("Openness — less curious, may benefit from exploring new perspectives");
    if (bigFiveScores.conscientiousness <= 2) g.push("Structure — less organized, may benefit from frameworks and routines");
    if (bigFiveScores.extraversion <= 2) g.push("Social energy management — introversion, need for space");
    if (bigFiveScores.agreeableness <= 2) g.push("Collaboration — may benefit from practicing harmony and trust");
    if (derivedAttachment === "anxious") g.push("Attachment security — building trust in connection, tolerating distance");
    if (derivedAttachment === "avoidant") g.push("Intimacy tolerance — opening to connection without feeling engulfed");
    if (derivedAttachment === "fearful") g.push("Integration — wanting connection but afraid, working toward safe closeness");
    if (emotionalScores.granularity <= 2) g.push("Emotional granularity — learning to name feelings precisely");
    if (emotionalScores.regulationSuppression >= 4) g.push("Emotional expression — tendency to suppress rather than express");
    if (emotionalScores.regulationAcceptance <= 2) g.push("Acceptance — difficulty making room for difficult emotions");
    if (emotionalScores.alexithymiaTendency >= 4) g.push("Emotion identification — difficulty naming what you feel");
    if (emotionalScores.primaryEmotionAccess <= 2) g.push("Emotional depth — accessing feelings beneath surface reactions");
    if (cognitiveScores.distortionMindReading >= 4 || cognitiveScores.distortionCatastrophizing >= 4 ||
        cognitiveScores.distortionOvergeneralization >= 4 || cognitiveScores.distortionAllOrNothing >= 4 ||
        cognitiveScores.distortionEmotionalReasoning >= 4) g.push("Cognitive distortion awareness — unhelpful thought patterns");
    if (cognitiveScores.ruminationPropensity >= 4) g.push("Rumination — tendency to get stuck in thought loops");
    if (cognitiveScores.ambiguityTolerance <= 2) g.push("Tolerance for uncertainty — difficulty with unclear situations");
    if (cognitiveScores.analysisParalysis >= 4) g.push("Analysis paralysis — over-analyzing and getting stuck");
    if (relationshipScores.communicationDirect <= 2) g.push("Direct communication — tendency to avoid bringing things up");
    if (relationshipScores.conflictAvoid >= 4) g.push("Conflict engagement — avoiding rather than working through conflict");
    if (relationshipScores.intimacyPacing <= 2) g.push("Intimacy pacing — slower to open up");
    if (motivationScores.intrinsicOrientation <= 2 || motivationScores.identifiedRegulation <= 2) g.push("Intrinsic motivation — goals feel imposed rather than chosen");
    if (motivationScores.introjectedRegulation >= 4 || motivationScores.extrinsicOrientation >= 4) g.push("Extrinsic pressure — driven by guilt, shoulds, or external expectations");
    if (motivationScores.growthMindset <= 2) g.push("Growth mindset — seeing abilities as fixed rather than improvable");
    if (motivationScores.avoidanceMotivation >= 4) g.push("Approach motivation — avoiding negative more than pursuing positive");
    if (motivationScores.sdtAutonomy <= 2) g.push("Autonomy — feeling controlled rather than self-directed");
    if (motivationScores.sdtCompetence <= 2) g.push("Competence — feeling ineffective or stuck");
    if (motivationScores.sdtRelatedness <= 2) g.push("Relatedness — feeling disconnected or isolated");
    if (behavioralScores.selfMonitoringFrequency <= 2) g.push("Self-monitoring — low awareness of own behavior");
    if (behavioralScores.impulseRegulation <= 2) g.push("Impulse regulation — difficulty pausing between impulse and intention");
    if (behavioralScores.routineStructureOrientation <= 2) g.push("Structure — less oriented to routines");
    if (behavioralScores.habitFormationSusceptibility <= 2) g.push("Habit formation — difficulty forming new habits");
    if (wellnessScores.stressBaseline >= 4) g.push("Stress management — elevated baseline stress");
    if (wellnessScores.energyBaseline <= 2) g.push("Energy — low baseline energy, may benefit from recovery practices");
    if (wellnessScores.sleepQualitySelfReport <= 2) g.push("Sleep quality — self-reported sleep is poor");
    if (wellnessScores.opennessToInterventions <= 2) g.push("Openness to interventions — less willing to try new approaches");
    if (wellnessScores.recoveryMethodEffectiveness <= 2) g.push("Recovery effectiveness — current methods not working well");
    return [...new Set(g)];
  })();

  const personalitySummary = `A ${bigFiveScores.neuroticism >= 3.5 ? "reflective, emotionally sensitive" : "steady, emotionally balanced"} person with a ${derivedAttachment} attachment style, ${commDirect >= 4 ? "direct" : commDirect <= 2 ? "indirect" : "balanced"} communication style, and a ${cognitiveScores.cognitiveStyleReflective >= 4 ? "reflective, analytical" : cognitiveScores.cognitiveStyleIntuitive >= 4 ? "intuitive, fast-processing" : "balanced"} cognitive approach. ${motivationScores.sdtAutonomy >= 4 ? "Self-directed and autonomous" : motivationScores.introjectedRegulation >= 4 ? "Driven by internal pressure and shoulds" : "Moderately self-directed"}. ${wellnessScores.stressBaseline >= 4 ? "Currently experiencing elevated stress" : wellnessScores.energyBaseline >= 4 ? "Currently well-resourced with good energy" : "In a moderate wellness state"}.`;

  const relationshipAdvice = `Your ${derivedAttachment} attachment style shapes how you relate. ${derivedAttachment === "anxious" ? "You're sensitive to signs of distance or rejection. Prioritize consistent warmth and explicit check-ins. Reassurance through presence, not promises." : derivedAttachment === "avoidant" ? "You value independence and may pull back when connection feels demanding. Give yourself space without punishing withdrawal. Warmth without intensity works best." : derivedAttachment === "fearful" ? "You want connection but are afraid of it — you may move toward and pull back. Steady, patient warmth without demands is the path. You can experience that connection is safe." : "You're comfortable with closeness and open communication. A natural, supportive companionship rhythm works well."}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>
              {step === "welcome"
                ? "Welcome"
                : step === "questions-phase1"
                ? `Big Five — Q${currentQuestion + 1}/${phaseOneQuestions.length}`
                : step === "questions-hexo"
                ? `HEXACO — Q${currentQuestion + 1}/${hexacoQuestions.length}`
                : step === "questions-enneagram"
                ? `Enneagram — Q${currentQuestion + 1}/${enneagramQuestions.length}`
                : step === "questions-disc"
                ? `DISC — Q${currentQuestion + 1}/${discQuestions.length}`
                : step === "questions-love"
                ? `Love Languages — Q${currentQuestion + 1}/${loveLanguageQuestions.length}`
                : step === "questions-emotional"
                ? `Emotional DNA — Q${currentQuestion + 1}/${EMOTIONAL_QUESTIONS.length}`
                : step === "questions-cognitive"
                ? `Cognitive DNA — Q${currentQuestion + 1}/${COGNITIVE_QUESTIONS.length}`
                : step === "questions-relationship"
                ? `Relationship DNA — Q${currentQuestion + 1}/${RELATIONSHIP_QUESTIONS.length}`
                : step === "questions-motivation"
                ? `Motivation DNA — Q${currentQuestion + 1}/${MOTIVATION_QUESTIONS.length}`
                : step === "questions-behavioral"
                ? `Behavioral DNA — Q${currentQuestion + 1}/${BEHAVIORAL_QUESTIONS.length}`
                : step === "questions-wellness"
                ? `Wellness DNA — Q${currentQuestion + 1}/${WELLNESS_QUESTIONS.length}`
                : step === "attachment"
                ? "Your relationships"
                : step === "goals"
                ? "Your intentions"
                : "Complete"}
            </span>
            <span>{progressPct}% complete</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Welcome */}
        {step === "welcome" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Brain size={36} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Let's Get to Know You</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              This helps Youna understand your personality, how you relate to others, and what you're
              looking for. It takes about 8 minutes — and every answer makes Youna more personal to you.
            </p>
            <ul className="text-left text-sm text-gray-600 mb-8 space-y-2 mx-auto max-w-sm">
              {[
                "No right or wrong answers — just be honest",
                "Your responses are private and encrypted",
                "You can skip anything you prefer not to answer",
                "We use multiple frameworks: Big Five, HEXACO, Enneagram, DISC, Love Languages, Emotional/Cognitive/Relationship/Motivation/Behavioral/Wellness DNA",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setStep("questions-phase1")}
              className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
            >
              Get Started
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Phase One Questions */}
        {step === "questions-phase1" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium mb-2">
                <Sparkles size={16} />
                <span>Big Five — Personality Fundamentals</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {phaseOneQuestions[currentQuestion].question}
              </h3>
            </div>
            <div className="space-y-4">
              {phaseOneQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handlePhaseOneAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    phaseOneAnswers[phaseOneQuestions[currentQuestion].id] === option.value
                      ? "border-indigo-500 bg-indigo-50 shadow-md"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {phaseOneAnswers[phaseOneQuestions[currentQuestion].id] === option.value && (
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
            {currentQuestion < phaseOneQuestions.length - 1 && (
              <button
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="mt-6 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <ArrowLeft size={16} />
                Go back
              </button>
            )}
          </div>
        )}

        {/* HEXACO */}
        {step === "questions-hexo" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-violet-600 text-sm font-medium mb-2">
                <Brain size={16} />
                <span>HEXACO — Six Dimensions of Personality</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {hexacoQuestions[currentQuestion].question}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Dimension: {hexacoQuestions[currentQuestion].dimension
                  .replace(/([A-Z])/g, " $1")
                  .trim()}
              </p>
            </div>
            <div className="space-y-4">
              {hexacoQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleHexacoAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    hexacoAnswers[hexacoQuestions[currentQuestion].id] === option.value
                      ? "border-violet-500 bg-violet-50 shadow-md"
                      : "border-gray-200 hover:border-violet-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {hexacoAnswers[hexacoQuestions[currentQuestion].id] === option.value && (
                      <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
            {currentQuestion < hexacoQuestions.length - 1 && (
              <button
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="mt-6 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <ArrowLeft size={16} />
                Go back
              </button>
            )}
          </div>
        )}

        {/* Enneagram */}
        {step === "questions-enneagram" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-teal-600 text-sm font-medium mb-2">
                <Target size={16} />
                <span>Enneagram — Core Motivation & Fear</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {enneagramQuestions[currentQuestion].question}
              </h3>
            </div>
            <div className="space-y-3">
              {enneagramQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleEnneagramAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    enneagramAnswers[enneagramQuestions[currentQuestion].id] === option.value
                      ? "border-teal-500 bg-teal-50 shadow-md"
                      : "border-gray-200 hover:border-teal-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {enneagramAnswers[enneagramQuestions[currentQuestion].id] === option.value && (
                      <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
            {currentQuestion < enneagramQuestions.length - 1 && (
              <button
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="mt-6 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <ArrowLeft size={16} />
                Go back
              </button>
            )}
          </div>
        )}

        {/* DISC */}
        {step === "questions-disc" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-amber-600 text-sm font-medium mb-2">
                <Shield size={16} />
                <span>DISC — Behavioral Style</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {discQuestions[currentQuestion].question}
              </h3>
            </div>
            <div className="space-y-3">
              {discQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleDiscAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    discAnswers[discQuestions[currentQuestion].id] === option.value
                      ? "border-amber-500 bg-amber-50 shadow-md"
                      : "border-gray-200 hover:border-amber-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {discAnswers[discQuestions[currentQuestion].id] === option.value && (
                      <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
            {currentQuestion < discQuestions.length - 1 && (
              <button
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="mt-6 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <ArrowLeft size={16} />
                Go back
              </button>
            )}
          </div>
        )}

        {/* Love Languages */}
        {step === "questions-love" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium mb-2">
                <Users size={16} />
                <span>Love Languages — How You Give & Receive</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {loveLanguageQuestions[currentQuestion].question}
              </h3>
            </div>
            <div className="space-y-3">
              {loveLanguageQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleLoveLanguageAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    loveLanguageAnswers[loveLanguageQuestions[currentQuestion].id] === option.value
                      ? "border-green-500 bg-green-50 shadow-md"
                      : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {loveLanguageAnswers[loveLanguageQuestions[currentQuestion].id] === option.value && (
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
            {currentQuestion < loveLanguageQuestions.length - 1 && (
              <button
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="mt-6 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <ArrowLeft size={16} />
                Go back
              </button>
            )}
          </div>
        )}

        {/* ── Phase Three: Emotional DNA ─────────────────────────────────── */}
        {step === "questions-emotional" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-rose-600 text-sm font-medium mb-2">
                <Heart size={16} />
                <span>Emotional DNA — How You Feel & Regulate</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {EMOTIONAL_QUESTIONS[currentQuestion].question}
              </h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                These questions explore your emotional world — how you experience, express, regulate,
                and recover from emotions. There are no right answers, just whatever feels true.
              </p>
            </div>
            <div className="space-y-3">
              {EMOTIONAL_QUESTIONS[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleEmotionalAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    emotionalAnswers[EMOTIONAL_QUESTIONS[currentQuestion].id] === option.value
                      ? "border-rose-500 bg-rose-50 shadow-md"
                      : "border-gray-200 hover:border-rose-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {emotionalAnswers[EMOTIONAL_QUESTIONS[currentQuestion].id] === option.value && (
                      <div className="w-6 h-6 bg-rose-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
            {currentQuestion < EMOTIONAL_QUESTIONS.length - 1 && (
              <button
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="mt-6 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <ArrowLeft size={16} />
                Go back
              </button>
            )}
          </div>
        )}

        {/* ── Phase Three: Cognitive DNA ──────────────────────────────────── */}
        {step === "questions-cognitive" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-sky-600 text-sm font-medium mb-2">
                <Brain size={16} />
                <span>Cognitive DNA — How You Think</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {COGNITIVE_QUESTIONS[currentQuestion].question}
              </h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Your cognitive style shapes how you process information, handle uncertainty, and relate
                to your own thoughts. This helps Youna match its thinking partner style to yours.
              </p>
            </div>
            <div className="space-y-3">
              {COGNITIVE_QUESTIONS[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleCognitiveAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    cognitiveAnswers[COGNITIVE_QUESTIONS[currentQuestion].id] === option.value
                      ? "border-sky-500 bg-sky-50 shadow-md"
                      : "border-gray-200 hover:border-sky-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {cognitiveAnswers[COGNITIVE_QUESTIONS[currentQuestion].id] === option.value && (
                      <div className="w-6 h-6 bg-sky-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
            {currentQuestion < COGNITIVE_QUESTIONS.length - 1 && (
              <button
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="mt-6 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <ArrowLeft size={16} />
                Go back
              </button>
            )}
          </div>
        )}

        {/* ── Phase Three: Relationship DNA ───────────────────────────────── */}
        {step === "questions-relationship" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-pink-600 text-sm font-medium mb-2">
                <Link2 size={16} />
                <span>Relationship DNA — How You Connect</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {RELATIONSHIP_QUESTIONS[currentQuestion].question}
              </h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Your relationship patterns — how you communicate, handle conflict, build trust, and pace
                intimacy. Youna uses this to match its companionship style to your relational needs.
              </p>
            </div>
            <div className="space-y-3">
              {RELATIONSHIP_QUESTIONS[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleRelationshipAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    relationshipAnswers[RELATIONSHIP_QUESTIONS[currentQuestion].id] === option.value
                      ? "border-pink-500 bg-pink-50 shadow-md"
                      : "border-gray-200 hover:border-pink-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {relationshipAnswers[RELATIONSHIP_QUESTIONS[currentQuestion].id] === option.value && (
                      <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
            {currentQuestion < RELATIONSHIP_QUESTIONS.length - 1 && (
              <button
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="mt-6 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <ArrowLeft size={16} />
                Go back
              </button>
            )}
          </div>
        )}

        {/* ── Phase Three: Motivation DNA ─────────────────────────────────── */}
        {step === "questions-motivation" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-amber-600 text-sm font-medium mb-2">
                <Zap size={16} />
                <span>Motivation DNA — What Drives You</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {MOTIVATION_QUESTIONS[currentQuestion].question}
              </h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                What fuels your actions — intrinsic curiosity, external goals, internal pressure, or a need
                for growth? Youna uses this to match its motivation and coaching style to yours.
              </p>
            </div>
            <div className="space-y-3">
              {MOTIVATION_QUESTIONS[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleMotivationAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    motivationAnswers[MOTIVATION_QUESTIONS[currentQuestion].id] === option.value
                      ? "border-amber-500 bg-amber-50 shadow-md"
                      : "border-gray-200 hover:border-amber-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {motivationAnswers[MOTIVATION_QUESTIONS[currentQuestion].id] === option.value && (
                      <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
            {currentQuestion < MOTIVATION_QUESTIONS.length - 1 && (
              <button
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="mt-6 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <ArrowLeft size={16} />
                Go back
              </button>
            )}
          </div>
        )}

        {/* ── Phase Three: Behavioral DNA ─────────────────────────────────── */}
        {step === "questions-behavioral" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium mb-2">
                <Activity size={16} />
                <span>Behavioral DNA — How You Act</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {BEHAVIORAL_QUESTIONS[currentQuestion].question}
              </h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Your behavioral tendencies — routines, impulse control, habit formation, consistency, and
                flexibility. Youna uses this to personalize habit coaching and progress tracking.
              </p>
            </div>
            <div className="space-y-3">
              {BEHAVIORAL_QUESTIONS[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleBehavioralAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    behavioralAnswers[BEHAVIORAL_QUESTIONS[currentQuestion].id] === option.value
                      ? "border-emerald-500 bg-emerald-50 shadow-md"
                      : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {behavioralAnswers[BEHAVIORAL_QUESTIONS[currentQuestion].id] === option.value && (
                      <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
            {currentQuestion < BEHAVIORAL_QUESTIONS.length - 1 && (
              <button
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="mt-6 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <ArrowLeft size={16} />
                Go back
              </button>
            )}
          </div>
        )}

        {/* ── Phase Three: Wellness DNA ───────────────────────────────────── */}
        {step === "questions-wellness" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-cyan-600 text-sm font-medium mb-2">
                <Star size={16} />
                <span>Wellness DNA — Your Wellness Baseline</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {WELLNESS_QUESTIONS[currentQuestion].question}
              </h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Your current wellness state — stress, energy, sleep, recovery, and openness to new
                approaches. Youna uses this to personalize wellness recommendations and coaching focus.
              </p>
            </div>
            <div className="space-y-3">
              {WELLNESS_QUESTIONS[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleWellnessAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    wellnessAnswers[WELLNESS_QUESTIONS[currentQuestion].id] === option.value
                      ? "border-cyan-500 bg-cyan-50 shadow-md"
                      : "border-gray-200 hover:border-cyan-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {wellnessAnswers[WELLNESS_QUESTIONS[currentQuestion].id] === option.value && (
                      <div className="w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
            {currentQuestion < WELLNESS_QUESTIONS.length - 1 && (
              <button
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                className="mt-6 flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <ArrowLeft size={16} />
                Go back
              </button>
            )}
          </div>
        )}

        {/* Attachment */}
        {step === "attachment" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-pink-600 text-sm font-medium mb-2">
                <Heart size={16} />
                <span>Relationship Style</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                How do you typically connect with others?
              </h3>
              <p className="text-gray-600 mt-2">
                This helps Youna understand how to best support you in conversations. If you've already
                answered the relationship DNA questions above, this is optional — Youna can also derive
                your attachment style from those responses.
              </p>
            </div>
            <div className="space-y-3">
              {attachmentOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAttachmentSelect(option.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    attachmentStyle === option.value
                      ? "border-pink-500 bg-pink-50 shadow-md"
                      : "border-gray-200 hover:border-pink-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{option.label}</span>
                      <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                    </div>
                    {attachmentStyle === option.value && (
                      <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Goals */}
        {step === "goals" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-teal-600 text-sm font-medium mb-2">
                <BookOpen size={16} />
                <span>Your Intentions</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">What brings you to Youna?</h3>
              <p className="text-gray-600 mt-2">
                What would you like to get out of this? There's no right answer — just whatever feels
                true for you.
              </p>
            </div>
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="For example: I've been feeling stressed lately and want someone to talk to. Or: I want to understand myself better and build better habits. Or simply: I'm curious."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-32 transition-all"
            />
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <Sparkles size={14} />
              <span>This helps Youna personalize your experience from day one.</span>
            </div>
          </div>
        )}

        {/* Complete */}
        {step === "complete" && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse-glow">
              <Check size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">You're All Set!</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Youna now understands you across <strong>8 personality frameworks</strong> and <strong>80+ dimensions</strong>.
              The more you chat, journal, and check in, the more personal it becomes.
            </p>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 text-left space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium mb-4">
                <Sparkles size={16} />
                <span>Your Personality DNA — Across 8 Frameworks</span>
              </div>

              {/* Big Five */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">Big Five</div>
                <div className="grid grid-cols-5 gap-1 text-center text-xs">
                  <div className="bg-green-50 rounded p-1">
                    <div className="text-green-700 font-semibold">O</div>
                    <div className="text-green-600">{Math.round(bigFiveScores.openness * 20)}%</div>
                  </div>
                  <div className="bg-blue-50 rounded p-1">
                    <div className="text-blue-700 font-semibold">C</div>
                    <div className="text-blue-600">{Math.round(bigFiveScores.conscientiousness * 20)}%</div>
                  </div>
                  <div className="bg-purple-50 rounded p-1">
                    <div className="text-purple-700 font-semibold">E</div>
                    <div className="text-purple-600">{Math.round(bigFiveScores.extraversion * 20)}%</div>
                  </div>
                  <div className="bg-pink-50 rounded p-1">
                    <div className="text-pink-700 font-semibold">A</div>
                    <div className="text-pink-600">{Math.round(bigFiveScores.agreeableness * 20)}%</div>
                  </div>
                  <div className="bg-amber-50 rounded p-1">
                    <div className="text-amber-700 font-semibold">N</div>
                    <div className="text-amber-600">{Math.round(bigFiveScores.neuroticism * 20)}%</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {bigFiveScores.openness >= 4 ? "Curious & open" : "Practical & grounded"} ·{" "}
                  {bigFiveScores.neuroticism <= 2 ? "Emotionally stable" : "Sensitive to stress"}
                </div>
              </div>

              {/* HEXACO */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">HEXACO</div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-violet-700 font-medium">Honesty-Humility</div>
                    <div className="text-violet-600 text-xs">{Math.round((hexacoScores.honestyHumility || 3) * 20)}%</div>
                  </div>
                  <div>
                    <div className="text-violet-700 font-medium">Emotionality</div>
                    <div className="text-violet-600 text-xs">{Math.round((hexacoScores.emotionality || 3) * 20)}%</div>
                  </div>
                  <div>
                    <div className="text-violet-700 font-medium">Extraversion</div>
                    <div className="text-violet-600 text-xs">{Math.round((hexacoScores.extraversion || 3) * 20)}%</div>
                  </div>
                  <div>
                    <div className="text-violet-700 font-medium">Agreeableness</div>
                    <div className="text-violet-600 text-xs">{Math.round((hexacoScores.agreeableness || 3) * 20)}%</div>
                  </div>
                  <div>
                    <div className="text-violet-700 font-medium">Conscientiousness</div>
                    <div className="text-violet-600 text-xs">{Math.round((hexacoScores.conscientiousness || 3) * 20)}%</div>
                  </div>
                  <div>
                    <div className="text-violet-700 font-medium">Openness</div>
                    <div className="text-violet-600 text-xs">{Math.round((hexacoScores.openness || 3) * 20)}%</div>
                  </div>
                </div>
              </div>

              {/* Enneagram */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">Enneagram</div>
                <div className="text-lg font-bold text-teal-700">
                  {enneagramType
                    ? `Type ${enneagramType} — ${enneagramDescriptions[enneagramType]?.name}`
                    : "Not assessed yet"}
                </div>
                {enneagramType && enneagramDescriptions[enneagramType] && (
                  <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                    <div>Fear: {enneagramDescriptions[enneagramType].fear}</div>
                    <div>Desire: {enneagramDescriptions[enneagramType].desire}</div>
                    <div>Growth: toward {enneagramDescriptions[enneagramType].growth}</div>
                  </div>
                )}
              </div>

              {/* DISC */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">DISC</div>
                <div className="text-lg font-bold text-amber-700">{discType || "Not assessed yet"}</div>
                {discType && (
                  <div className="text-xs text-gray-500 mt-1">{discDescriptions[discType]}</div>
                )}
              </div>

              {/* Love Languages */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">Love Languages (ranked)</div>
                <div className="flex flex-wrap gap-2">
                  {loveLangs.map((lang, i) => (
                    <span
                      key={lang}
                      className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-200"
                    >
                      {loveLangEmojis[lang]} {loveLangLabels[lang]}
                      {i === 0 ? " ⭐" : ""}
                    </span>
                  ))}
                </div>
              </div>

              {/* Attachment */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">Attachment Style</div>
                <div className="text-lg font-bold text-pink-700 capitalize">{derivedAttachment}</div>
                {attachmentStyle && (
                  <div className="text-xs text-gray-500 mt-1">{attachmentLabels[attachmentStyle]}</div>
                )}
              </div>

              {/* Communication Style */}
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="text-sm font-medium text-gray-700 mb-2">Communication Style</div>
                <div className="text-sm text-gray-900">{communicationStyle}</div>
              </div>

              {/* Framework Emphasis (Phase Three) */}
              {frameworkEmphasis.length > 0 && (
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="text-sm font-medium text-gray-700 mb-2">Therapeutic Framework Emphasis</div>
                  <div className="flex flex-wrap gap-2">
                    {frameworkEmphasis.map((fw) => (
                      <span
                        key={fw}
                        className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full border border-indigo-200"
                      >
                        <Star size={10} /> {fw}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    These frameworks are prioritized for your coaching and conversations.
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-md disabled:bg-gray-300"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving your profile...
                </>
              ) : (
                <>
                  Start Chatting
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
