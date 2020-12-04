# TS React + Express Starter

Starter app for a full-stack TypeScript application with auth

## Shared

- [x] Type checking (TypeScript)
- [x] Autoformatting (Prettier)
- [x] Linting (Eslint)
- [x] Dependencies kept up-to-date (Renovate)
- [x] FP best practices (Purify)

## Front End

- [ ] Rendering (React)
- [ ] Bundling (Webpack)
- [ ] Transpilation with progressive polyfilling (Babel)
- [ ] E2E Testing (Cypress)
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
2. Update the DB name in `/server/infrastructure/DB.ts`
3. Rename `name` in both package.json files
