import sys

with open("app/support/requests/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Replace formatShortDate definition
old_format_def = """function formatShortDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}"""

new_format_def = """function formatDate(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusLabel(status: string) {
  switch (status) {
    case "in_progress":
      return "In Progress";
    case "open":
      return "Open";
    case "closed":
      return "Closed";
    case "resolved":
      return "Resolved";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}"""

content = content.replace(old_format_def, new_format_def)

# 2. Replace formatShortDate calls
content = content.replace("formatShortDate(latestActivity)", "formatDate(latestActivity)")

# 3. Replace table dates
content = content.replace("new Date(req.createdAt).toLocaleDateString()", "formatDate(req.createdAt)")
content = content.replace("new Date(req.lastComment).toLocaleDateString()", "formatDate(req.lastComment)")

# 4. Replace req.status with statusLabel(req.status) where it's rendering
# In the table:
content = content.replace("{req.status}", "{statusLabel(req.status)}")

with open("app/support/requests/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Done requests page")
