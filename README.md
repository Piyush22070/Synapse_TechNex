# Sampatti AI 📈🤖


<img width="1440" height="900" alt="Screenshot 2025-12-19 at 9 10 16 AM" src="https://github.com/user-attachments/assets/6f329e54-92e0-48ee-8682-a459398a9cfd" />

**Sampatti AI** is a native macOS application designed to revolutionize mutual fund investing. It combines machine learning-based return predictions with a voice-enabled Generative AI advisor to help users make data-backed financial decisions.

Built entirely with **SwiftUI** for macOS, it features a sleek, responsive dashboard and requires **no external third-party libraries**.

---

## 🌟 Key Features

### 🧠 AI-Powered Advisor (Gemini Integration)
* **Conversational Finance:** Chat with "Alpha," a specialized advisor persona powered by Google's **Gemini 1.5 Flash**.
* **Voice Enabled:** Native Text-to-Speech (AVFoundation) reads advice aloud for a hands-free experience.
* **Context Aware:** The AI remembers conversation history to provide tailored advice on risks, SIPs, and asset allocation.

### 🔮 ML Return Predictions
* **Predictive Engine:** Connects to a custom Python/Flask backend to forecast **1-year, 3-year, and 5-year returns**.
* **Advanced Metrics:** Input specific financial ratios (Alpha, Beta, Sharpe, Sortino) to see how they impact potential future performance.

### 📊 Interactive Dashboard & Analytics
* **Live NAV Charts:** Visualise historical Net Asset Value (NAV) trends using native Swift Charts.
* **Benchmark Tool:** Compare potential funds against benchmarks using Simple or Advanced parameter modes.
* **Comprehensive Database:** Search and analyze funds across 40+ Asset Management Companies (AMCs).

---

## 📸 Screenshots

| Dashboard | AI Chat Advisor |
|:---:|:---:|
| ![Dashboard View]() | ![Chat Interface]() |

| Prediction Engine | NAV Analysis |
|:---:|:---:|
| ![Prediction View]() | ![NAV Chart]() |

---

## 🛠️ Tech Stack

* **Frontend:** Swift, SwiftUI (macOS 13+ Ventura/Sonoma)
* **Charts:** Swift Charts
* **Audio:** AVFoundation (Native Text-to-Speech)
* **Networking:** URLSession (Native)
* **AI Model:** Google Gemini API (Generative Language)
* **Backend (Prediction API):** Python, Flask, Google Cloud Run (for the ML model hosting)

---

## 🚀 Installation & Setup

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

## 📖 Usage Guide

1.  **Explore AMCs:** On the home screen, browse or search for a specific Asset Management Company (e.g., "HDFC Mutual Fund").
2.  **Analyze a Fund:** Click on an AMC to view available funds. Select a fund to view its historical NAV chart.
3.  **Predict Returns:** Enter financial parameters (Expense Ratio, Fund Age, Alpha, etc.) and click **"Predict Returns"** to query the ML backend.
4.  **Consult the AI:** Click the **Floating Action Button** (Waveform icon) to open the chat overlay. Type your question or ask for an explanation of the prediction.

---

## 🧠 Backend API Reference

Sampatti AI communicates with a hosted prediction service.
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

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
