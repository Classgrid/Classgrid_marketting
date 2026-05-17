user = User.find_by_username('Nikhil_shinde') || User.find_by_email('nikhil.shinde@classgrid.in')
if user
  user.update!(admin: true, moderator: true)
  puts "✅ Success: Made #{user.username} an Admin!"
else
  puts "❌ User not found. Please log in first."
end

scheme = ColorScheme.find_by(name: 'Classgrid')
if scheme
  theme = Theme.find_by(name: 'Default') || Theme.first
  if theme
    theme.update!(color_scheme_id: scheme.id)
    puts "✅ Success: Applied Classgrid Emerald color scheme to the default theme!"
  end
end
