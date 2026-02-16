# The Garage - Bike Build Configurator

## Core Concept

**The Garage** is a visual bike building tool that lets you maintain a library of parts and configure different builds by mixing and matching components.

## Key Metaphors

### 🗄️ Parts Cabinet
Your collection of all possible components you're considering:
- Multiple frames (S&M Big Jumper, Haro SD, Sunday Soundwave, etc.)
- Multiple forks (Marzocchi Bomber, Odyssey R32, etc.)
- Multiple wheelsets, cranks, handlebars, etc.
- Each part has: image, brand, model, price, shop links

Think of it like your **parts wish list** or **shopping options**.

### 🏗️ The Garage (Build Configurator)
Your configured bikes - complete builds where you've selected specific parts:
- Build #1: "Street Build" - S&M frame + Marzocchi fork + ... = $1,768
- Build #2: "Budget Build" - Haro frame + Odyssey fork + ... = $1,299
- Build #3: "Dream Build" - Sunday frame + ... = $2,450

### 🔄 The Magic: Swap & Compare
- Drag parts from Cabinet → Garage
- Click to swap: "Try the cheaper fork" → price updates instantly
- Visual comparison: See how part changes affect total
- Save different configurations

## User Workflow

### Phase 1: Stock Your Parts Cabinet
1. Browse bike shops
2. Add parts you're considering to your Cabinet
3. Right-click image → copy URL → paste
4. Enter brand, model, price
5. Add multiple options per category (4 frames, 3 forks, etc.)

### Phase 2: Configure Builds
1. Create a new build ("My Street Bike")
2. Select parts from Cabinet for each category
3. See running total
4. Try swapping parts: "What if I use Frame #2 instead?"
5. Price updates instantly
6. Save configuration

### Phase 3: Compare & Decide
- View all your builds side-by-side
- Compare totals
- Swap parts to optimize price/performance
- Make informed decisions

## Data Model

### Parts (The Cabinet)
```
parts/{partId}
  - category (frame, fork, etc.)
  - brand
  - model
  - price
  - imageUrl
  - color
  - shopLinks[]
  - inCabinet: true
  - userId
```

### Builds (The Garage)
```
builds/{buildId}
  - name
  - type (bmx, dirt jumper, etc.)
  - userId
  - selectedParts {
      frame: partId,
      fork: partId,
      cranks: partId,
      ...
    }
  - totalPrice (calculated)
  - createdAt
```

## Key Differences from Old Design

### Old Design (bike_dreams):
- ❌ Add components directly to a build
- ❌ One component per category
- ❌ Static list
- ❌ Hard to compare options

### New Design (the_garage):
- ✅ Build a parts library first
- ✅ Multiple options per category
- ✅ Dynamic configurator
- ✅ Easy swapping and comparison
- ✅ Visual and interactive

## UI Layout

```
┌─────────────────────────────────────────────┐
│  The Garage                           [User]│
├─────────────────────────────────────────────┤
│                                             │
│  [Parts Cabinet] [The Garage] [Compare]    │
│                                             │
├──────────────┬──────────────────────────────┤
│              │                              │
│  CABINET     │   ACTIVE BUILD               │
│              │                              │
│  Frames (4)  │   🖼️ Frame: S&M Big Jumper  │
│  ┌─────┐    │   💰 $999                    │
│  │ S&M │    │                              │
│  └─────┘    │   🖼️ Fork: Marzocchi        │
│  ┌─────┐    │   💰 $769                    │
│  │Haro │    │                              │
│  └─────┘    │   ...                        │
│             │                              │
│  Forks (3)  │   ═══════════════════        │
│  ...        │   TOTAL: $1,768             │
│             │                              │
└─────────────┴──────────────────────────────┘
```

## Tech Stack (Same as before)
- React 18 + TypeScript + Vite
- Tailwind CSS
- Firebase (Auth + Firestore)
- React Query
- Drag & Drop: @dnd-kit/core

## Next Steps
1. Set up project foundation
2. Build Parts Cabinet UI
3. Build Garage configurator
4. Implement part swapping
5. Add comparison view
