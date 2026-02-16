# Contributing to The Garage

Thanks for your interest in contributing! Here's how to get started.

## Development Workflow

1. **Fork and clone the repository**
2. **Set up your environment** (see [START.md](./START.md))
3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes**
5. **Run tests**
   ```bash
   npm test
   ```
6. **Build to verify**
   ```bash
   npm run build
   ```
7. **Commit your changes**
   ```bash
   git commit -m "Add feature: description"
   ```
8. **Push and create a Pull Request**

## Code Standards

- **TypeScript** - All code must be TypeScript
- **Tests** - Add tests for new features
- **Formatting** - Code is checked by TypeScript compiler
- **Security** - Never commit secrets or API keys

## Testing

All changes must pass tests:

```bash
# Run tests
npm test

# Watch mode for development
npm run test:watch
```

### Writing Tests

- Place test files next to the component: `Component.test.tsx`
- Use descriptive test names
- Test user interactions, not implementation details

Example:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

## Security Rules

Before committing:

- ✅ Run `npm test` - tests must pass
- ✅ Run `npm run build` - build must succeed
- ✅ Check `git status` - ensure no `.env` file staged
- ✅ No hardcoded API keys or secrets
- ✅ Review your changes: `git diff`

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update README.md if you add features
5. Request review from maintainers

## Deployment

Merging to `main` automatically deploys to production via Cloudflare Pages.

**Before merging:**
- All tests must pass
- Build must succeed
- No breaking changes without discussion

## Questions?

Open an issue or discussion on GitHub!
