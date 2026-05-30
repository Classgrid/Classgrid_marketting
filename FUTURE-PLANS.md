# Future Infrastructure Plans

## 1. Monthly Feedback Analytics Export & Reset
**Status:** Planned (To be implemented when site traffic and feedback volume scales up significantly)

**Objective:**
Keep the Sanity CMS database completely clean and well within the free-tier limit (100,000 documents) by exporting historical feedback data and wiping the database on a monthly basis.

**Implementation Plan:**
When we are ready to implement this, we will build a single Node.js script (`scripts/monthly-analytics-export.mjs`) that does the following in one click:

1. **Fetch Data:** Uses the Sanity Client to query all `websiteFeedback` documents created in the last 30 days.
2. **Export to CSV:** Converts the JSON data into a clean, highly readable CSV/Excel file. The spreadsheet will contain columns for:
   - Date Submitted
   - Page URL / Title
   - Emoji Reaction
   - Written Message
3. **Save Locally:** Saves the CSV file directly to the local computer (e.g., `analytics-archive/feedback-MAY-2026.csv`).
4. **Data Purge:** Safely executes a Sanity mutation to delete all exported `websiteFeedback` documents from the production dataset.
5. **Workflow:** The admin will take a quick screenshot of the visual Sanity Analytics Dashboard for their records, run this script to secure the text data, and start the new month with 0 documents.

**Why this is optimal:**
- Ensures the platform can run indefinitely on Sanity's free tier.
- Prevents database bloat.
- Allows for advanced offline data analysis of user feedback in Excel.
