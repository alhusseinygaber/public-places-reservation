# Public Places Reservation

A modern, premium‑styled web application for discovering and booking public venues across Egypt. Features include:

- **Glass‑morphism UI** with dark/light theme toggle.
- Full **CRUD** for venues, bookings, and user profiles (backend with Prisma & SQLite).
- Secure **authentication** (JWT) and profile image upload.
- Responsive design for desktop and mobile.
- Integrated **payment flow** (placeholder).

## Project Structure
```
public-places-reservation/
├─ assets/            # images & icons
├─ backend/           # Node/Express API
│   ├─ prisma/        # Prisma schema & seed
│   └─ src/           # routes, middleware
├─ pages/             # HTML pages
├─ scripts/           # client‑side JS utilities
├─ styles/            # CSS (main + component files)
├─ .gitignore
├─ package.json
└─ README.md
```

## Getting Started
```bash
# Clone the repo (once created on GitHub)
git clone https://github.com/your‑username/public-places-reservation.git
cd public-places-reservation

# Install dependencies
npm install

# Set up the database (Prisma)
npx prisma migrate dev --name init
npx prisma db seed   # seeds venues with images

# Run the backend
npm run dev   # or `node backend/src/index.js`

# Open the frontend (static files) via any HTTP server, e.g.:
npx -y serve ./pages
```

## Deploying to GitHub
```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit – premium UI & backend"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/your‑username/public-places-reservation.git

# Push to GitHub (main branch)
git branch -M main
git push -u origin main
```

## Notes
- The `.gitignore` (added separately) excludes `node_modules/`, `.env`, `uploads/`, Prisma dev DB, and IDE files.
- Large image assets are kept in `assets/`; if you exceed GitHub's file size limits, consider using Git LFS.
- Remember to set environment variables (`DATABASE_URL`, JWT secret, etc.) in a `.env` file on the server.
```
