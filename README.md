# PESXplorer - PES 2021 Player Database 📊

A fast, client-side desktop web application for searching, filtering, and comparing every player based on **PES 2021 VirtuaRED.com Patch (v10.2)**. Designed for performance and ease of use, PESXplorer allows users to drill down into the database to find the perfect player using both general criteria and deep attribute analysis.

This project is a 100% static site (HTML, CSS, JS) that runs entirely in the browser.

## 🚀 Live Version

You can access the live version here:

**[https://pesxplorer.xyz](https://pesxplorer.xyz)**

## ✨ Key Features

### 🔍 Comprehensive Search & Filtering
* **Instant Name Search:** Real-time filtering as you type.
* **General Filters:** Quickly filter by Club, Nationality, General Position (GK, DF, MF, FW), and Specific Position (e.g., CMF, RWF).
* **OVR Range:** Filter players based on their Overall Rating minimum and maximum values.

### ⚙️ Advanced Filtering System
Take your scouting to the next level with the new Advanced Search modal:
* **Physical Attributes:** Filter by Age, Height, and Weight ranges.
* **Player Details:** Filter by Preferred Foot, Weak Foot Accuracy, Form, and Injury Resistance.
* **Technical Criteria:**
    * **Playing Styles:** Search for specific roles like *Build Up*, *Box-to-Box*, or *Creative Playmaker*.
    * **Player Skills:** Find players with specific traits like *Knuckle Shot*, *One-touch Pass*, or *Man Marking*.
    * **Specific Abilities:** Filter players who meet a minimum stat threshold (e.g., Speed > 90, Kicking Power > 85).

### 🆚 Player Comparison
* **Side-by-Side View:** Select a player and click the "VS" icon on another player to instantly compare their stats.
* **Visual diffs:** Easily spot strengths and weaknesses between two targets.

### 📊 Detailed Insights
* **Complete Player Profile:** Click any player to view their full attribute list, including hidden stats.
* **Data Visualization:** Clean, color-coded UI to represent stat tiers (Red, Orange, Green, Teal).

### 🛠️ 100% Client-Side
After the initial data load, all filtering and searching is instantaneous, with no further network requests.


## 💻 Running Locally

This project cannot be run by opening the `index.html` file directly from your filesystem (e.g., `file:///...`). The browser's security policy (CORS) will block the script from fetching the `players.json` file.

You **must** serve the files using a local web server. The easiest way is with the **Live Server** extension in VS Code.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/xyzsteven/PESXplorer.git
    ```
2.  **Open the folder** in VS Code.
3.  **Install** the [**Live Server**](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension from the VS Code Marketplace.
4.  **Right-click** on `index.html` in the VS Code Explorer.
5.  Select **"Open with Live Server"**.

Your browser will automatically open to `http://127.0.0.1:5500` (or a similar port), and the application will be fully functional.


## Acknowledgments

* All player data, team data, and attributes are sourced from the incredible [**VirtuaRED.com Patch**](https://www.virtuared.com/foro/viewtopic.php?p=385070) Teams.
* All image assets (minifaces, emblems, flags) also originate from the [**VirtuaRED.com Patch**](https://www.virtuared.com/foro/viewtopic.php?p=385070).

---

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for more details.
