# AATRAL

## Cooperative-Owned. AI-Assisted. Fair Workforce Allocation.

**Cooperative Gig Services Platform for Household & Community Services**

**Team: THE PARALLAX**

AATRAL is a cooperative-owned digital workforce platform for **Smart India Hackathon 2026**. It connects verified workers with household, community, and institutional service demand through AI-assisted matching, fair allocation, transparent wages, welfare, and demand intelligence.

---

## 1. Smart India Hackathon 2026

- **Problem Statement:** SIH26089
- **Project:** AATRAL
- **Category:** Software
- **Team:** The Parallax

---

## 2. Problem Statement

Skilled workers are often underutilized and difficult to discover, while households and institutions struggle to find reliable, verified local workers.

Key gaps include:

- Skill-demand mismatch
- Limited worker visibility
- Wage transparency gaps
- Welfare/protection gaps
- Fragmented worker verification
- Limited apprentice progression

---

## 3. Proposed Solution

AATRAL provides an end-to-end workforce workflow:

```text
Service Demand
      ↓
Customer / Institution Request
      ↓
Worker Verification
      ↓
AI-Assisted Matching
      ↓
Fair Allocation
      ↓
Service Execution
      ↓
Payment & Feedback
      ↓
Welfare & Progression
      ↓
Demand Intelligence
```

The platform combines cooperative governance, explainable matching, workforce planning, welfare, apprenticeships, and institutional service management.

---

## 4. Key Innovation

- **Cooperative-Owned Workforce:** Cooperatives manage and strengthen local skilled workers.
- **Explainable AI Matching:** Uses skill, location, availability, workload, credibility, and ratings.
- **Fair Allocation:** Supports transparent workload distribution.
- **Demand-Aware Planning:** Forecasts demand for proactive workforce allocation.
- **Transparent Wages:** Shows clear service/wage information before booking.
- **Worker Progression:** Connects work history, training, ratings, and skills.
- **Apprentice Pathway:** Builds supervised experience through mentor work logs.
- **Ombudsman Workflow:** Structured complaint, review, resolution, and audit handling.

---

## 5. Core Features

### Customer
- Service discovery and booking
- Explainable worker ranking
- Credentials, ratings, and reputation
- Transparent wages/service information
- Emergency booking and SOS safety
- Payment and feedback

### Worker
- Booking and job management
- Availability/workload tracking
- Verified skills and credentials
- Ratings and reputation
- Training/skill ledger
- Welfare and benefit support
- Work history and utilization

### Apprentice

```text
Apprentice → Mentor Assignment → Supervised Work
→ Work Log → Skill Validation → Ranking / Progression
```

Apprentices work under experienced workers and build verified work records.

### Institution
- Bulk service orders
- Multi-worker allocation
- Attendance management
- Workforce scheduling
- Service execution tracking

### Admin / Cooperative
- Worker verification
- Roster management
- Worker utilization
- Demand allocation
- Workforce planning
- Welfare grants
- Apprentice tracking
- Quality/trust monitoring
- Ombudsman and dispute resolution

---

## 6. AI & Demand Intelligence

AATRAL's explainable matching engine uses:

- Geographic proximity
- Skill relevance
- Verification/credentials
- Rating and reputation
- Availability
- Workload/utilization
- Safety and eligibility constraints

Suspended or ineligible workers are excluded.

### Demand Forecasting

```text
Historical Demand → Feature Engineering
→ XGBoost Forecast → Expected Demand
→ Workforce Planning → Resource Allocation
```

The prototype uses **Python + XGBoost**, with temporal, lag, rolling-demand, district, service-type, and workforce features. Evaluation includes **MAE, RMSE, MAPE, and SMAPE**.

> **Note:** The current forecasting prototype uses synthetic AATRAL data and is not production accuracy.

---

## 7. Fair Allocation & Transparent Wages

Allocation considers:

**Skill Fit + Location + Availability + Workload + Verification + Reputation + Service Requirements**

Customers can view transparent service/wage information before booking.

---

## 8. Welfare & Worker Progression

The platform supports:

- Welfare scheme tracking
- Insurance/benefit integration
- Training records
- Skill development
- Utilization visibility
- Incentive eligibility
- Apprentice progression

Verified work history, performance, and training can contribute to progression and benefits.

---

## 9. Ombudsman & Dispute Resolution

```text
Complaint → Evidence → Case Registration
→ Admin/Ombudsman Review → Resolution → Audit Closure
```

Provides traceability for customer, worker, and institutional disputes.

---

## 10. Technical Architecture

```text
Customer ────────┐
Worker ──────────┤
Apprentice ──────┤
Institution ─────┤
Admin ───────────┘
        ↓
Application Layer
        ↓
Service & Workflow APIs
        ↓
┌──────────┬──────────────┬────────────┐
│ Matching │ Forecasting  │ Welfare &  │
│ Engine   │ & Analytics  │ Progression│
└──────────┴──────────────┴────────────┘
        ↓
Central Data Layer
```

---

## 11. Matching Engine

```text
Eligible Workers → Verification Filter → Distance / ETA
→ Skill Relevance → Credibility & Rating
→ Availability / Workload → Safety & Reliability
→ Composite Score → Ranked Workers
```

The scoring approach provides explainable ranking while applying verification and safety constraints.

---

## 11. Route-Aware Smart Matching

AATRAL combines worker suitability with geographic routing instead of selecting a worker only by proximity.

### Matching Flow

```text
Eligible Workers → Skill Filter → Haversine Distance
→ Road Distance / ETA → Availability & Workload
→ Reliability / Rating → Composite Score → Ranked Workers
```

### Algorithms & Methods

- **Haversine Formula:** Calculates geographic distance between customer and worker coordinates.
- **Shortest-Route / Routing:** Road-network distance and ETA can be obtained through OpenStreetMap/OSRM-based routing.
- **Composite Multi-Criteria Scoring:** Combines route/ETA, skill match, verification, availability, workload, rating, and reliability.
- **Future Multi-Worker Optimization:** Hungarian Algorithm / min-cost assignment can be used when multiple customers and workers must be allocated simultaneously.

This ensures that the nearest worker is not automatically selected. A worker with stronger skill compatibility, availability, reliability, and a reasonable travel time can receive a higher overall matching score.

### Example

```text
Customer Request
      ↓
Eligible Workers
      ↓
Skill + Credential Validation
      ↓
Distance & Route/ETA Calculation
      ↓
Availability + Workload Check
      ↓
Reliability + Rating
      ↓
Explainable Composite Score
      ↓
Ranked Worker Recommendations
```

## 13. Application Workflow

1. User logs in through the appropriate role.
2. Customer/institution creates a service request.
3. Worker credentials and eligibility are verified.
4. Matching engine identifies suitable workers.
5. Workers are ranked using explainable criteria.
6. Booking is confirmed.
7. Worker executes the service.
8. Payment is processed.
9. Feedback and ratings are recorded.
10. Work records update progression.
11. Welfare/training records can be updated.
12. Demand information supports workforce planning.

---

## 14. Technology Stack

| Technology | Purpose |
|---|---|
| React | Web application |
| Tailwind CSS | UI styling |
| Vite | Build tooling |
| Node.js | Backend services/APIs |
| PostgreSQL | Platform data |
| Python | AI and analytics |
| XGBoost | Demand forecasting |
| Gemini API | AI assistance/recommendations |
| Leaflet / GIS | Location services |
| Flutter | Mobile application |
| UPI / Razorpay | Digital payments |

---

## 15. Project Structure

- `src/components/` — Role-based UI modules
- `src/context/` — Application state management
- `src/utils/` — Core business logic and matching engine
- `src/data/` — Static/mock data
- `ml/` — Demand forecasting and AI modules

---

## 16. Run Locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

---

## 17. Project Status

Current prototype includes:

- Customer, Worker, Apprentice, Institution, and Admin workflows
- Explainable worker matching
- Worker verification and credentials
- Transparent wage/service information
- Emergency booking and SOS
- Worker welfare and progression
- Apprentice mentor/work-log workflow
- Institutional bulk service management
- Ombudsman/dispute workflow
- XGBoost demand forecasting prototype
- GIS/location-based matching
- Digital payment workflow

---

## 22. Deployment & Project Links

- **Live Application:** https://the-parallax-aatral.netlify.app/
- **GitHub:** https://github.com/theparallax06/AATRAL
- **Demo Video:** https://www.youtube.com/watch?v=k3zG6Iy5-1A

---

## 23. Future Scope

- Real-world demand data integration
- Government/cooperative system integrations
- Advanced demand forecasting
- Automated credential verification
- Voice-assisted multilingual workflows
- Welfare and insurance integrations
- Advanced apprentice skill assessment
- Workforce heatmaps
- Fraud/anomaly detection
- Regional scaling

---

## 24. Limitations & Disclaimer

AATRAL is a **software-based cooperative workforce management and service-matching prototype**.

The current demand forecasting demonstration uses synthetic data. AI-assisted matching and forecasting require validation with real operational data before production deployment.

External payment, welfare, identity, credential, and government integrations may require production APIs, compliance controls, and institutional authorization.

---

## 25. Team

**THE PARALLAX**

**Project:** AATRAL  
**Smart India Hackathon 2026**  
**Problem Statement:** SIH26089
