# 🛡️ Sentinel AI - Vehicle Tracking Dashboard

A fast and clean web dashboard for tracking vehicles across city CCTV cameras, built for the **Smart India Hackathon (SIH)**.

🔗 **Live Website**: [https://sih-jet-ten.vercel.app](https://sih-jet-ten.vercel.app)

---

## 🚗 What Does This Project Do?

Standard camera systems only read license plates (OCR). But if a plate is muddy, fake, or cloned onto another car, standard systems fail. 

**Sentinel AI** fixes this by checking multiple things together:
1. **License Plate Number**
2. **Car Model & Body Type** (SUV, Sedan, Hatchback, etc.)
3. **Color Matching**
4. **Speed & Map Route** (catches impossible teleportation or speeding)

If someone puts a stolen plate on a different car, the system detects it and raises an immediate alert.

---

## ⚡ Why Does the Frontend Work So Fast?

Here is how the website stays quick, responsive, and smooth:

1. **Instant In-Memory Lookups**:
   - Suspect cars and wanted plates are stored directly in browser memory (RAM).
   - Finding a match takes **under 1 millisecond** without waiting for slow server requests.

2. **No Lag / No Freezing (Sliding Window)**:
   - The live feed only displays the **50 most recent car detections** at any time.
   - This keeps the browser lightweight and prevents slowdowns even during hours of continuous live streaming.

3. **Instant Day / Night Theme Switch**:
   - Click the **Sun ☀️ / Moon 🌙** button in the top bar to toggle between **Crisp White** and **OLED Black**.
   - The GIS city map switches instantly without refreshing the page or reloading map data.

4. **Instant Calculation on Your Device**:
   - Speed calculations, route checks, and matching percentages are computed right inside your browser in under 12 milliseconds.

5. **Built with Next.js & Tailwind CSS**:
   - Pre-rendered static pages that load immediately when you open the site.

---

## 🔍 Key Features

- **📹 Live Camera Feed**: Real-time stream from 12 city surveillance cameras with realistic Indian HSRP license plates.
- **🗺️ Interactive Route Map**: Click any car to see its route plotted on the city map with animated replay.
- **🚨 Red Alert Center**: Flags cloned plates (same plate seen on two different cars) and impossible speeds.
- **📊 Analytics & Sliders**: Visual graphs showing system accuracy and interactive sliders to tune AI weights.
- **📋 Police FIR Generator**: One-click printable PDF incident report with case details ready for officers.
- **💾 Hot Cache Drawer**: Quick popup to hot-load a newly reported stolen car into memory instantly.

---

## 💻 How to Run It on Your Computer

### 1. Clone the repository
```bash
git clone https://github.com/shashidhara-1845/sih.git
cd sih
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the app
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Built With

- **Next.js 16** - React framework for fast page loads
- **Tailwind CSS v4** - Fast modern styling & light/dark mode
- **Leaflet & CartoDB** - Smooth interactive maps
- **Recharts** - Simple charts and statistics
- **Lucide Icons** - Clean icons
