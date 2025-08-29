# MovieApp

A React + TypeScript web app to browse films by category, view details, and manage a wishlist. Built with Vite, SCSS, Redux, and TMDB API.

**Live Demo:** [MovieApp on GitHub Pages](https://bouthourimed.github.io/MovieApp/#/)

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Setup & Run](#setup--run)
3. [Testing](#testing)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Pages & Components](#pages--components)
6. [Hooks](#hooks)
7. [Possible Improvments](#possible-improvements)

---

### 📂 Project Structure

```bash
📂 src
├─ 📂 pages
│  ├─ 📂 authCallbackPage
│  │  ├─ 📄 AuthCallbackPage.tsx
│  │  ├─ 🎨 AuthCallbackPage.scss
│  │  └─ 🧪 AuthCallbackPage.test.tsx
│  └─ 📂 watchListPage
│     ├─ 📄 WatchListPage.tsx
│     ├─ 🎨 WatchListPage.scss
│     └─ 🧪 WatchListPage.test.tsx
├─ 📂 components
│  ├─ 📂 watchButton
│  │  ├─ 📄 WatchButton.tsx
│  │  ├─ 🎨 WatchButton.scss
│  │  └─ 🧪 WatchButton.test.tsx
│  └─ 📂 additionalInfo
│     ├─ 📄 AdditionalInfo.tsx
│     ├─ 🎨 AdditionalInfo.scss
│     └─ 🧪 AdditionalInfo.test.tsx
├─ 📂 hooks
│  ├─ 📄 useTMDBAuth.ts
│  └─ 🧪 useTMDBAuth.test.tsx
├─ 📂 store
│  ├─ 📄 authSlice.ts
│  └─ 📄 apiSlice.ts
├─ 📄 routes.ts
├─ 📄 main.tsx
└─ 🧪 test-utils.tsx

📄 = TypeScript file
🎨 = SCSS stylesheet
🧪 = Test file
📂 = Folder
```

## Setup & Run

```bash
# Clone repo
git clone https://github.com/bouthourimed/MovieApp.git
cd MovieApp

# Install dependencies
npm ci

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing

##### Run all tests + Update snapshots

```bash
# Run tests
npm run test:u
```

Tests use Vitest + Testing Library, and each page, component, and hook has dedicated tests:

- **_useTMDBAuth_** → login, finalizeLogin, session saving

- **_AuthCallbackPage_** → hash parsing, navigation

- **_Components_** → rendering, interactions, conditional UI

##### Custom Test Helpers are defined in test-utils.tsx:

- **_createTestStore(preloadedState?)_** → creates a Redux store with all slices & middleware for tests

- **_render(ui, options)_** → renders a component wrapped in Redux Provider + React Router

- **_renderHookWithStore(hook, options)_** → renders a hook with Redux store + router wrapper

- **_renderWithoutRouter(ui, options)_** → renders a component with Redux only, no router

- **_setupDOMMocks()_** → mocks scrollable container dimensions for scroll tests

###### Minimal Example

```bash
import { screen, fireEvent } from "@testing-library/react";
import * as useTMDBAuthHook from "./hooks/useTMDBAuth";
import { createTestStore, render } from "./test-utils";
import App from "./App";

describe("App", () => {
  const mockLogin = vi.fn();
  const mockFinalizeLogin = vi.fn();
  const store = createTestStore({ auth: { sessionId: "abc", accountId: 1 } });

  it("renders login button when not logged in", () => {
    vi.spyOn(useTMDBAuthHook, "useTMDBAuth").mockReturnValue({
      auth: { sessionId: null, accountId: null, account: null },
      login: mockLogin,
      finalizeLogin: mockFinalizeLogin,
    });

    render(<App />, { store });

    expect(screen.getByText(/login with tmdb/i)).toBeInTheDocument();
  });

  it("navigates to watchlist page when link clicked", () => {
    render(<App />, { store });
    const watchlistLink = screen.getByText(/wishlist/i);
    fireEvent.click(watchlistLink);
    expect(screen.getByText(/My Wishlist/i)).toBeInTheDocument();
  });
});
```

## CI/CD Pipeline

The project uses **GitHub Actions** for continuous integration (CI) and continuous deployment (CD). The workflow is defined in:

`.github/workflows/ci-cd-pages.yml`

##### Workflow Triggers

- `push` on `main` branch → runs CI/CD automatically on new commits
- `pull_request` to `main` → runs CI for testing PRs
- `workflow_dispatch` → allows manual run from GitHub Actions tab

### Jobs

#### 1. CI: Lint & Test

- **Runs on:** `ubuntu-latest`
- **Steps:**
  1. **Checkout code** → pulls the latest commit
  2. **Setup Node.js** → version 20
  3. **Install dependencies** → `npm ci` ensures a clean install
  4. **Lint** → `npm run lint` to enforce code quality and formatting
  5. **Test** → `npm run test` to verify all components, pages, and hooks work as expected

> Ensures that broken code is caught before deployment.

#### 2. CD: Build & Deploy to GitHub Pages

- **Runs on:** `ubuntu-latest` (after successful CI)
- **Conditional:** Only runs on `push` to `main`
- **Steps:**
  1. **Checkout code**
  2. **Setup Node.js**
  3. **Install dependencies**
  4. **Build project** → `npm run build` produces optimized static files in `/dist`
  5. **Deploy to GitHub Pages** → uses `peaceiris/actions-gh-pages` to publish `/dist` to `gh-pages` branch

> Deployment is automatic and ensures the latest version is always live at:
> [https://bouthourimed.github.io/MovieApp/#/](https://bouthourimed.github.io/MovieApp/#/)

### Key Notes

- **Atomic workflow:** CI must pass before CD runs → prevents broken builds from being deployed
- **Reproducibility:** `npm ci` ensures exact versions are installed
- **Static hosting:** GitHub Pages serves the Vite-built app
- **Security:** `GH_PAT` secret is used for deployment token
- **Manual trigger:** You can run `workflow_dispatch` to force a deployment without a code push

## Pages & Components

#### 1. HomePage

- **Path:** `src/pages/homePage/`
- **Files:**
  - `HomePage.tsx`
  - `HomePage.scss`
  - `HomePage.test.tsx`
- **Purpose:** Displays 3 carousels of movies by category. Clicking on a movie navigates to its detail page.
- **Tests:** Carousel rendering, item click navigation.
- **Links:** [HomePage](src/pages/homePage/HomePage.tsx)

---

### 2. MovieDetailPage

- **Path:** `src/pages/movieDetailPage/`
- **Files:**
  - `MovieDetailPage.tsx`
  - `MovieDetailPage.scss`
  - `MovieDetailPage.test.tsx`
- **Purpose:** Shows movie details (description, image, etc.) with a category-specific style and a button to add/remove from wishlist.
- **Tests:** Rendering movie info, conditional styles, button interactions.
- **Links:** [MovieDetailPage](src/pages/movieDetailPage/MovieDetailPage.tsx)

---

### 3. WatchListPage

- **Path:** `src/pages/watchListPage/`
- **Files:**
  - `WatchListPage.tsx`
  - `WatchListPage.scss`
  - `WatchListPage.test.tsx`
- **Purpose:** Displays all items added to the wishlist.
- **Tests:** Rendering wishlist items, interactions.
- **Links:** [WatchListPage](src/pages/watchListPage/WatchListPage.tsx)

---

### 4. AuthCallbackPage

- **Path:** `src/pages/authCallbackPage/`
- **Files:**
  - `AuthCallbackPage.tsx`
  - `AuthCallbackPage.scss`
  - `AuthCallbackPage.test.tsx`
- **Purpose:** Handles TMDB redirect after login, calls `finalizeLogin` from `useTMDBAuth`, and navigates to the requested page.
- **Tests:** Navigation logic, loading text.
- **Links:** [AuthCallbackPage](src/pages/authCallbackPage/AuthCallbackPage.tsx)

---

## Hooks

#### useTMDBAuth

- **Path:** `src/hooks/`
- **Files:**
  - `useTMDBAuth.ts`
  - `useTMDBAuth.test.tsx`
- **Exports:** `login()`, `finalizeLogin(token: string)`, `logout()`
- **Purpose:** Handles TMDB login flow, session creation, and saves session in Redux & localStorage.
- **Notes:** Works with hash routing (`/#/auth/callback`)
- **Links:** [`useTMDBAuth`](src/hooks/useTMDBAuth.ts)

#### useWatchlistToggle

- **Path:** `src/hooks/`
- **Files:**
  - `useWatchlistToggle.ts`
  - `useWatchlistToggle.test.tsx`
- **Exports:**
  - `useWatchlistToggle()`
- **Purpose:** Add or remove a movie from watchlist.
- **Notes:** Works only when user authenticated
- **Links:** [useWatchlistToggle.ts](src/hooks/useWatchlistToggle.ts)
- **Parameters:**
  - `movie: Movie` – Movie to add/remove from watchlist

### Possible Improvements

- Add **E2E tests** (Cypress) in CI before deployment

- Enhanced **filtering** and search for movies

- Add **Versioning** or **Changelog generation** during deployment

- Add **SSR support** (currently client-side only)
