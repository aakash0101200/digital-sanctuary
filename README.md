# Digital Sanctuary

A personal digital-wellness platform designed to help users build healthier relationships with their devices and practice mindful technology use. This repository contains the web frontend and supporting configuration used during development and deployment.

> NOTE: This project began as a personal learning and passion project. It is not a commercial product. The code, configuration, and supporting files are provided to help others explore and contribute.


Table of contents
- [Demo](#demo)
- [Key features](#key-features)
- [Tech stack](#tech-stack)
- [Repository layout](#repository-layout)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local development](#local-development)
  - [Build and preview](#build-and-preview)
  - [Deploy](#deploy)
- [Configuration](#configuration)
- [Security and privacy](#security-and-privacy)
- [Testing and quality](#testing-and-quality)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)


Demo
----
Add a link to a live demo or a short GIF/video here if available.


Key features
----
- Habit and screen-time tracking with simple visualizations and progress indicators
- Guided mindfulness sessions and timers
- Progress visualization with streaks and history
- Privacy-first design: minimal data collection and Firestore security rules
- Development scaffolding for an iOS module (Swift) and automation helpers


Tech stack
----
- JavaScript (React + Vite)
- Tailwind CSS for styling
- Firebase (Firestore, Hosting) for data and deployment
- Dev tooling: Vite, ESLint, PostCSS, Tailwind
- Small Swift helpers present in repository agent scripts for iOS Xcode setup


Repository layout
----
- /src — application source (React components, pages, styles)
- /public — static assets
- firebase-config.json — example Firebase project configuration (DO NOT commit secrets)
- firestore.rules — Firestore security rules used during development
- package.json — project metadata and scripts
- README-cloudshell.txt — Cloud Shell template (not project README)


Getting started
----
Prerequisites
- Node.js (18+) and npm or a compatible package manager
- Firebase CLI (optional, for deploy): install with `npm i -g firebase-tools`
- A Firebase project if you plan to run the backend services locally or deploy

Local development
1. Clone the repository
   git clone https://github.com/aakash0101200/digital-sanctuary.git
2. Install dependencies
   npm install
3. Run the development server
   npm run dev
4. Open http://localhost:5173 (or the URL printed by Vite)

Build and preview
- Build for production: `npm run build`
- Preview the production build locally: `npm run preview`

Deploy
- Configure Firebase and set your project ID in the Firebase CLI with `firebase login` and `firebase use --add`
- Deploy hosting (and other Firebase resources): `firebase deploy`


Configuration
----
- See `firebase-config.json` for an example configuration. Do not commit actual API keys or secrets — replace values with your own Firebase project settings before deploying.
- Firestore rules are included in `firestore.rules`. Review and adapt them before using in production.


Security and privacy
----
This project follows a privacy-first approach: only the minimum necessary data is stored in Firestore. Review `firestore.rules` to understand access controls. If you plan to reuse the code, audit configuration and remove any hard-coded or accidental secrets.


Testing and quality
----
- ESLint is configured and can be run with `npm run lint`.
- Consider adding unit and integration tests (Jest / React Testing Library) for production readiness.


Contributing
----
Contributions are welcome. To contribute:
1. Fork the repository
2. Create a feature branch
3. Open a pull request with a clear description of your changes

If you prefer issues, open one describing the feature or bug and label it accordingly.


License
----
This repository does not include a license by default. If you want others to reuse the code, consider adding an OSI-approved license such as MIT.


Contact
----
Project maintained by aakash0101200. Open an issue or PR on GitHub for questions or feedback.
