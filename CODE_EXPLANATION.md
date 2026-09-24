# Aatral Project - Code Explanation & Viva Guide

## 1. AI-Based Worker Matching
- **Main Files:** `src/utils/matchingEngine.ts` (`rankAndMatchWorkers`)
- **How it Works:** Customer criteria (service, location, min rating) are compared against available workers. Suspended or unverified workers are strictly filtered out.
- **Important Factors:** A `compositeScore` (out of 100) is calculated using 6 metrics: Proximity, Skill Relevance, Credibility (Badges), Rating, Availability (current workload), and Safety/Reliability (upheld complaints).
- **Technical Flow:** 
  Customer Request → Filter strict criteria → Calculate Distance/ETA → Compute 100-point Score → Sort descending → Recommend Worker

## 2. GIS / Location-Based Matching
- **Main Files:** `src/utils/geoUtils.ts`
- **How it Works:** Uses the Haversine formula (`calculateDistanceKm`) to find the great-circle distance between customer and worker. `calculateETAminutes` assumes a 22 km/h urban speed with traffic buffers.
- **Role in Matching:** The computed distance heavily influences the "Proximity Score" (up to 40 pts). It also includes fallback Reverse Geocoding (Nominatim OpenStreetMap / BigDataCloud) to convert coordinates to text addresses.
- **Technical Flow:** 
  Customer Address → Coordinates (Lat/Lng) → Haversine Distance → Proximity Score → Matching Engine

## 3. AI Demand Forecasting
- **Main Files:** `ml/demand_forecasting.py`, `aatral_demand_xgb_model.joblib`
- **Model & Features:** An XGBoost model predicts future demand. Key features include `district`, `service_type`, `is_weekend`, `festival_period`, and rolling/lag demand indices (7d, 14d, 30d).
- **Prediction Flow:** Exposed via a FastAPI `/predict-demand` endpoint. It merges live requests with historical averages to calculate a demand surge multiplier (e.g., >1.2x is "High").
- **Technical Flow:** 
  Admin UI Request → FastAPI Backend → Extract historical lag features → XGBoost Inference → JSON Response with Demand Multiplier → Admin Dashboard

## 4. Booking + Payment/Ombudsman Flow
- **Main Files:** `src/context/AppContext.tsx`
- **Booking Flow:** Managed via global state (`createBooking`, `updateBookingStatus`, `cancelBooking`).
- **Payment & Wallet Flow:** Internal virtual wallets (`addWalletCredit`, `deductWalletCredit`). Completing a job triggers a 5% completion reward (`COMPLETION_REWARD_PCT`) credited to the wallet upon rating.
- **Ombudsman & Resolution:** If a customer raises a dispute (`raiseComplaint`), the Ombudsman reviews it via `resolveComplaintOutcome` ('upheld' or 'dismissed'). If upheld, refunds/reworks are initiated and the worker's safety record gets penalized (`updateWorkerSafetyStatus`), directly lowering their future match reliability scores.
- **Technical Flow:** 
  Booking Created → Job Completed → Wallet Payment & Reward → (Optional) Dispute Raised → Ombudsman Review → Wallet Refund & Worker Penalty
