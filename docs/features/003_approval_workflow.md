### Feature 3: The Approval Workflow
**Goal:** Implement the "Happy Path" where a claim is approved and points are awarded.

**Context:** Approving a claim requires allocating points to the user. This must integrate with our point system and update audit logs.

**Definition of Done:**
* [x] An "Aprovar" action button is available in the table's Action column (and/or inside the detail modal).
* [x] Clicking "Aprovar" triggers a specific approval modal prompting the superuser to input an amount of points.
* [x] Validation: The point value entered must be greater than zero.
* [x] Upon confirming approval, the points are saved to the user's profile using the `PontosService`.
* [x] The system updates the log rating.
* [x] The claim is marked as "done/approved".
* [x] The `updated_at` timestamp and `updated_by` (superuser ID) fields are updated.
* [x] The approved claim instantly disappears from the pending table.
