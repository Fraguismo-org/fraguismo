### Feature 2: View & Edit Claim Details
**Goal:** Allow admins to inspect the full details of a claim and correct any erroneous data before making a decision.

**Context:** The data grid from Feature 1 only shows a summary. Admins need a way to see everything and edit it without leaving the page.

**Definition of Done:**
* [x] Clicking on any row in the pending claims table opens a detailed modal.
* [x] The modal displays all available information for that specific "reinvindicacao".
* [x] All fields within this modal are editable by the superuser.
* [x] Saving the modal persists the edited information to the database (the changed information must have an effect).
