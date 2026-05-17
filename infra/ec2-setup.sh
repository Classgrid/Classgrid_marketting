#!/bin/bash
# ============================================================
# CLASSGRID EC2 SETUP SCRIPT
# ============================================================
# One-stop script to configure EC2 instance from scratch
# Usage: bash ec2-setup.sh
#
# This script:
# 1. Updates system packages
# 2. Installs Node.js, Nginx, Redis, PostgreSQL client
# 3. Installs PM2 globally
# 4. Sets up directories
# 5. Clones the repository
# 6. Installs dependencies
# 7. Sets up SSL certificates
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "============================================"
echo "   CLASSGRID EC2 SETUP"
echo "============================================"
echo -e "${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
   echo -e "${RED}Please run as root (use sudo)${NC}"
   exit 1
fi

# Variables (CUSTOMIZE THESE)
DOMAIN="${DOMAIN:-classgrid.in}"
EMAIL="${EMAIL:-admin@$DOMAIN}"
REPO_URL="${REPO_URL:-https://github.com/your-org/classgrid.git}"
BRANCH="${BRANCH:-main}"
HOME_DIR="/home/ubuntu"
APP_DIR="$HOME_DIR/classgrid"

echo -e "${YELLOW}Configuration:${NC}"
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo "Repository: $REPO_URL"
echo "Branch: $BRANCH"
echo "App Directory: $APP_DIR"
echo ""

# ============================================================
# STEP 1: UPDATE SYSTEM
# ============================================================
echo -e "${YELLOW}Step 1: Updating system packages...${NC}"
apt update
apt upgrade -y
apt install -y curl wget git build-essential

# ============================================================
# STEP 2: INSTALL NODE.JS 22 LTS
# ============================================================
echo -e "${YELLOW}Step 2: Installing Node.js 22 LTS...${NC}"
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

echo -e "${GREEN}✓ Node.js $(node --version) installed${NC}"

# ============================================================
# STEP 3: INSTALL NGINX
# ============================================================
echo -e "${YELLOW}Step 3: Installing Nginx...${NC}"
apt install -y nginx
systemctl start nginx
systemctl enable nginx

echo -e "${GREEN}✓ Nginx installed and enabled${NC}"

# ============================================================
# STEP 4: INSTALL REDIS
# ============================================================
echo -e "${YELLOW}Step 4: Installing Redis...${NC}"
apt install -y redis-server
systemctl start redis-server
systemctl enable redis-server

echo -e "${GREEN}✓ Redis installed and enabled${NC}"

# ============================================================
# STEP 5: INSTALL POSTGRESQL CLIENT
# ============================================================
echo -e "${YELLOW}Step 5: Installing PostgreSQL client...${NC}"
apt install -y postgresql-client

echo -e "${GREEN}✓ PostgreSQL client installed${NC}"

# ============================================================
# STEP 6: INSTALL PM2 GLOBALLY
# ============================================================
echo -e "${YELLOW}Step 6: Installing PM2 globally...${NC}"
npm install -g pm2
pm2 startup systemd -u ubuntu --hp $HOME_DIR

echo -e "${GREEN}✓ PM2 installed${NC}"

# ============================================================
# STEP 7: CREATE DIRECTORIES
# ============================================================
echo -e "${YELLOW}Step 7: Creating directories...${NC}"
mkdir -p /var/log/classgrid/{gateway,auth,tenant,payment,chat,notes,notification}
mkdir -p /var/log/nginx/classgrid
chown -R ubuntu:ubuntu /var/log/classgrid
chown -R www-data:www-data /var/log/nginx/classgrid

echo -e "${GREEN}✓ Directories created${NC}"

# ============================================================
# STEP 8: CLONE REPOSITORY (as ubuntu user)
# ============================================================
echo -e "${YELLOW}Step 8: Cloning repository...${NC}"
cd $HOME_DIR

if [ -d "$APP_DIR" ]; then
  echo -e "${YELLOW}Repository already exists. Pulling latest changes...${NC}"
  cd $APP_DIR
  sudo -u ubuntu git pull origin $BRANCH
else
  sudo -u ubuntu git clone -b $BRANCH $REPO_URL classgrid
fi

cd $APP_DIR
echo -e "${GREEN}✓ Repository cloned${NC}"

# ============================================================
# STEP 9: INSTALL DEPENDENCIES
# ============================================================
echo -e "${YELLOW}Step 9: Installing npm dependencies...${NC}"

# Install gateway
cd $APP_DIR/server/gateway
sudo -u ubuntu npm ci

# Install each microservice
for service in auth-service tenant-service payment-service chat-service notes-service notification-service; do
  cd $APP_DIR/server/services/$service
  sudo -u ubuntu npm ci
done

echo -e "${GREEN}✓ All dependencies installed${NC}"

# ============================================================
# STEP 10: SETUP NGINX CONFIG
# ============================================================
echo -e "${YELLOW}Step 10: Setting up Nginx configuration...${NC}"

# Copy nginx config
cp $APP_DIR/nginx-classgrid.conf /etc/nginx/sites-available/classgrid

# Symlink to sites-enabled
rm -f /etc/nginx/sites-enabled/classgrid
ln -s /etc/nginx/sites-available/classgrid /etc/nginx/sites-enabled/classgrid

# Test nginx config
if nginx -t; then
  echo -e "${GREEN}✓ Nginx configuration is valid${NC}"
else
  echo -e "${RED}✗ Nginx configuration has errors${NC}"
  exit 1
fi

# ============================================================
# STEP 11: SETUP SSL CERTIFICATE (Let's Encrypt)
# ============================================================
echo -e "${YELLOW}Step 11: Setting up SSL certificate...${NC}"

# Install Certbot
apt install -y certbot python3-certbot-nginx

# Request wildcard certificate
echo -e "${YELLOW}You will be prompted to add DNS records. Make sure you have:${NC}"
echo "  - API Record: A record pointing to EC2 IP"
echo "  - Set up wildcard domain: *.${DOMAIN}"
echo ""
echo -e "${YELLOW}Requesting certificate for ${DOMAIN} and *.${DOMAIN}...${NC}"

certbot certonly --manual --preferred-challenges=dns \
  -d $DOMAIN -d *.$DOMAIN \
  --agree-tos \
  -m $EMAIL \
  --no-eff-email

# Create certificate renewal timer
systemctl enable certbot.timer

echo -e "${GREEN}✓ SSL certificate configured${NC}"

# ============================================================
# STEP 12: RESTART NGINX
# ============================================================
echo -e "${YELLOW}Step 12: Restarting Nginx...${NC}"
systemctl restart nginx

echo -e "${GREEN}✓ Nginx restarted${NC}"

# ============================================================
# STEP 13: SETUP ENVIRONMENT FILE
# ============================================================
echo -e "${YELLOW}Step 13: Setting up environment file...${NC}"

if [ ! -f "$APP_DIR/.env.production" ]; then
  cp $APP_DIR/.env.production.template $APP_DIR/.env.production
  chmod 600 $APP_DIR/.env.production
  
  echo -e "${YELLOW}⚠️  IMPORTANT: Edit .env.production with your secrets:${NC}"
  echo "  nano $APP_DIR/.env.production"
  echo ""
  echo "Required values to add:"
  echo "  - DATABASE_URL"
  echo "  - JWT_SECRET"
  echo "  - RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET"
  echo "  - FIREBASE_* (for push notifications)"
  echo "  - SENDGRID_API_KEY (for emails)"
  echo ""
  echo -e "${YELLOW}After updating, press Enter to continue...${NC}"
  read
fi

# ============================================================
# STEP 14: START PM2 SERVICES
# ============================================================
echo -e "${YELLOW}Step 14: Starting services with PM2...${NC}"

cd $APP_DIR
sudo -u ubuntu pm2 start ecosystem.config.json
sudo -u ubuntu pm2 save

echo -e "${GREEN}✓ PM2 services started${NC}"

# ============================================================
# STEP 15: SETUP CRON JOBS
# ============================================================
echo -e "${YELLOW}Step 15: Setting up cron jobs...${NC}"

# Health check every 5 minutes
(sudo -u ubuntu crontab -l 2>/dev/null || echo "") | (cat; echo "*/5 * * * * bash $APP_DIR/health-check.sh > /tmp/health-check.log 2>&1") | sudo -u ubuntu crontab -


echo -e "${GREEN}✓ Cron jobs configured${NC}"

# ============================================================
# COMPLETION
# ============================================================
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}   EC2 SETUP COMPLETE${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo ""
echo "1. Edit environment file:"
echo "   nano $APP_DIR/.env.production"
echo ""
echo "2. Verify services are running:"
echo "   bash $APP_DIR/health-check.sh"
echo ""
echo "3. Check PM2 logs:"
echo "   pm2 logs"
echo ""
echo "4. Add DNS records in your registrar (GoDaddy/Namecheap):"
echo "   Type   | Name | Value"
echo "   A      | @    | $(curl -s https://checkip.amazonaws.com)"
echo "   A      | *    | $(curl -s https://checkip.amazonaws.com)"
echo ""
echo "5. Test HTTPS connections:"
echo "   curl -v https://api.$DOMAIN/health"
echo "   curl -v https://$DOMAIN"
echo ""
echo -e "${GREEN}Classgrid is ready! 🎉${NC}"
