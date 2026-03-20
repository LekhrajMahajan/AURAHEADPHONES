# SoundForge 🎧
> Premium audio e-commerce — Headphones · Earbuds · Neckbands
> React + Vite · Three.js / R3F · GSAP · Zustand · Tailwind CSS

---

## Quick Start

```bash
npm install
npm run dev       # → http://localhost:5173
npm run build     # production bundle
npm run preview   # preview production build
```

---

## Stack

| Layer       | Technology                                        |
|-------------|---------------------------------------------------|
| Framework   | React 18 + Vite 5                                 |
| 3D          | Three.js + React Three Fiber + Drei               |
| Animation   | GSAP 3 (ScrollTrigger, ScrollToPlugin)            |
| State       | Zustand 5 (persisted cart)                        |
| Routing     | React Router v6                                   |
| Styling     | Tailwind CSS 3 + CSS custom properties            |
| Fonts       | Syne (display) · Outfit (body)                    |

---

## Project Structure

```
soundforge/
├── public/
│   ├── favicon.svg              ← SVG headphone logo
│   └── models/                  ← Drop .glb files here
│
└── src/
    ├── components/
    │   ├── Cart/CartDrawer.jsx        GSAP slide-in cart
    │   ├── Cursor/Cursor.jsx          Custom cyan cursor
    │   ├── Footer/Footer.jsx          Newsletter + links
    │   ├── Hero/
    │   │   ├── HeroSection.jsx        Cinematic GSAP timeline
    │   │   └── HeroModel.jsx          R3F: rings + particles
    │   ├── Navbar/Navbar.jsx          Scroll-shrink navbar
    │   ├── ProductGrid/
    │   │   ├── ProductCard.jsx        Tilt + compare + cart
    │   │   ├── ProductGrid.jsx        Filter tabs + reveal
    │   │   └── CompareBar.jsx         Fixed compare drawer
    │   ├── ProductViewer/
    │   │   └── ProductViewer.jsx      360° drag viewer + hotspots
    │   └── ScrollStory/
    │       └── ScrollStory.jsx        Pinned horizontal scroll
    │
    ├── data/products.js               6 products · full specs
    ├── hooks/
    │   ├── useMagneticButton.js       Reusable magnetic GSAP hook
    │   ├── useScrollReveal.js         Reusable scroll reveal hook
    │   └── useToast.jsx               Global toast notifications
    ├── pages/
    │   ├── Home.jsx                   Hero + Story + Featured
    │   ├── Products.jsx               Full catalog + URL filters
    │   ├── ProductDetail.jsx          3D viewer + specs + cart
    │   └── NotFound.jsx               404 glitch animation
    └── store/useStore.js              Cart · compare · filters · UI
```

---

## Adding Real 3D Models

```bash
# Compress your model first
npx gltf-pipeline -i model.glb -o model-draco.glb --draco.compressionLevel 10
```

Place in `public/models/` then update `src/data/products.js`:

```js
{ id: 'sf-h1-void', modelUrl: '/models/headphone-h1.glb', ... }
```

Free sources: **poly.pizza** · **sketchfab.com** · **market.pmnd.rs**

---

## Design Tokens

```css
/* src/index.css */
:root {
  --void:    #080808;   /* page background   */
  --surface: #1a1a1a;   /* card background   */
  --lifted:  #2a2a2a;   /* elevated elements */
  --cyan:    #00e5ff;   /* primary accent    */
  --signal:  #ff3d6b;   /* sale / error      */
  --muted:   #a0a0a0;   /* secondary text    */
  --bright:  #f0f0f0;   /* primary text      */
}
```

---

## Connecting to MERN Backend

```js
// src/services/api.js
const BASE = import.meta.env.VITE_API_URL

export const fetchProducts = () =>
  fetch(`${BASE}/products`).then(r => r.json())

export const createOrder = (payload) =>
  fetch(`${BASE}/orders`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  }).then(r => r.json())
```

In `ProductGrid.jsx`, replace the static import with a `useEffect` + `useState` fetch call. The Zustand store's `addToCart` and cart total are already wired — just pipe the checkout button to your order API.

---

## Environment Variables

```env
# .env
VITE_API_URL=https://your-mern-backend.com/api
VITE_RAZORPAY_KEY=rzp_live_xxxx
```

---

## License
MIT