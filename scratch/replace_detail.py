import sys
import re

with open("app/support/requests/[id]/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add a getInitials helper
helper_str = """function statusLabel(status: string) {
  switch (status) {
    case "in_progress":
      return "In Progress";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

function getInitials(name: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
"""

content = content.replace("""function statusLabel(status: string) {
  switch (status) {
    case "in_progress":
      return "In Progress";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}""", helper_str)

# Now find the Avatar rendering part
old_avatar = """                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${msg.role === "admin"
                          ? "bg-emerald-100 dark:bg-emerald-900/40"
                          : "bg-muted"
                          }`}
                      >
                        {msg.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={msg.avatar} alt={msg.author} className="w-full h-full object-cover" />
                        ) : msg.role === "admin" ? (
                          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <User className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>"""

new_avatar = """                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${msg.role === "admin"
                          ? "bg-emerald-100 dark:bg-emerald-900/40"
                          : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-sm"
                          }`}
                      >
                        {msg.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={msg.avatar} alt={msg.author} className="w-full h-full object-cover" />
                        ) : msg.role === "admin" ? (
                          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <span>{getInitials(msg.author)}</span>
                        )}
                      </div>"""

content = content.replace(old_avatar, new_avatar)

with open("app/support/requests/[id]/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Done detail page")
