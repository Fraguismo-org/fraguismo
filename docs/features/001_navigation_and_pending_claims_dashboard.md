### Feature 1: Navigation & Pending Claims Dashboard
**Goal:** Establish the basic access, routing, and read-only data grid.

**Context:** We need a secure page where superusers can view a list of all currently pending "Reinvindicações Pró Liberdade". 

**Definition of Done:**
* [x] A new menu link is added to "Adm >> Administrativo >> Aprovar Reinvindicações Pró Liberdade".
* [x] The route/page strictly enforces superuser-only access.
* [x] The page loads a data table titled "Reinvindicações Pró Liberdade Pendentes".
* [x] The table fetches and displays ONLY pending requests.
* [x] The table includes the following columns: Username, Event Name, Event Date, Created Date, and an Actions column.
* [x] All columns in the table must be sortable.
