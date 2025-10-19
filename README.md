# PESXplorer - PES 2021 Player Database 📊

A fast, client-side web application for searching, filtering, and comparing every player based on **PES 2021 VirtuaRED.com Patch (v9.4)**.

This project is a 100% static site (HTML, CSS, JS) that runs entirely in the browser.

## 🚀 Live Version

You can access the live version here:

**[https://pesxplorer.xyz](https://pesxplorer.xyz)**

## ✨ Features

* **Instant Search:** Find players by name.
* **Combined Filtering:** Drill down the player list by:
    * Player Name
    * Club
    * Nationality
    * General Position (GK, DF, MF, FW)
    * Specific Position (CB, RWF, CMF, etc.)
    * Overall Rating (Min/Max range)
* **Curated Default View:** The default player list automatically hides ML Default teams and classic/legend players, sorted by the highest OVR.
* **Detailed Player Modal:** Click any player to view all stats, skills, playing styles, and position compatibility in a detailed modal.
* **Player Comparison:** Select one player, then click the "VS" icon on another to see a side-by-side attribute comparison.
* **100% Client-Side:** After the initial data load, all filtering and searching is instantaneous, with no further network requests.


## 🛠️ Running Locally

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

* All player data, team data, and attributes are sourced from the incredible [**VirtuaRED.com Patch**](https://www.virtuared.com/) Teams.
* All image assets (minifaces, emblems, flags) also originate from the [**VirtuaRED.com Patch**](https://www.virtuared.com/).

---

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for more details.
