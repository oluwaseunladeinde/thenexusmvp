# Unit Testing Feature -- Implementation TODO (AI-Agent Ready)

## 1. Project Setup

-   [ ] Install Vitest

    ``` bash
    npm install -D vitest
    ```

-   [ ] Install React Testing Library & DOM matchers

    ``` bash
    npm install -D @testing-library/react @testing-library/jest-dom jsdom
    ```

-   [ ] Create `vitest.config.ts` (jsdom, aliases, coverage)

-   [ ] Create `tests/test-setup.ts` (jest-dom + MSW setup)

## 2. Directory Structure

    /app
    /lib
    /tests
      /mocks
      /utils

-   [ ] Co-locate test files with code using `*.test.ts(x)`.

## 3. Component Testing Setup

-   [ ] Configure jsdom in Vitest.
-   [ ] Add RTL setup in `test-setup.ts`.
-   [ ] Mock `next/navigation`.

## 4. Example Component Tests

-   [ ] Add sample page test.

## 5. Server Actions Testing

-   [ ] Extract logic to `/lib/services`.
-   [ ] Test actions as async functions.

## 6. API Route Testing

-   [ ] Install Supertest.
-   [ ] Build route handler test harness.
-   [ ] Write example route tests.

## 7. External Service Mocking (MSW)

-   [ ] Install MSW.
-   [ ] Create `/tests/mocks/server.ts`.
-   [ ] Configure lifecycle hooks.

## 8. Database Testing (Testcontainers)

-   [ ] Install Testcontainers.
-   [ ] Start ephemeral DB in test setup.
-   [ ] Run migrations.
-   [ ] Add DB-level tests.

## 9. Auth Mocking

-   [ ] Mock NextAuth session.

## 10. Test Coverage

-   [ ] Enable coverage in Vitest config.
-   [ ] Add min coverage rules.

## 11. CI Integration

-   [ ] Create GitHub Actions workflow.

## 12. E2E (Optional)

-   [ ] Install Playwright.
-   [ ] Add key SaaS flow tests.

## 13. Create /docs/testing.md

-   [ ] Document testing approach.

## 14. Final Validation

-   [ ] All tests pass locally.
-   [ ] CI green.
-   [ ] External services mocked.
