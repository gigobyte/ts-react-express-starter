# TS React + Express Starter

Starter app for a full-stack TypeScript application with auth

## Shared

- [x] Type checking (TypeScript)
- [x] Autoformatting (Prettier)
- [x] Linting (Eslint)
- [x] Dependencies kept up-to-date (Renovate)
- [x] FP best practices (Purify)

## Front End

- [x] Rendering (React)
- [x] Client-side routing (React-router)
- [x] Bundling (Webpack)
- [x] Transpilation with progressive polyfilling (Babel)
- [x] E2E Testing (Cypress)
- [x] Styling (Tailwind, PostCSS, Autoprefixer, modern-modernize)
- [ ] i18n - Languages + units + dates, Keyboard navigation, Screen readers (???)
- [ ] PWA with Offline available (???)
- [ ] Dark mode (???)

## Back End

- [x] Serving (Express)
- [x] Persistent Storage (PostgreSQL)
- [x] Logging (Winston)
- [ ] Auth - Sessions, SSO, Password recovery (???)
- [ ] Security - HSTS, CSRF, CSP (???)

### How to setup

1. Create `Secrets.ts` file in `/server/infrastructure` by example
2. Change the DB name in `/server/infrastructure/DB.ts`
3. Change the issuer in `/server/infrastrcuture/JWT.ts`
4. Rename `name` in both package.json files
