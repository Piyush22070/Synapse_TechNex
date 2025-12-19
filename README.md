# Sampatti AI

<img width="1440" height="900" alt="Sampatti AI Banner" src="https://github.com/user-attachments/assets/0950ec54-65f1-4804-bfe1-03e1fa6fe5a9" />

**Sampatti AI** is a comprehensive financial ecosystem designed to revolutionize mutual fund investing. It combines machine learning-based return predictions with a voice-enabled Generative AI advisor to help users make data-backed financial decisions.

While the flagship experience is built natively for **macOS** using SwiftUI, Sampatti AI is a cross-platform solution. The predictive engine and AI backend serve a **Web App** and a **Mobile App**, ensuring users can access their financial insights from any device.

---

## Model Performance & Accuracy

Sampatti AI utilizes a high-precision Machine Learning model hosted on Google Cloud Run. The model has been rigorously tested and demonstrates high accuracy, particularly for long-term return forecasts (3-year and 5-year horizons), making it a reliable tool for long-term investment planning.

**Performance Metrics:**

| Prediction Horizon | RMSE | R2 Score | Accuracy Level |
| :--- | :--- | :--- | :--- |
| **1 Year Return** | 4.38 | 0.369 | Moderate |
| **3 Year Return** | 3.98 | **0.878** | **High** |
| **5 Year Return** | 1.66 | **0.741** | **High** |

*As shown in the data, the model achieves an impressive **R2 score of 0.878 for 3-year predictions**, indicating a strong correlation between our predictions and actual market performance.*

---

## Key Features

### AI-Powered Advisor (Gemini Integration)
* **Conversational Finance:** Chat with "Alpha," a specialized advisor persona powered by Google's **Gemini 1.5 Flash**.
* **Voice Enabled:** Native Text-to-Speech (AVFoundation) reads advice aloud for a hands-free experience.
* **Context Aware:** The AI remembers conversation history to provide tailored advice on risks, SIPs, and asset allocation.

### ML Return Predictions
* **Predictive Engine:** Connects to a custom Python/Flask backend to forecast returns.
* **Advanced Metrics:** Input specific financial ratios (Alpha, Beta, Sharpe, Sortino) to see how they impact potential future performance.

### Interactive Dashboard & Analytics
* **Live NAV Charts:** Visualise historical Net Asset Value (NAV) trends using native Swift Charts.
* **Benchmark Tool:** Compare potential funds against benchmarks using Simple or Advanced parameter modes.
* **Comprehensive Database:** Search and analyze funds across 40+ Asset Management Companies (AMCs).

---

## Cross-Platform Ecosystem

Sampatti AI is not just a desktop application. We have deployed a unified architecture where a single, powerful backend serves multiple client interfaces:

1.  **macOS Native App:** The premium desktop experience with native charts and voice integration.
2.  **Web Application:** A responsive web interface allowing users to access predictions and chat with Alpha from any browser.
3.  **Mobile Application:** A companion mobile app for on-the-go portfolio tracking and quick advisor consultations.

All three platforms communicate with the same hosted Python/Flask server, ensuring that data, predictions, and model updates are instantly available across the entire ecosystem.

---

## Screenshots

| Dashboard | AI Chat Advisor |
|:---:|:---:|
| <img width="1440" height="900" alt="Dashboard View" src="https://github.com/user-attachments/assets/32a208b1-9342-45b8-9fea-136b3220005e" /> | <img width="1440" height="900" alt="Chat Interface" src="https://github.com/user-attachments/assets/3e3b9fff-0e76-4e8b-9530-1214aa19c18e" /> |

---

## Tech Stack

* **Frontend (macOS):** Swift, SwiftUI (macOS 13+ Ventura/Sonoma)
* **Frontend (Web/Mobile):** React / Native Frameworks
* **Charts:** Swift Charts
* **Audio:** AVFoundation (Native Text-to-Speech)
* **Networking:** URLSession (Native)
* **AI Model:** Google Gemini API (Generative Language)
* **Backend (Prediction API):** Python, Flask, Google Cloud Run (Hosting the ML model for all platforms)

---

## Installation & Setup (macOS)

### Prerequisites
* macOS 13.0 (Ventura) or later.
* Xcode 14.0 or later.
* A valid **Google Gemini API Key**.

### Steps

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/yourusername/sampatti-ai.git](https://github.com/yourusername/sampatti-ai.git)
    cd sampatti-ai
    ```

2.  **Open in Xcode**
    Open the `SampattiAI.xcodeproj` file.

3.  **Configure API Key**
    * Navigate to `AlphaAdvisorService.swift`.
    * Locate the `apiKey` property.
    * Replace the placeholder with your actual key:
        ```swift
        private let apiKey = "YOUR_ACTUAL_GEMINI_API_KEY"
        ```

4.  **Build and Run**
    * Select your Mac as the target.
    * Press `Cmd + R` to build and launch the app.

---

## Usage Guide

1.  **Explore AMCs:** On the home screen, browse or search for a specific Asset Management Company (e.g., "HDFC Mutual Fund").
2.  **Analyze a Fund:** Click on an AMC to view available funds. Select a fund to view its historical NAV chart.
3.  **Predict Returns:** Enter financial parameters (Expense Ratio, Fund Age, Alpha, etc.) and click **"Predict Returns"** to query the ML backend.
4.  **Consult the AI:** Click the **Floating Action Button** (Waveform icon) to open the chat overlay. Type your question or ask for an explanation of the prediction.

---

## Backend API Reference

Sampatti AI communicates with a hosted prediction service used by the Web, Mobile, and macOS clients.

* **Endpoint:** `POST /predict`
* **Payload Example:**
    ```json
    {
      "min_sip": 5000,
      "expense_ratio": 1.5,
      "fund_age_yr": 5,
      "alpha": 2.0,
      "sharpe": 0.8,
      "risk_level": 3,
      "category": "Equity"
    }
    ```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
