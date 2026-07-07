# Wanderer: AI Travel Concierge 🌍✈️

Wanderer is an intelligent travel assistant built as a part of the submission for the **AI Agents: Intensive Vibe Coding Capstone Project**. This conversational AI agent guides users through planning a custom trip to any destination worldwide, consolidating the entire research, itinerary building, and planning process into a single, clean user interface.

👉 **[Live Demo](https://wanderer-ai-travel-concierge.vercel.app/)**

## 🚀 Features

*   **Natural Language Planning:** Tell the agent where you want to go, your budget, and your interests, and let it handle the rest.
*   **All-in-One Dashboard:** Eliminates the need to open dozens of tabs for flights, hotels, and itineraries.
*   **Personalized Itineraries:** Generates dynamic schedules tailored to your travel style (e.g., adventure, relaxation, foodie).
*   **Real-time Adjustments:** Chat with the concierge to tweak, swap, or remove activities instantly.

## 🛠️ Tech Stack

*   **Frontend:** React, Vite, Tailwind CSS
*   **Linting/Formatting:** Oxlint
*   **AI Framework:**  OpenAI API, Vercel AI SDK

## 🤖 Architecture & Agent Design

* **User Intent Parsing:** Utilizes OpenAI models via the Vercel AI SDK to stream conversational responses and extract travel preferences (destination, budget, days).
* **Tools/Functions:** Dynamically orchestrates live data fetching by connecting the LLM to the Gemini API, AccuWeather API, Drupal API, and RouteStack API to generate accurate itineraries.

---

## 🛠️ Local Development (Optional)

You can access the website through the live demo. However, if you want to run this project locally for development or grading purposes:

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended) along with `npm`.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/SaipreethamPolepalli/ai-travel-concierge.git
    cd ai-travel-concierge
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your required API keys:
    ```env
    VITE_AI_API_KEY=your_openai_or_gemini_api_key_here
    # Add any other required tool keys (e.g., AccuWeather, RouteStack) if applicable
    ```

### Running the Application

1.  **Start the local development server:**
    ```bash
    npm run dev
    ```
    Once started, open your browser and navigate to the local URL provided in your terminal (typically `http://localhost:5173`).

2.  **Lint and format check (Oxlint):**
    To run code quality checks before making a commit:
    ```bash
    npm run lint
    ```

3.  **Build for production:**
    To generate a production-ready bundle in the `dist` directory:
    ```bash
    npm run build
    ```
