# Youna — Decision log

> Status: AUTHORED · Updated 2026-09-23 · Owner: Ossama Mokhtar

Each decision names what was rejected and what would reverse it.

## ADR-001 — Companion, not therapist

**Decision:** position Youna as a wellness companion and remove "AI Therapist" from the name.
**Rejected:** "AI Therapist" branding (stronger search term).
**Why:** it contradicted the product's own "what Youna is not" section, and several jurisdictions now restrict AI tools presented as therapy.
**Reversal trigger:** a licensed clinical partner and regulatory clearance in a named market.

## ADR-002 — Crisis replies are fixed text, never generated

**Decision:** any crisis match returns a reviewed fixed reply and opens resources.
**Rejected:** a model reply with a crisis-mode prompt (the earlier implementation).
**Why:** it can be tested, reviewed and repeated; a generated reply cannot be guaranteed to include resources or avoid advice.
**Reversal trigger:** none planned. A classifier may improve *detection*; the *reply* stays fixed.

## ADR-003 — Browser-only storage for the prototype

**Decision:** localStorage for all user data until accounts exist.
**Rejected:** a hosted database before any user.
**Why:** no server-side sensitive data to secure while the product is unproven.
**Reversal trigger:** the first external user. Encrypted server storage is required before a public deployment.

## ADR-004 — Mock mode by default

**Decision:** `YOUNA_MOCK_MODE` defaults to mock; a real model needs an explicit opt-in.
**Why:** a fresh deployment can never spend tokens or send user text to a provider by accident.
**Reversal trigger:** a deployed beta with a cost budget and a disclosure in place.

## ADR-005 — One safety module for client and server

**Decision:** a single `src/lib/safety.ts` used everywhere.
**Rejected:** separate keyword lists per component (the earlier state, where the client list missed "suicide").
**Reversal trigger:** none.
