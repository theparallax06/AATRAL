# AATRAL

Cooperative-owned digital workforce ecosystem connecting verified local workers with households and institutions.

## Problem Statement
Skilled workers in the unorganized sector face underutilization, wage exploitation, and a lack of social security. Concurrently, households and institutions struggle to find reliable, safely vetted local service professionals, creating a persistent skill-demand mismatch.

## AATRAL Solution
AATRAL bridges this gap as a transparent, cooperative-owned digital marketplace. By leveraging AI-driven matching, demand forecasting, and an adaptive worker allocation mechanism, AATRAL ensures equitable wages, worker welfare, and reliable service delivery.

## Key Features
- **Customer Module**: Service discovery, transparent pricing, emergency bookings, and SOS safety tools.
- **Worker Module**: Job management, availability tracking, skill ledger, ratings/reputation, and welfare benefits integration.
- **Apprentice Module**: Mentor-apprentice pairing under experienced workers, logged work records, and skill progression tracking.
- **Institution Module**: Bulk service orders, attendance management, and coordinated workforce tracking.
- **Admin Module**: Centralized worker verification, roster management, utilization tracking, and dispute resolution.
- **Voice Assistant**: Multilingual voice-based service access converting user speech into structured requests, designed especially for elderly and low-literacy users.
- **Vision-Based Service Detection**: Analyzes uploaded photos (e.g., a wall crack) to identify the required service category and suitable worker skill for intelligent service discovery.
- **AAWA (AATRAL Adaptive Worker Allocation)**: A constraint-aware mechanism ensuring skill-aware, context-aware, and explainable worker assignment.
- **AI Demand Forecasting**: Predicts workforce needs to optimize resource allocation using historical data.
- **Worker Welfare & Progression**: Integrates benefits, skill validation, and structured career progression.
- **Ombudsman / Grievance Management**: Streamlined complaint handling, evidence collection, and transparent resolution.

## End-to-End Workflow
1. **Service Request**: Customer initiates a request via Voice, Vision (photo), or text.
2. **Worker Verification**: Centralized background and credential validation ensures safety.
3. **AI Smart Matching / AAWA**: Eligible workers are filtered and scored based on multi-factor constraints.
4. **Worker Assignment**: Fair allocation of the optimal worker based on workload and proximity.
5. **Service Execution**: The service is performed, tracked, and monitored.
6. **Payment**: Secure, transparent payment processing.
7. **Feedback**: Ratings inform future AAWA scoring and worker career progression.

## Technical Architecture
A modular client-server architecture integrating a React-based frontend, a Node.js/Express application, spatial data mapping, and standalone machine learning pipelines for predictive intelligence.

## AI & Algorithms
- **XGBoost Demand Forecasting**: Python-based forecasting model to predict service volume and optimize workforce planning.
- **AAWA Adaptive Allocation**: A multi-factor weighted scoring approach prioritizing skill relevance, geographic distance, availability, reliability/safety, and current workload.
- **Vision-Based Service Detection**: Multimodal AI processing of user-uploaded images to infer service context.
- **Voice/Intent Processing**: Speech-to-intent natural language processing to generate structured service requests from voice input.

## Fairness, Safety & Explainability
AAWA ensures workload is distributed fairly among active workers. Explicit exclusion of suspended workers ensures safety. The multi-factor scoring makes matching completely transparent and explainable to both customers and workers.

## Cooperative Model
Operates on a cooperative framework where workers share ownership and governance, minimizing intermediary commissions while maximizing worker welfare and equitable pay.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Vite, Motion
- **AI & Intelligence**: Python, XGBoost, Google Gemini API
- **Location & Maps**: Leaflet, React-Leaflet
- **Backend & API**: Node.js, Express

## Security
Role-based access control, secure API key management, explicit data exclusion for suspended workers, and verified-only participant interactions.

## Project Structure
- `src/components/`: Role-based UI modules (Customer, Worker, Admin, Institution).
- `src/context/`: Application state management.
- `src/utils/`: Core logic including the AAWA matching engine.
- `src/data/`: Static mock data and configuration.
- `ml/`: XGBoost demand forecasting and AI models.

## Setup & Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Environment Setup:
   ```bash
   cp .env.example .env.local
   # Update .env.local with necessary API keys
   ```

## Running the Application
Start the development server:
```bash
npm run dev
```

## Prototype / Deployment
- **Live**: https://the-parallax06-aatral.netlify.app/
- **GitHub**: https://github.com/BanuSha05/Aatral

## Current Project Status
The prototype demonstrates the core platform, AAWA logic, and AI integrations (Voice/Vision) using mock data. The XGBoost forecasting model operates on synthetic AATRAL data.

## Future Scope
- Integration with real-world payment gateways (UPI/Razorpay).
- Large-scale production database migration to PostgreSQL.
- Dedicated mobile application using Flutter.

## Team / Project Information
- **Event**: Smart India Hackathon 2026
- **Problem Statement**: SIH26089
- **Team**: The Parallax
