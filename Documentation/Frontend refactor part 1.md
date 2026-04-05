# Frontend Architecture & UI Refactor Notes

This document contains a detailed explanation of the frontend architectural changes, focusing on how and why the code works as part of standard modern web development practices.

---

## 1. Component Refactoring & The D.R.Y. Principle
**What Changed:** I deleted the redundant button components (`AboutButton.jsx`, `LoginButton.jsx`, etc.) and created a single, centralized `<Button />` component (`src/components/Button/Button.jsx`).
**How it Works:** 
- Instead of hardcoding the text and behavior in three different files, the `<Button />` accepts React **props** (`label`, `href`, `onClick`). 
- When we need a button, we write `<Button label="Login" href="/login" />`. React automatically passes those properties into the component.
- **Why:** This follows the **D.R.Y. (Don't Repeat Yourself)** principle. Future updates to button design only need to happen in one CSS file instead of three.

---

## 2. Client-Side Routing (React Router v6)
**What Changed:** Installed `react-router-dom` to handle navigation between pages without refreshing the browser.
**How it Works:**
- **`main.jsx`:** Wrapped the entire `<App />` inside a `<BrowserRouter>`. This is a React Context Provider that tracks the current URL in the browser and provides that information to all child components.
- **`App.jsx`:** Replaced the hardcoded `<DefaultHomePage />` with a `<Routes>` block containing individual `<Route path="..." element={<Component />} />`. When the URL changes to `/login`, React Router intercepts it and immediately renders the `<Login />` component.
- **`Button.jsx` Optimization:** Upgraded the Button to use the `<Link>` component instead of standard HTML `<a>` tags.
  - *Standard `<a>` tags:* Force the browser to request a completely new HTML document from the server (slow, full page flash).
  - *React Router `<Link>`:* Instantly swaps out the React components locally in the browser without talking to the server (Seamless SPA experience).

---

## 3. CSS Layout Fixes (Flexbox vs. Hardcoded Values)
**What Changed:** Fixed the responsive layout bug where the navigation buttons were bleeding off the right side of the screen.
**How it Works:**
- **The Bug:** Originally, `DefaultHomePageBar.module.scss` had a hardcoded `gap: 1150px;` between the logo and the buttons. This broke the layout on smaller screens.
- **The Fix:** Removed the hardcoded gap and used Flexbox:
  ```css
  display: flex;
  justify-content: space-between;
  ```
- *Why it works:* `space-between` automatically distributes the empty space in the middle dynamically based on the user's available screen size.

---

## 4. Advanced CSS Techniques
Modern aesthetic features breakdown:

### Glassmorphism (The Translucent Navbar & Auth Cards)
To create the "frosted glass" effect floating above the background, we combined two properties:
```css
background: rgba(30, 41, 59, 0.7); /* Dark slate background, 70% opacity */
backdrop-filter: blur(24px);       /* Blurs the pixels behind the element */
```

### Image Presentation (CSS Bounding Box Cropping)
To clean up the bottom right corner of the landing image, we used a CSS bounding box trick in `Image.module.scss`:
1. Wrapped the image in a `div` with `overflow: hidden`.
2. Applied `transform: scale(1.15)` to the `<img>` itself. This zooms the image by 15%, pushing its outer edges cleanly outside the visible boundaries of the wrapper.

### The Split-Screen Layout (`Login.jsx`, `Signup.jsx`)
To create the 50/50 split-screen design, we used Flexbox inside `Shared.module.scss`:
```css
.pageWrapper { display: flex; }
.imageHalf { flex: 1; }
.formHalf { flex: 1; }
```
- By assigning `flex: 1` to both children, the browser evenly splits the screen perfectly in half.
- Added a CSS media query `@media (min-width: 1024px)` to collapse the image layout on mobile phones, ensuring the login form prioritizes 100% of the screen space on small devices.

---

## 5. Standard Project Architecture
**What Changed:** Moved `HomePageImage.png` and `Sous_Chef_Logo.png` into `src/assets/`.
**How it Works:** In standard React development, static media files (images, icons, fonts) are universally placed in a root `assets` or `public` folder rather than deep inside specialized UI component folders. This makes it significantly easier to reuse the central brand assets across completely different pages (like reusing the logo on the Login page).
