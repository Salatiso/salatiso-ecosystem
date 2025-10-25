# Phase 1 · Sonny Ecosystem Alignment Report
**Date:** October 13, 2025  
**Prepared by:** GitHub Copilot (MNI Digital Operations)  
**Purpose:** Establish a unified baseline for Sonny-enabled ecosystem integration across documentation, architecture, consent, trust and LifeCV flows before we begin implementation work.

---

## 1. Phase Goals & Success Criteria

- **Canonize the architecture** for Sonny-enabled hybrid mesh ↔ internet operations covering LifeSync, Sonny Chat, Library, The Hub, PigeeBack, SafetyHelp, BizHelp, eKhaya, HRHelp and shared services.
- **Inventory every authoritative document**, identify drift or gaps, and flag sensitive content that must remain internal.
- **Define cross-app data flows** (consent ledger, trust propagation, LifeCV proof streams, trigger escalation, mesh bridging) so subsequent phases can reference one source of truth.
- **Produce action-ready findings** that drive Phase 2 documentation updates and Phase 3 build tasks without rework.

Success = project team agrees on the architecture baseline, understands documentation ownership, and has a clear backlog of updates and approvals.

---

## 2. Documentation Inventory & Status

| Document | Last Updated | Role in Ecosystem | Alignment Status | Sensitivity & Notes |
| --- | --- | --- | --- | --- |
| `Documents/TECHNICAL_SPECIFICATIONS.md` | Oct 12 2025 | Master web + platform specification | **Needs addendum** for Sonny core service, consent ledger API, bridge flows | Public-friendly but still technical; scrub internal email references |
| `Documents/ANDROID_APP_SPECIFICATION.md` | Oct 12 2025 | Native Android parity spec | **Needs update** for Sonny 3.0 integration, trust parity, reciprocal exchange | No sensitive family content; safe to publish |
| `Documents/LIFESYNC_UPDATED_SPECIFICATION_V3.md` | Oct 13 2025 | Core LifeSync + Sonny architecture | **Baseline** (canonical) | Internal, contains API keys; must redact keys for public derivatives |
| `Documents/SONNY_CHAT_ANDROID_SPECIFICATION.md` | Oct 13 2025 | Sonny standalone Android spec | **Baseline** | Internal (mesh details, threat models) |
| `Documents/SONNY_IMPLEMENTATION_ROADMAP.md` | Oct 13 2025 | 24-month roadmap | **Baseline** | Internal (budget + staffing) |
| `Documents/SONNY_INTEGRATION_SUMMARY.md` | Oct 13 2025 | Meta summary of Sonny docs | **Baseline** | Can be adapted for public overview |
| `Documents/SALATISO_ECOSYSTEM_PATENT_SPECIFICATION.md` | Oct 13 2025 | Patent claim dossier | **Baseline** | Highly sensitive; internal only |
| `Documents/MLANDELI_NOTEMBA_TRUST_FRAMEWORK.md` | Oct 13 2025 | Trust + consent philosophy & mechanics | **Baseline** | Internal (full formulas, anti-gaming). Need public extract |
| `Documents/INTEGRATION_UPDATE_OCTOBER_12_2025.md` | Oct 12 2025 | Print/JSON integration record | **Current** | Public-safe |
| `Documents/BUGFIX_HOMEPAGE_I18N_OCTOBER_12_2025.md` | Oct 12 2025 | Bugfix log | **Current** | Public-safe |
| `Documents/00-FOUNDATIONAL_DOCUMENTS/*` | Various | Ecosystem narrative & foundational policies | **Review required** for Sonny narrative alignment | Mix of public & internal; requires tagging |
| `templates/` & `public/templates/` | Various | Legacy HRHelp collateral | **To be expanded** with MNI-branded ecosystem templates | Public-facing |

**Findings**
1. Sonny documentation is complete but siloed. We need a summary chapter inside the global technical spec and Android spec to avoid duplication.
2. Trust & consent details exist but require a public-facing digest that omits formulas, thresholds, and family identities.
3. Foundational documents contain the newest ecosystem story but lack Sonny cross-references.
4. Template library currently only covers HRHelp; we need a unified template index for the full ecosystem (Phase 5).

---

## 3. Architecture Baseline (Narrative Map)

### 3.1 Platform Layers
1. **Sonny Core Service** (new shared service)
   - Mesh engine (Bluetooth LE, Wi-Fi Direct, gossip routing) running on Android clients.
   - Bridge service (web/desktop/TV) providing online gateway via WebSockets + REST.
   - Trigger manager & escalation pipeline.
   - Consent ledger (append-only, cryptographic signatures).
   - Reciprocal safety exchange vault.
2. **LifeSync Hub** (Android + Web)
   - Master client for households; inherits Sonny core modules.
   - Synchronizes with LifeCV (proofs, ratings) and The Hub (governance data).
3. **Ecosystem Web Apps** (Next.js/React)
   - MNI intranet, PigeeBack, SafetyHelp, BizHelp, HRHelp, eKhaya, Library.
   - Embed Sonny web widgets (presence radar, trigger dashboards, trust overlays).
   - Communicate with Sonny Core via gateway APIs + WebSocket presence bus.
4. **LifeCV & Trust Services**
   - Central identity, trust scoring, proof handling.
   - Accepts reciprocal proof artifacts from all apps.
   - Provides trust tier & reciprocity telemetry back to Sonny gateway.
5. **DocuHelp & Data Lake**
   - Stores mission cards, template outputs, reports, evidence packages (encrypted).
   - Interfaces with Library for curated public releases.

### 3.2 Core Flows (Phase 1 Definitions)
- **Consent Onboarding**: user accepts terms → consent ledger entry created (Sonny) → trust service flagged → LifeCV permissions set → proofs auto-tag future evidence.
- **Real-Time Presence**: clients register presence with Sonny gateway → broadcast to subscribed apps → UI widgets reflect availability and mesh/online status.
- **Trigger Escalation**: user creates trigger in any app → Sonny trigger manager schedules check-in → missed event cascades through mesh, then internet (if available), with trust + consent logs appended.
- **Reciprocal Safety Exchange**: two parties exchange QR tokens → data stored locally (encrypted) → if bridging, sync to Sonny vault → accessible across apps based on consent tiers.
- **Trust Propagation**: interactions recorded in Sonny → normalized via trust framework → LifeCV updates tiers → front-ends fetch current trust + badges via API.
- **LifeCV Proof Drop**: mission templates generate proof payload → pushes to LifeCV with Sonny metadata (mission ID, reciprocity tags, consent scope) → available for mentors & audits.

### 3.3 Sensitive Data Zones
- Consent ledger (PII, location scopes) → internal & encrypted.
- Reciprocal safety vault (contact info, trip routes) → internal only.
- Trust scoring formulas & anti-gaming heuristics → internal.
- Patent claim details → internal (to legal/leadership).

Public docs can reference capabilities (consent ledger, reciprocal exchange) but not share formulas, thresholds, or identities.

---

## 4. Documentation Alignment Tasks (Output for Phase 2)

1. **Add “Sonny Core Integration” chapter** to `TECHNICAL_SPECIFICATIONS.md` (web focus).
2. **Append "Sonny-Lite Interoperability" section** to `ANDROID_APP_SPECIFICATION.md` summarizing how Android app consumes Sonny APIs.
3. **Draft public primer**: `Documents/PUBLIC_SONNY_ECOSYSTEM_OVERVIEW.md` (new) explaining the ecosystem, life cycle, trust philosophy without exposing sensitive data.
4. **Update documentation index** to include Sonny docs and mark sensitivity tiers (public/internal/confidential).
5. **Annotate Foundational docs** (Vision, Strategy, Governance) with Sonny references and link to new primer.
6. **Create architecture diagrams** (PlantUML/Mermaid textual definitions) for core flows and embed in specs during Phase 2.

---

## 5. Action Items & Owners

| Task | Owner | Due | Notes |
| --- | --- | --- | --- |
| Confirm architecture narrative & data flows | Copilot + Leadership | Oct 13 (EOD) | Use this report as baseline |
| Approve documentation sensitivity tagging | Leadership | Oct 13 | Ensure legal compliance |
| Kick off Phase 2 doc updates | Copilot | Oct 14 | Follow Section 4 backlog |
| Prepare diagram assets | Copilot | Oct 14 | Mermaid/PlantUML in repo |
| Schedule cross-team review | Ops Coordinator | Oct 15 | Include LifeSync, Sonny, Library leads |

---

## 6. Risks & Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Documentation drift resurfaces after integration | High | institute doc change log + review checkpoints (Phase 2) |
| Sensitive data leaks into public templates | High | maintain sensitivity tagging, add review gate before publishing |
| Architecture assumptions misalign with current codebase | Medium | coordinate with engineering leads before Phase 3 build |
| Template rollout stalls due to missing Sonny narrative | Medium | use public primer (Task #3) as source for all collateral |

---

## 7. Next Steps (Phase 2 Prep)

1. **Get feedback** on this report and lock the baseline.
2. **Start documentation edits** per Section 4 on Oct 14.
3. **Draft public Sonny primer** to feed into template development (Phase 5).
4. **Coordinate with engineering** to confirm API interfaces for Sonny Core Service before implementation sprints.

*Ready to begin Phase 2 on October 14, pending approvals above.*
