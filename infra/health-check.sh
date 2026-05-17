#!/bin/bash
# ============================================================
# CLASSGRID HEALTH CHECK SCRIPT
# ============================================================
# Usage: bash health-check.sh
# Verifies all 6 microservices are running and responding
# 
# Deploy to: /home/ubuntu/classgrid/health-check.sh
# chmod +x /home/ubuntu/classgrid/health-check.sh
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "   CLASSGRID PRODUCTION HEALTH CHECK"
echo "=========================================="
echo ""

# Check if running with sudo or not
if [ "$EUID" -ne 0 ]; then
  echo -e "${YELLOW}Note: Some checks require sudo. Running with elevated privileges...${NC}"
fi

# ============================================================
# CHECK SERVICES
# ============================================================

check_service() {
  local name=$1
  local port=$2
  local url="http://localhost:${port}/health"
  
  response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
  
  if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓${NC} $name (port $port): ${GREEN}UP${NC}"
    return 0
  else
    echo -e "${RED}✗${NC} $name (port $port): ${RED}DOWN${NC} (HTTP $response)"
    return 1
  fi
}

echo "Checking Microservices..."
echo ""

check_service "Gateway" "4000" || true
check_service "Auth Service" "4101" || true
check_service "Tenant Service" "4102" || true
check_service "Payment Service" "4103" || true
check_service "Chat Service" "4104" || true
check_service "Notes Service" "4105" || true
check_service "Notification Service" "4106" || true

echo ""
echo "Checking System Services..."
echo ""

# Check Nginx
if sudo systemctl is-active --quiet nginx; then
  echo -e "${GREEN}✓${NC} Nginx: ${GREEN}RUNNING${NC}"
else
  echo -e "${RED}✗${NC} Nginx: ${RED}STOPPED${NC}"
fi

# Check Redis
if redis-cli ping > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} Redis: ${GREEN}RUNNING${NC}"
else
  echo -e "${RED}✗${NC} Redis: ${RED}STOPPED${NC}"
fi

# Check PM2 processes
pm2_count=$(pm2 list 2>/dev/null | grep 'online' | wc -l || echo "0")
echo -e "${GREEN}✓${NC} PM2 Processes: ${GREEN}${pm2_count} online${NC}"

echo ""
echo "Checking Network..."
echo ""

# Check HTTPS connectivity
for domain in api.classgrid.in app.classgrid.in classgrid.in; do
  if curl -s -o /dev/null -w "%{http_code}" "https://${domain}" 2>/dev/null | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✓${NC} $domain: ${GREEN}REACHABLE${NC}"
  else
    echo -e "${RED}✗${NC} $domain: ${RED}UNREACHABLE${NC}"
  fi
done

echo ""
echo "Checking Disk Space..."
echo ""

disk_usage=$(df -h / | awk 'NR==2 {print $5}')
disk_available=$(df -h / | awk 'NR==2 {print $4}')
echo "Root: Used $disk_usage | Available $disk_available"

echo ""
echo "Checking Memory..."
echo ""

free_mem=$(free -h | awk 'NR==2 {print $7}')
total_mem=$(free -h | awk 'NR==2 {print $2}')
echo "RAM: Free $free_mem / Total $total_mem"

echo ""
echo "Checking Database Connectivity..."
echo ""

# Try to connect to PostgreSQL (if using Supabase)
if [ ! -z "$DATABASE_URL" ]; then
  if psql "$DATABASE_URL" -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} PostgreSQL: ${GREEN}CONNECTED${NC}"
  else
    echo -e "${RED}✗${NC} PostgreSQL: ${RED}DISCONNECTED${NC}"
  fi
fi

# Try to connect to Redis
if [ ! -z "$REDIS_URL" ]; then
  if redis-cli -u "$REDIS_URL" ping > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Redis (Remote): ${GREEN}CONNECTED${NC}"
  else
    echo -e "${RED}✗${NC} Redis (Remote): ${RED}DISCONNECTED${NC}"
  fi
fi

echo ""
echo "=========================================="
echo "      HEALTH CHECK COMPLETE"
echo "=========================================="
echo ""

# Show PM2 logs if requested
if [ "$1" = "logs" ]; then
  echo "Showing PM2 logs (last 50 lines)..."
  pm2 logs --lines 50 --nostream
fi