# Introduction Request Management (Professional Side) - TODO

## 🎯 Epic Overview
Build a complete system for professionals to receive, view, and respond to introduction requests from HR partners.

## 📋 Task Checklist

### **Phase 1: Backend APIs (P0)**
- [x] **Create Get Introduction Requests API** (`GET /api/v1/introductions/received`) ✅
  - [x] Filter by professional ID
  - [x] Include job role and company details
  - [x] Handle confidential company logic
  - [x] Sort by date (newest first)
  - [x] Add pagination (10, 25, 50 per page)
  - [x] Add status filtering
  - [x] Authentication check

- [x] **Create Accept Introduction API** (`POST /api/v1/introductions/:id/accept`) ✅
  - [x] Update introduction status to ACCEPTED
  - [x] Save optional response message
  - [x] Unlock contact details for professional
  - [x] Create notification for HR partner
  - [x] Return updated introduction data

- [x] **Create Decline Introduction API** (`POST /api/v1/introductions/:id/decline`) ✅
  - [x] Update introduction status to DECLINED
  - [x] Save optional response message
  - [x] Create notification for HR partner
  - [x] Return updated introduction data

### **Phase 2: Frontend Components (P0)**
- [x] **Build Introduction Requests List Page** (`/professional/introductions`) ✅
  - [x] Create main layout with filters
  - [x] Add status tabs (All, Pending, Accepted, Declined, Expired)
  - [x] Add pagination controls (10, 25, 50 options)
  - [x] Add date sorting
  - [x] Mobile responsive design
  - [x] Loading states and error handling

- [x] **Create Introduction Request Card Component** ✅
  - [x] Display job role title and seniority
  - [x] Show company info or "Confidential"
  - [x] Display salary range
  - [x] Show personalized message preview
  - [x] Add Accept/Decline buttons
  - [x] Show status badges
  - [x] Mobile-friendly layout

- [x] **Build Introduction Request Detail Modal** ✅
  - [x] Full job description display
  - [x] Complete company details (if not confidential)
  - [x] HR contact preview
  - [x] Accept/Decline buttons with message input
  - [x] Show full conversation history
  - [x] Mobile responsive modal

### **Phase 3: Frontend Integration (P0)**
- [ ] **Connect List Page to API**
  - [ ] Fetch introduction requests
  - [ ] Handle loading and error states
  - [ ] Implement pagination
  - [ ] Add status filtering
  - [ ] Real-time updates (WebSocket integration)

- [ ] **Connect Accept/Decline Actions to API**
  - [ ] Handle accept button click
  - [ ] Handle decline button click
  - [ ] Show success/error messages
  - [ ] Update UI optimistically
  - [ ] Refresh data after action

- [ ] **Add to Professional Dashboard**
  - [ ] Show top 5 recent introduction requests
  - [ ] Add "View All" link to full page
  - [ ] Display summary stats
  - [ ] Quick accept/decline actions

### **Phase 4: Notifications & Real-time (P0)**
- [ ] **Build Notification System**
  - [ ] Create notification models/API
  - [ ] Email notification templates
  - [ ] In-app notification component
  - [ ] WhatsApp integration (optional)

- [ ] **WebSocket Integration**
  - [ ] Set up WebSocket server
  - [ ] Real-time introduction updates
  - [ ] Live notification delivery
  - [ ] Connection management

### **Phase 5: Expiration Logic (P1)**
- [ ] **Add Introduction Request Expiration**
  - [ ] Create cron job for expiration
  - [ ] Set expires_at = sent_at + 7 days
  - [ ] Update status to 'EXPIRED' automatically
  - [ ] Send expiration notifications

- [ ] **Display Expired Requests**
  - [ ] Show expired requests in separate section
  - [ ] Gray out expired cards
  - [ ] Display expiration date
  - [ ] Prevent actions on expired requests

### **Phase 6: Testing & Polish (P1)**
- [ ] **Unit Tests**
  - [ ] API endpoint tests
  - [ ] Component tests
  - [ ] Integration tests

- [ ] **E2E Tests**
  - [ ] Full user flow testing
  - [ ] Mobile responsiveness
  - [ ] Cross-browser testing

- [ ] **Performance Optimization**
  - [ ] API response optimization
  - [ ] Component lazy loading
  - [ ] Image optimization

## 🎯 Current Status: **Phase 2 Complete - Frontend Components Ready** ✅

## 📊 Progress Tracking
- **Phase 1 (Backend APIs)**: 3/3 completed ✅
- **Phase 2 (Frontend Components)**: 3/3 completed ✅
- **Phase 3 (Frontend Integration)**: 0/3 completed
- **Phase 4 (Notifications)**: 0/2 completed
- **Phase 5 (Expiration Logic)**: 0/2 completed
- **Phase 6 (Testing)**: 0/3 completed

**Overall Progress: 6/16 tasks completed (38%)**

## 🚀 Next Steps
1. Start with **Get Introduction Requests API**
2. Create **Accept/Decline APIs**
3. Build **Introduction Request Card Component**
4. Create **List Page Layout**
5. Connect **Frontend to Backend**

## 📝 Notes
- Follow existing design patterns from profile page
- Use existing UI components where possible
- Implement mobile-first responsive design
- Add proper error handling and loading states
- Consider WebSocket integration for real-time updates
