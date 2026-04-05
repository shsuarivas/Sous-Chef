# Sous-Chef: Master Technical Reference (The "Inside Out" Guide)

Welcome to the complete technical breakdown of the Sous-Chef project. This document is designed to take you from a high-level understanding of the project structure to a deep, line-by-line mastery of the code.

---

## 1. The Global Blueprint (File Structure)

The project is divided into three primary hubs: **Frontend**, **Backend**, and **Documentation**.

### **A. Root Directory**
- `Frontend/`: The React application (Vite-powered). This is where all visual logic and user interaction lives.
- `Backend/`: The Node.js server (currently a placeholder for upcoming API and Database logic).
- `Documentation/`: PDF specifications and technical refactor logs.

### **B. Frontend Deep-Dive (`/Frontend/src`)**
- `main.jsx`: The absolute "Entry Point". This file wakes up React and tells it where to render in the `index.html`.
- `App.jsx`: The **"Traffic Controller"**. This file defines every URL (Route) in the application.
- `MainPage/`: The Dashboard Hub. Contains the `SideBar`, `TitleBar`, and the "Shell" of the application.
- `pages/`: Standalone pages like Login, Signup, and About.
- `components/`: Reusable "Building Blocks" like the standard Button.
- `constants.module.scss`: The **Design Token** file. Contains your standard colors, heights, and spacing constants.

---

## 2. The Engine (Architecture & Interactions)

### **A. Nested Routing (React Router)**
The logic in `App.jsx` uses a "Nested" approach. 
```jsx
<Route path="/main" element={<MainPage />}>
    <Route index element={<HomePage />} />
    <Route path="explore" element={<ExplorePage />} />
</Route>
```
- **The Parent (`MainPage`)**: Always stays rendered. This is why the Sidebar and Header never "flicker" or disappear when you switch tabs.
- **The Child (Outlet)**: Inside `MainPage.jsx`, the `<Outlet />` component acts as a **placeholder**. When you click "Explore", the ExplorePage simply "plugs into" that placeholder.

### **B. Style Isolation (SCSS Modules)**
Instead of just `style.css`, we use `.module.scss`. 
- **The Problem**: In normal CSS, a class like `.button` applies to the WHOLE website, which causes bugs.
- **The Solution**: SCSS Modules generate a unique ID for every class (e.g., `SideBar_button__x9z2`). This ensures that a change in the Sidebar CSS **never** accidentally breaks the Login page.

---

## 3. The Language (Syntax & Languages)

### **A. JSX (JavaScript XML)**
JSX looks like HTML but is actually JavaScript. 
- **Curly Braces `{}`**: These are the "Magic Portals". Anything inside `{}` is executed as real JavaScript logic. 
- **Example**: `<div className={styles.container}>` is telling React to "look up the container name inside the styles object".

### **B. SCSS & Glassmorphism**
We use SCSS (Sassy CSS) for variables and nested styles.
- **Glassmorphism**: As we discussed, this is achieved using 4 key properties:
    1. `backdrop-filter: blur(12px)` (The Frosting)
    2. `background: rgba(...)` (The Tint)
    3. `border: 1px solid rgba(255, 255, 255, 0.08)` (The Sharp Edge)
    4. `box-shadow` (The Depth)

---

## 4. Interaction Map: How a Click Begets a Page
1. **The User Clicks** a `<NavLink>` in `SideBar.jsx`.
2. **React Router** detects the URL change (e.g., `/main` -> `/main/explore`).
3. **App.jsx** matches the new URL to the `<ExplorePage />` component.
4. **MainPage.jsx** receives that component and swaps it into the `<Outlet />` placeholder.
5. **The Pixels Update** instantly without a full page refresh.

---

> [!NOTE]
> This structure ensures that as the project grows to include Gemini AI and real Database logic, the UI remains fast, stable, and easy to maintain.

> [!TIP]
> When looking at any `.jsx` file, remember: **Logic** lives at the top (JavaScript), and **Structure** lives at the bottom (JSX).
