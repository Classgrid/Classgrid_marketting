# 1. Setup SSO (Discourse Connect)
SiteSetting.discourse_connect_url = 'http://localhost:3000/login'
SiteSetting.discourse_connect_secret = 'classgrid_discourse_sso_secret_2026'
SiteSetting.enable_discourse_connect = true

# 2. Setup the Group for "Platform Users"
# When users log in and Next.js sends `add_groups=platform_users`, they will automatically be assigned this title!
group = Group.find_or_create_by!(name: 'platform_users') do |g|
  g.full_name = 'Platform Members'
  g.title = 'Classgrid Member' # This title will appear next to their name!
  g.has_messages = true
end

# 3. Setup Classgrid Colors
scheme = ColorScheme.find_by(name: 'Classgrid') || ColorScheme.create!(name: 'Classgrid')
colors = {
  primary: '0f0f0f',
  secondary: 'ffffff',
  tertiary: '34d399', # Classgrid Emerald
  quaternary: 'e0e0e0',
  header_background: 'ffffff',
  header_primary: '0f0f0f',
  highlight: 'fef2cd',
  danger: 'e45735',
  success: '009900',
  love: 'fa6c8d'
}
colors.each do |name, hex|
  scheme.colors.find_or_initialize_by(name: name).update!(hex: hex)
end
scheme.save!
Theme.first.update!(color_scheme_id: scheme.id) if Theme.first

# 4. Branding & Login Enforcement
SiteSetting.site_description = 'The official community for Classgrid members.'
SiteSetting.title = 'Classgrid Community'
SiteSetting.login_required = true   # Force all visitors to log in via SSO

puts "=============================================="
puts "✅ Classgrid Settings, Colors, & SSO Applied! ✅"
puts "=============================================="
