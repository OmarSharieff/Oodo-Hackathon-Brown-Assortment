#!/bin/bash

BASE_URL="https://fd3c5c40b3fe.ngrok-free.app/api"

echo "🧪 Testing Events API..."
echo ""

# 1. Create a test user first
echo "1️⃣  Creating test user..."
USER_RESPONSE=$(curl -s -X POST "$BASE_URL/users/signup" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"eventtest$(date +%s)@mail.com\",
    \"password\": \"password123\",
    \"name\": \"Event Tester\"
  }")
echo "$USER_RESPONSE"
USER_ID=$(echo "$USER_RESPONSE" | grep -o '"db_user_id":[0-9]*' | grep -o '[0-9]*')
echo "User ID: $USER_ID"
echo ""

# 2. Create an event
echo "2️⃣  Creating event..."
EVENT_RESPONSE=$(curl -s -X POST "$BASE_URL/events" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": $USER_ID,
    \"name\": \"Bathroom Meetup\",
    \"event_datetime\": \"2025-12-25T18:00:00Z\",
    \"description\": \"Best bathroom in town!\",
    \"latitude\": \"40.7128\",
    \"longitude\": \"-74.0060\"
  }")
echo "$EVENT_RESPONSE"
EVENT_ID=$(echo "$EVENT_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
echo "Event ID: $EVENT_ID"
echo ""

# 3. RSVP to event
echo "3️⃣  RSVPing to event..."
curl -s -X POST "$BASE_URL/events/$EVENT_ID/rsvp" \
  -H "Content-Type: application/json" \
  -d "{\"user_id\": $USER_ID}"
echo ""
echo ""

# 4. Check RSVP status
echo "4️⃣  Checking RSVP status..."
curl -s "$BASE_URL/events/$EVENT_ID/rsvp/$USER_ID"
echo ""
echo ""

# 5. Get event details
echo "5️⃣  Getting event details..."
curl -s "$BASE_URL/events/$EVENT_ID"
echo ""
echo ""

# 6. Get all events
echo "6️⃣  Getting all events..."
curl -s "$BASE_URL/events?upcoming=true&limit=5"
echo ""
echo ""

# 7. Get user's RSVPs
echo "7️⃣  Getting user's RSVPs..."
curl -s "$BASE_URL/events/users/$USER_ID/rsvps"
echo ""
echo ""

# 8. Un-RSVP
echo "8️⃣  Removing RSVP..."
curl -s -X DELETE "$BASE_URL/events/$EVENT_ID/rsvp" \
  -H "Content-Type: application/json" \
  -d "{\"user_id\": $USER_ID}"
echo ""
echo ""

echo "✅ All tests complete!"
