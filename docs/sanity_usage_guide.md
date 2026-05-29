# ═══════════════════════════════════════════════════════════════
#  HOW TO USE SANITY STUDIO — Images, Videos, Links & Tables
# ═══════════════════════════════════════════════════════════════



# ─────────────────────────────────────────────────────
#  📷 ADDING AN IMAGE WITH LEFT/RIGHT LAYOUT
# ─────────────────────────────────────────────────────
#
#  This works in: Blog Body, Case Study Body
#
#  STEPS:
#
#  1. Open Sanity Studio → go to your Blog Post or Case Study
#
#  2. In the "Body" field, you'll see a toolbar at the top
#     with options like: [T] [B] [I] [+]
#
#  3. Click the [+] button (or the "Insert" dropdown)
#
#  4. You'll see a list:
#       - Image         ← click this one
#       - Table
#       - Video Embed
#
#  5. After clicking "Image", a new block appears with 3 fields:
#
#       ┌─────────────────────────────────────────┐
#       │  Image:     [Upload or Browse]          │
#       │                                         │
#       │  Caption:   "Screenshot of dashboard"   │
#       │                                         │
#       │  Layout Position:                       │
#       │    ◉ 📷 Image Left, Text Right          │
#       │    ○ 📷 Image Right, Text Left          │
#       │    ○ 📷 Image Center, Full Width        │
#       └─────────────────────────────────────────┘
#
#  6. Upload your image, type a caption, select layout
#
#  7. RESULT on website:
#
#     "Image Left" →   [IMAGE]  |  Your text paragraph
#     "Image Right" →  Your text paragraph  |  [IMAGE]
#     "Center" →       [       IMAGE        ]
#                      Your text paragraph



# ─────────────────────────────────────────────────────
#  🎬 ADDING A VIDEO WITH LEFT/RIGHT LAYOUT
# ─────────────────────────────────────────────────────
#
#  This works in: Blog Body, Case Study Body
#
#  STEPS:
#
#  1. In the Body field, click [+] → "Video Embed"
#
#  2. A new block appears with these fields:
#
#       ┌─────────────────────────────────────────┐
#       │  External Video URL:                    │
#       │    https://youtube.com/watch?v=xxxxx    │
#       │                                         │
#       │  OR Upload Video File:                  │
#       │    [Upload .mp4 / .webm]                │
#       │                                         │
#       │  Caption:   "Product demo walkthrough"  │
#       │                                         │
#       │  Layout Position:                       │
#       │    ○ 🎬 Video Left, Text Right          │
#       │    ○ 🎬 Video Right, Text Left          │
#       │    ◉ 🎬 Video Center, Full Width        │
#       │                                         │
#       │  Speaker Name:   "Nikhil Kale"          │
#       │  Speaker Role:   "Founder"              │
#       │  Speaker Avatar: [Upload]               │
#       └─────────────────────────────────────────┘
#
#  3. You can EITHER paste a YouTube/Vimeo URL
#     OR upload your own video file — not both
#
#  4. Speaker info is optional — shows a small avatar
#     card below the video if filled
#
#  5. RESULT on website:
#
#     "Video Left" →   [VIDEO PLAYER]  |  Caption text
#     "Video Right" →  Caption text  |  [VIDEO PLAYER]
#     "Center" →       [      VIDEO PLAYER       ]



# ─────────────────────────────────────────────────────
#  🔗 ADDING A LINK TO TEXT (Green Emerald Color)
# ─────────────────────────────────────────────────────
#
#  This works in: Blog, Case Study, Changelog — all of them
#
#  STEPS:
#
#  1. Type your text normally in the Body field
#     Example: "Visit our pricing page for details"
#
#  2. SELECT the text you want to make a link
#     Example: highlight "pricing page"
#
#  3. In the toolbar above, you'll see a 🔗 chain icon
#     Click it
#
#  4. A popup appears:
#
#       ┌─────────────────────────────────────────┐
#       │  URL:  https://classgrid.in/pricing     │
#       │                                         │
#       │  (For Changelog only:)                  │
#       │  ☑ Open in new tab                      │
#       └─────────────────────────────────────────┘
#
#  5. Paste the URL and click "Done" or press Enter
#
#  6. RESULT on website:
#     "Visit our  pricing page  for details"
#                 ^^^^^^^^^^^^
#                 This becomes GREEN EMERALD colored
#                 and clickable!
#
#  NOTE: You can link to:
#    - External URLs:  https://google.com
#    - Internal pages: /pricing  or  /blog/my-post
#    - Email:          mailto:hello@classgrid.in
#    - Phone:          tel:+919876543210



# ─────────────────────────────────────────────────────
#  📊 ADDING A TABLE
# ─────────────────────────────────────────────────────
#
#  This works in: Blog, Case Study, Changelog
#
#  STEPS:
#
#  1. In the Body field, click [+] → "Table"
#
#  2. FOR BLOG & CASE STUDY:
#     The first row you add = HEADER ROW (green background)
#     All rows after = data rows
#
#       ┌─────────────────────────────────────────┐
#       │  Rows:                                  │
#       │    Row 1 (header): Feature | Price      │
#       │    Row 2:          Basic   | ₹50/month  │
#       │    Row 3:          Pro     | ₹100/month │
#       │    [+ Add Row]                          │
#       └─────────────────────────────────────────┘
#
#  3. FOR CHANGELOG (uses richTable):
#     You get a SEPARATE "Column Headers" field:
#
#       ┌─────────────────────────────────────────┐
#       │  Column Headers:                        │
#       │    [Feature] [Before] [After]            │
#       │                                         │
#       │  Rows:                                  │
#       │    Row 1: Receipt  | Manual  | Auto     │
#       │    Row 2: Alerts   | None    | Instant  │
#       │    [+ Add Row]                          │
#       └─────────────────────────────────────────┘
#
#  4. RESULT on website:
#     Beautiful dark table with:
#       - Green emerald header row
#       - Hover effect on rows
#       - Rounded corners
#       - Horizontal scroll on mobile



# ─────────────────────────────────────────────────────
#  💡 BONUS: CHANGELOG-ONLY FEATURES
# ─────────────────────────────────────────────────────
#
#  Changelog's richBody also supports:
#
#  CALLOUT BOXES:
#    Click [+] → "Callout Box"
#    Choose type: Info / Tip / Warning / Success
#    Add title and body text
#    Shows as a colored box on the website
#
#  HIGHLIGHT TEXT:
#    Select text → click "Highlight" in toolbar
#    Choose color: Green / Blue / Amber / Red
#    Text gets a colored background


# ═══════════════════════════════════════════════════════════════
#  END OF GUIDE
# ═══════════════════════════════════════════════════════════════
