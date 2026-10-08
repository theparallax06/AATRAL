# AATRAL

### Cooperative-Owned. Fair. Verified. AI-Enabled.

**Cooperative Gig Services Platform for Household & Community Services**

AATRAL is a cooperative-owned digital service platform that connects verified local workers with households and institutions. It brings worker verification, location-based matching, demand forecasting, fair allocation, transparent pricing, worker welfare, and simple service discovery into one place.

---

## 2. Problem Statement

Labour Cooperative Federations and Labour Cooperative Societies have a large pool of skilled workers including electricians, plumbers, carpenters, painters, domestic helpers, caregivers, drivers, gardeners, cleaners and technicians.

However, these workers often remain underutilized because cooperatives lack a structured digital platform to connect them with households and institutions requiring services.

AATRAL addresses this gap by creating a **cooperative-owned digital service marketplace** focused on:

* Verified service providers
* Fair wages
* Worker welfare
* Consumer trust
* Skill-demand matching
* Digital service delivery
* AI-based demand forecasting and workforce allocation

---

## 3. Proposed Solution

AATRAL brings the main parts of a cooperative workforce system together in one platform:

```text
Customer / Institution
        ↓
Text / Voice / Vision Service Request
        ↓
Service & Skill Identification
        ↓
Verified Worker Pool
        ↓
AI Smart Matching
        ↓
AAWA Adaptive Worker Allocation
        ↓
Worker Assignment
        ↓
Service Execution
        ↓
Digital Payment & Invoice
        ↓
Rating / Feedback
        ↓
Worker Progression & Future Allocation
```

The platform combines customer access, worker management, cooperative administration, institutional demand, apprentice progression, welfare and grievance resolution in one ecosystem.

---

## 4. Key Innovation

* **Cooperative-Owned:** Enables cooperatives to manage and strengthen their local workforce.
* **Demand-Aware:** Forecasts service demand for proactive workforce deployment.
* **Fair & Explainable:** Uses transparent multi-factor worker allocation.
* **Worker Progression:** Connects verified work with training and career development.
* **Vision-Based Detection:** Converts issue photographs into service/skill identification.
* **AAWA:** Adaptive worker allocation using skill, distance, availability, reliability and workload.
* **Accessibility-First:** Voice-based service access supports elderly and low-literacy users.
* **Worker-Centric:** Integrates welfare, benefits, apprenticeships and grievance support.

---

## 5. Core Modules

### 5.1 Customer Module

* Service discovery and booking
* Transparent wages and pricing
* Worker rankings, credentials and service history
* Emergency booking
* SOS and customer safety
* Voice-based service requests
* Vision-based service detection

### 5.2 Worker Module

* Booking and job management
* Availability tracking
* Skill and credential profiles
* Ratings and reputation
* Training ledger
* Welfare benefits
* Performance-based progression

### 5.3 Apprentice Module

* Apprentice–worker pairing
* Work-based learning
* Worker-maintained work logs
* Skill progression tracking
* Ranking improvement through verified work experience

### 5.4 Institution Module

* Bulk service orders
* Workforce scheduling
* Attendance management
* Coordinated worker deployment
* Institutional service records

### 5.5 Admin Module

The Admin module acts as the central junction of the AATRAL ecosystem.

* Worker verification
* Roster management
* Worker utilization monitoring
* Demand allocation
* Workforce planning
* Welfare grant management
* Ombudsman and grievance coordination
* Platform-wide monitoring

---

## 6. Voice Assistant

AATRAL provides voice-based service access for users who may face difficulty with text input.

```text
Voice Input
    ↓
Speech / Intent Processing
    ↓
Structured Service Request
    ↓
Service Matching
    ↓
Worker Allocation
```

This improves accessibility for elderly, low-literacy and differently enabled users.

---

## 7. Vision-Based Service Detection

AATRAL allows users to capture an image of a service issue and use it to identify the required service category.

**Example:**

```text
Wall Crack Photo
      ↓
Vision Analysis
      ↓
Required Service / Skill
      ↓
Eligible Worker Pool
      ↓
AAWA Allocation
```

This reduces dependence on technical service terminology and simplifies service discovery.

---

## 8. AAWA — AATRAL Adaptive Worker Allocation

AAWA is AATRAL's custom, context-aware worker allocation mechanism.

It does not depend on a simple first-come-first-served model. Instead, eligible workers are evaluated using multiple factors:

| **Factor** | **Purpose** |
|---|---|
| Skill Relevance | Matches required skill with worker capability |
| Distance | Reduces travel burden and response time |
| Availability | Allocates only available workers |
| Reliability | Considers verified performance and ratings |
| Workload | Prevents excessive concentration of jobs |

### AAWA Workflow

```text
Eligible Worker Filtering
        ↓
Multi-Factor Weighted Scoring
        ↓
Fair Allocation Decision
        ↓
Worker Assignment
        ↓
Workload Update
        ↓
Feedback
        ↓
Future Allocation Improvement
```

The approach makes allocation **skill-aware, workload-aware and explainable**.

---

## 9. AI Demand Forecasting

AATRAL uses a Python-based **XGBoost demand forecasting prototype** to estimate future service requirements.

```text
Historical Service Data
        ↓
Data Preparation
        ↓
XGBoost Model
        ↓
Demand Forecast
        ↓
Service × Location × Time Analysis
        ↓
Workforce Planning
```

The forecast supports proactive worker deployment and reduces demand–supply imbalance.

> **Prototype Note:** The current forecasting demonstration uses synthetic/project data.

---

## 10. Worker Welfare & Progression

AATRAL extends beyond service booking by supporting worker development and welfare.

* Welfare benefit tracking
* Training and certification records
* Apprentice development
* Skill progression
* Performance-based incentives
* Worker safety mechanisms
* Structured career growth

Workers who maintain strong performance and ratings can be connected to additional benefits and progression pathways.

---

## 11. Ombudsman & Grievance Management

The Ombudsman layer provides a structured mechanism for handling disputes and protecting trust across the cooperative ecosystem.

```text
Complaint / Grievance
        ↓
Evidence Collection
        ↓
Case Registration
        ↓
Admin / Ombudsman Review
        ↓
Resolution
        ↓
Case Closure & Record
```

This creates an accountable pathway for customer and worker grievances.

---

## 12. Institution Workforce Management

Institutions can use AATRAL to coordinate larger service requirements.

Key capabilities include:

* Bulk service requests
* Worker scheduling
* Attendance tracking
* Workforce visibility
* Service completion monitoring
* Centralized institutional records

This converts fragmented institutional service requirements into structured workforce demand.

---

## 13. Technical Architecture

```text
                AATRAL PLATFORM
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   Customer        Worker        Institution
        │              │              │
        └──────────────┼──────────────┘
                       ↓
                Admin / Cooperative
                       ↓
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   AI Forecasting     AAWA       Vision / Voice
        │              │              │
        └──────────────┼──────────────┘
                       ↓
              Workforce Allocation
                       ↓
              Service Execution
                       ↓
          Payment + Feedback + Welfare
```

---

## 14. Technology Stack

| **Technology** | **Purpose** |
|---|---|
| React | Web application interface |
| Vite | Development and build system |
| Tailwind CSS | Responsive UI styling |
| Node.js / Express | Backend and API layer |
| Python | ML processing |
| XGBoost | Demand forecasting |
| Google Gemini API | AI-assisted intelligence |
| Leaflet / React-Leaflet | Geo-location and maps |
| JavaScript / TypeScript | Application logic |
| Netlify | Live prototype deployment |

---

## 15. Security & Trust

AATRAL incorporates security and trust mechanisms across the platform.

* Role-based access control
* Worker verification
* Credential validation
* Protected API configuration
* Verified participant interactions
* Suspended-worker exclusion
* Customer SOS support
* Transparent allocation logic
* Structured grievance handling

---

## 16. Application Workflow

1. Customer or institution creates a service request.
2. Request can be submitted through text, voice or vision-assisted input.
3. Required service category and worker skill are identified.
4. Eligible verified workers are filtered.
5. AAWA evaluates skill, distance, availability, reliability and workload.
6. The most suitable worker is allocated.
7. Worker accepts and performs the service.
8. Payment and invoice records are generated.
9. Customer provides rating and feedback.
10. Feedback contributes to worker progression and future allocation.
11. Demand forecasting supports future workforce planning.

---

## 17. Expected Impact

### Worker Impact

* Better utilization of skilled workers
* Reduced idle time
* Fairer job allocation
* Improved welfare access
* Structured skill progression

### Customer Impact

* Verified local services
* Transparent pricing
* Faster matching
* Safer service delivery
* Accessible service discovery

### Cooperative Impact

* Digital workforce visibility
* Demand-based planning
* Stronger worker participation
* Centralized administration
* Reduced dependence on private intermediaries

### Economic Impact

* Local employment growth
* Better workforce productivity
* More organized service delivery
* Scalable cooperative model

---

## 18. Market Context

India's digital home-services and gig-work ecosystem provides a large opportunity for a cooperative-led platform.

* **120 lakh gig workers** in FY2024–25.
* **₹8,500–8,800 Cr** projected online home-services market by FY2030.
* **18–22% CAGR** projected for online home services through FY2030.

**Sources:** Government of India, *Economic Survey 2025–26*; India Brand Equity Foundation (IBEF), 2025.

---

## 19. Project Status

AATRAL is currently a functional software prototype that demonstrates the main parts of the cooperative service ecosystem.

The current version includes:

* Customer, Worker, Apprentice, Institution and Admin modules
* Worker verification and skill profiling
* Service booking and matching
* AAWA allocation logic
* Voice and vision-assisted service discovery
* AI demand forecasting workflow
* Welfare and progression concepts
* Ombudsman / grievance workflow
* Geo-location based service matching
* Live web deployment

The AI forecasting component currently uses synthetic/project data for demonstration.

---

## 19. Setup & Installation

### 19.1 Clone the Repository

```bash
git clone https://github.com/theparallax06/AATRAL
cd Aatral
```

### 19.2 Install Dependencies

```bash
npm install
```

### 19.3 Configure Environment

Create a local environment file from the example configuration:

```bash
cp .env.example .env.local
```

Add the required API configuration.

### 19.4 Run Locally

```bash
npm run dev
```

---

## 20. Deployment & Project Links

### 20.1 Live Deployment

**AATRAL Live Prototype:**  
https://the-parallax-aatral.netlify.app/

### 20.2 GitHub Repository

**Source Code:**  
https://github.com/theparallax06/AATRAL

### 20.3 Project Demo Video

**YouTube:**  
https://youtu.be/k3zG6Iy5-1A

### 20.4 Android APK

**APK Download:**  
https://github.com/theparallax06/AATRAL/releases/tag/v1.0.0
---

## 23. Future Scope

* Production-grade PostgreSQL deployment
* Full UPI / Razorpay integration
* Dedicated Flutter mobile application
* Government and cooperative-system integrations
* Expanded multilingual voice support
* Real-world demand datasets
* Continuous ML model retraining
* Expanded welfare and insurance integrations
* Regional cooperative federation deployment
* Advanced analytics and workforce optimization

---

## 22. Team

**THE PARALLAX**

**Project:** AATRAL  
**Team:** THE PARALLAX

---

## 23. License

AATRAL is developed as a software project by **Team THE PARALLAX**.
