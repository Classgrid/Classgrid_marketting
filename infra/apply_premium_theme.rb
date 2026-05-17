# ================================================================
# Classgrid Community — Disable Welcome Banner + Hide Powered By
# The color scheme is already working (emerald green buttons ✅)
# ================================================================

# 1. Disable the welcome banner (the giant logo-big image)
begin
  SiteSetting.show_welcome_banner = false
  puts "✅ Welcome banner disabled via setting"
rescue => e
  puts "ℹ️  Setting not found (#{e.message}), will use CSS fallback"
end

# 2. Hide "Powered by Discourse" and welcome banner via minimal CSS
theme = Theme.find_by(name: 'Dark') || Theme.find_by(name: 'Default') || Theme.first

css = <<~SCSS
  // Hide welcome banner (logo-big giant image)
  .welcome-banner,
  .welcome-banner--enabled .welcome-banner,
  section.welcome-banner {
    display: none !important;
  }

  // Hide "Powered by Discourse" footer
  #footer-message,
  .powered-by,
  [class*="powered-by"],
  .container footer {
    display: none !important;
  }
SCSS

theme.set_field(target: :common, name: "scss", value: css)
theme.save!
puts "✅ CSS applied to '#{theme.name}': banner hidden, powered-by hidden"

# 3. Fix display name
user = User.find_by_email('nikhil.shinde@classgrid.in') || User.find_by(username: 'Nikhil_shinde')
if user
  user.name = 'Nikhil Shinde'
  user.save!(validate: false)
  puts "✅ Name fixed: '#{user.name}'"
end

puts "============================================"
puts "✅ Done! Hard-refresh forum: Ctrl+Shift+R"
puts "============================================"
