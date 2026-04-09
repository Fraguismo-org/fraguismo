### Feature 4: The Denial Workflow
**Goal:** Implement the "Sad Path" where a claim is rejected, allowing for optional justification.

**Context:** When denying a claim, admins should have the option to explain why, but with strict validation on the formatting of that explanation.

**Definition of Done:**
* [x] A "Deny" action button is available in the table's Action column (and/or inside the detail modal).
* [x] Clicking "Deny" triggers a denial modal asking for a reason.
* [x] The reason field is optional.
* [x] Validation: If a reason is provided, it MUST contain more than 4 words AND be less than 255 characters.
* [x] Upon confirming denial, the claim is marked as "done/denied".
* [x] The `updated_at` timestamp and `updated_by` fields are updated.
* [x] The denied claim instantly disappears from the pending table.