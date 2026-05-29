# Classgrid Premium Footer Architecture Strategy

## Core Philosophy
The Classgrid footer is designed to be a premium, infinitely scalable component. It currently utilizes a 4-column CSS Grid (`grid-cols-4`). 

**CRITICAL DIRECTIVE FOR ALL FUTURE AI AGENTS:** 
DO NOT remove the "Get In Touch" (Contact details, Address) or "Social Presence" columns to make space for new links. The user has explicitly rejected this approach. The contact and social columns must remain fully intact exactly where they are.

## The "Anthropic" Vertical Stacking Strategy
When the platform expands and requires dozens of new links (e.g., "Products", "Solutions", "Legal"), **do not alter the CSS Grid to add more horizontal columns.**

Instead, employ the vertical stacking strategy used by premium sites like Anthropic:
1. Keep the grid at its current horizontal column count.
2. Add new link groups **vertically** underneath existing columns.
3. For example, a new "Products" section should be stacked directly underneath the "Quick Links" or "Resources" list within the exact same grid column.

### Implementation via Sanity CMS
Because the footer dynamically maps columns from Sanity (`footerColumns.map`), no CSS changes are required to execute this strategy. 

When future links are needed:
1. Update the Sanity CMS schema (if necessary) to allow multiple link groups per column.
2. The CSS Grid will automatically handle the vertical flow, ensuring the design remains spacious, balanced, and premium without disturbing the existing sequence.

**Summary:** Never change the CSS or delete the Contact info to make space. Just stack new headings vertically within the existing columns.

## Visual Architecture (The Strategy in Action)

### Current Layout (4 Columns)
```text
[  Col 1 (Quick Links)  ]    [  Col 2 (Resources)  ]    [ Col 3 (Get in Touch) ]    [ Col 4 (Social) ]
- Contact Us                 - Case Studies             📍 Address Details          [IG] [YT] [FB]
- Integrations               - FAQ                      📞 Phone Numbers            
- Community Forum            - Support                  ✉️ Email Addresses          [Google Play Badge]
- Our Team                   - Help Center
- Acknowledgements           - Book a Demo
- Compare                    - Reviews
```

### Future "Stacked" Layout (Still 4 Columns, No CSS Grid Changes)
```text
[  Col 1 (Quick Links)  ]    [  Col 2 (Resources)  ]    [ Col 3 (Get in Touch) ]    [ Col 4 (Social) ]
- Contact Us                 - Case Studies             📍 Address Details          [IG] [YT] [FB]
- Integrations               - FAQ                      📞 Phone Numbers            
- Community Forum            - Support                  ✉️ Email Addresses          [Google Play Badge]
- Our Team                   - Help Center
- Acknowledgements           - Book a Demo
- Compare                    - Reviews

[   Col 1 (Products)    ]    [ Col 2 (Random Pages)]    (This column is empty      (This column is empty
- Student Portal             - Page 1                    because it's the           because it's the
- Admin Dashboard            - Page 2                    contact column)            social column)
- Biometric Sync             - Page 3

[ Col 1 (Legal / Trust) ]    [   Col 2 (Features)  ]
- Privacy Policy             - Attendance Tracking
- Terms of Service           - AI Analytics
- SLA Agreement              - Live Chat
```
