# InAmigos Foundation — Premium Web Redesign

A premium, highly interactive, and visually stunning redesign of the **InAmigos Foundation** home webpage. While keeping all real content, statistics, and organizational functions, this project introduces a fresh dark organic design language, glassmorphic structures, and smooth animations that make it stand out.

 

---

## 🎨 Design & Aesthetic Features

- **Dark Organic Theme**: Sophisticated carbon-slate background (`#07090e`) paired with large blurred accent blobs in **Electric Emerald** (`#10b981`) and **Amber Saffron** (`#f59e0b`).
- **Floating Sticky Header**: A floating glassmorphic top navigation bar with dynamic active-section highlighting and CTA triggers.
- **3D Card Stack**: A interactive visual stack on the Hero section that rotates and tilts dynamically based on mouse movement.
- **Bento Grid Layouts**:
  - **Credentials Grid**: Showcases credentials and government recognitions (Section 8, NITI Aayog, ISO, 80G/12A) in a bento-style glass card grid.
  - **Social Impact Dashboard**: Visualizes community reach figures (Meals, Interns, Trees, Strays) with smooth counter animations on scroll.
- **Filterable Project Grid**: Visitors can sort initiatives by category (Education, Welfare, Nature). Selecting a card slides in a deep descriptions drawer from the right.
- **Cursor-Tracking Timeline**: Hovering over events reveals active photos that follow the mouse cursor with a smooth lag effect.
- **Consolidated Action Hub**: Toggles Volunteer, Partner (CSR), and Donation instructions inside a single beautiful tabbed dashboard.

---

## 🛠️ Technology Stack

- **Core**: HTML5, Vanilla CSS3 (Custom Variables, CSS Grid, Flexbox, Media Queries), Vanilla JavaScript
- **Smooth Scrolling**: [Lenis](https://github.com/darkroomengineering/lenis) for smooth inertia-momentum scrolling.
- **Animations**: [GSAP (GreenSock)](https://gsap.com/) and [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) for preloader reveals, stat counters, slide drawers, and mouse coordinates tracking.
- **Icons**: [Lucide Icons](https://lucide.dev/) for vector designs.

---

## 📁 Project Structure

```text
InAmigos/
├── assets/
│   └── images/          # Real project photos, logos, and QR codes
├── index.html           # Main markup entry point
├── style.css            # Stylesheet containing variables, themes, and grids
├── script.js            # Interactivity script (ScrollTrigger, Lenis, Drawer, Tabs)
└── README.md            # Project documentation
```

---

