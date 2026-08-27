## Context

Users accumulate saved schemes, saved partners, assessment calculations, and application journeys over time. Without a central hub, this data is scattered and users struggle to track ongoing engagement. The dashboard provides a personalized view of all saved and in-progress items.

## Goals / Non-Goals

**Goals:**
- Provide a single `/dashboard` page as the personal hub
- Display sections: My Recommendations, Saved Schemes, Saved Partners, Recent Calculations, Document Readiness, Application Journey, Assessment History
- Offer quick actions: recalculate, find partner, start new assessment
- Handle empty states gracefully for each section
- Require authentication; redirect unauthenticated users

**Non-Goals:**
- Real-time data sync or live updates
- Dashboard customization or widget reordering
- Export or sharing of dashboard data
- Notification center or alerts

## Decisions

- Responsive grid layout for desktop and mobile compatibility
- Each section is an independent component with its own empty state
- Firebase authentication gates dashboard access; unauthenticated users see login prompt
- Quick actions are contextual per section, not a global action bar
- Empty states include CTAs to drive engagement (e.g., "Take your first assessment")

## Risks / Trade-offs

- **Data volume:** Users with many saved items may face slow load times; pagination or lazy loading may be needed
- **Section relevance:** Some sections may be empty for new users; empty states and progressive disclosure mitigate this
- **Performance:** Multiple data fetches per section could be slow; consider parallel fetching or a single aggregated query
- **Authentication dependency:** Dashboard is useless without login; clear redirect flow is essential
