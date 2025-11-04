Goal: Build a reusable and accessible JobCard component in Next.js 15 + TypeScript + Tailwind CSS that displays job invitations or matches, similar to the uploaded designs.

## 💡 Component Overview

Create a JobCard component that can represent any of these states:

- Pending – waiting for candidate response (Accept / View Details / Decline buttons).
- Accepted – shows acceptance confirmation, message, and “Continue Conversation.”
- Declined – displays decline message and reason in red state.
- Expired – disabled, grayed-out style with no interaction.

Each card shows:
- Company logo initials in a rounded avatar block (e.g. “FH”).
- Role title and company name.
- Industry tag (e.g. “Fintech”, “Manufacturing”, “Consulting”).
- Message preview with recruiter name and intro message.
- Compensation range, location, type (full-time/remote), and sent date.
- Match percentage badge (e.g. “95 % Match”) with contextual color intensity (green → strong match, yellow → medium).
- State badge (Pending | Accepted | Declined | Expired) with consistent iconography.