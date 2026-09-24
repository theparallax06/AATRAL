# AATRAL
Cooperative Gig Services Platform for Household & Community Services

## Problem
Skilled workers in the unorganized sector are often underutilized and face wage exploitation, while households and institutions struggle to find reliable, verified local workers. There is a persistent skill-demand mismatch and a significant welfare and protection gap for these essential service providers.

## Solution
AATRAL is a cooperative-owned digital workforce platform that bridges this gap by offering a transparent marketplace. It connects verified workers with customers using AI-assisted matching, fair workload allocation, and demand intelligence, ensuring equitable wages and social security benefits.

## Key Features
- **Customer**: Service discovery, explainable worker matching, transparent wage info, emergency bookings, and SOS safety tools.
- **Worker**: Job management, availability tracking, skill ledger, ratings/reputation, and welfare benefits integration.
- **Apprentice**: Mentor-apprentice pairing under experienced workers, logged work records, and skill progression tracking.
- **Institution**: Bulk service orders, attendance management, and coordinated workforce tracking.
- **Admin/Cooperative**: Centralized worker verification, roster management, utilization tracking, demand allocation, and dispute resolution.

## AI & Demand Intelligence
AATRAL features a sophisticated explainable worker matching engine that scores based on proximity, skill relevance, credibility/verification, rating, and availability/workload (while explicitly excluding suspended workers for safety). 
The platform includes an XGBoost-based demand forecasting prototype designed to predict workforce needs and optimize resource allocation. 
*(Note: The current forecasting prototype uses synthetic AATRAL data, not real-world production data).*

## Workflow
1. **Service Request**: Customers request a specific service.
2. **Verification**: Worker credentials and background are verified.
3. **AI Matching**: AI suggests the best matches based on location, skill, and workload.
4. **Fair Allocation**: Ensuring equitable job distribution among available workers.
5. **Execution**: The service is performed and monitored.
6. **Payment**: Secure and transparent payment processing.
7. **Feedback**: Ratings provided by customers drive continuous learning and worker progression.

## Apprentice & Ombudsman
- **Apprentice Workflow**: Pair with Mentor → Supervised Work → Work Log → Skill Validation → Ranking/Progression.
- **Ombudsman Workflow**: Complaint → Evidence Collection → Admin/Ombudsman Review → Resolution → Audit Closure.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Vite
- **Intelligence**: Python, XGBoost, Gemini API
- **Location/GIS**: Leaflet (Maps)
- **Backend/Infra**: Node.js, PostgreSQL
- **Mobile/Payments**: Flutter, UPI/Razorpay

## Project Structure
- `src/components/`: Role-based UI views (Customer, Worker, Admin, Institution).
- `src/context/`: Application state management.
- `src/utils/`: Core logic including the `matchingEngine`.
- `src/data/`: Static data and mock configurations.
- `ml/`: Demand forecasting and AI models.

## Run Locally
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Environment Setup:**
   ```bash
   cp .env.example .env.local
   ```
3. **Start Development Server:**
   ```bash
   npm run dev
   ```

## Prototype
- **Live**: https://the-parallax-aatral.netlify.app/
## Hackathon
- **Event**: Smart India Hackathon 2026
- **Team**: THE PARALLAX
- **Problem Statement**: SIH26089
## Youtube link
--https://youtu.be/k3zG6Iy5-1A
