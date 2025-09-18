# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated testing, building, and deployment of the Full-Stack Coding Challenges project.

## Workflows

### 1. CI/CD Pipeline (`ci.yml`)
- **Triggers**: Push to main/develop branches, Pull Requests
- **Jobs**:
  - Backend Tests: Runs unit tests and linting for backend
  - Frontend Tests: Runs unit tests and linting for frontend  
  - Build and Integration Test: Builds all projects and runs integration tests
  - Security Scan: Runs vulnerability scanning (main branch only)

### 2. Backend Tests (`backend-test.yml`)
- **Triggers**: Changes to backend code or workflow file
- **Features**:
  - Tests on Node.js 18.x and 20.x
  - Runs ESLint for code quality
  - Generates test coverage reports
  - Uploads coverage to Codecov

### 3. Frontend Tests (`frontend-test.yml`)
- **Triggers**: Changes to frontend code or workflow file
- **Features**:
  - Tests on Node.js 18.x and 20.x
  - Runs ESLint for code quality
  - Generates test coverage reports
  - Uploads coverage to Codecov

### 4. Integration Tests (`integration-test.yml`)
- **Triggers**: Any push or pull request
- **Features**:
  - Full project build and test
  - Runs all tests across backend and frontend
  - Comprehensive linting check

### 5. Code Quality (`code-quality.yml`)
- **Triggers**: Push to main/develop branches, Pull Requests
- **Features**:
  - ESLint validation
  - TypeScript compilation check
  - Security vulnerability audit

## Available Scripts

### Root Level
- `npm run test` - Run all tests
- `npm run test:coverage` - Run all tests with coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run linting for all projects
- `npm run lint:fix` - Fix linting issues automatically
- `npm run ci` - Full CI pipeline (install, build, test, lint)

### Backend
- `npm run test` - Run backend tests
- `npm run test:coverage` - Run backend tests with coverage
- `npm run test:watch` - Run backend tests in watch mode
- `npm run lint` - Run backend linting
- `npm run lint:fix` - Fix backend linting issues

### Frontend
- `npm run test` - Run frontend tests
- `npm run test:coverage` - Run frontend tests with coverage
- `npm run test:ui` - Run frontend tests with UI
- `npm run lint` - Run frontend linting
- `npm run lint:fix` - Fix frontend linting issues

## Setup

1. **Enable GitHub Actions**: Workflows will automatically run when you push code or create pull requests.

2. **Configure Secrets** (if needed):
   - Go to repository Settings > Secrets and variables > Actions
   - Add any required secrets for your deployment

3. **Codecov Integration** (optional):
   - Sign up at [codecov.io](https://codecov.io)
   - Connect your GitHub repository
   - Coverage reports will be automatically uploaded

4. **Dependabot** (optional):
   - Dependabot is configured to automatically create pull requests for dependency updates
   - Review and merge updates as needed

## Monitoring

- View workflow runs in the "Actions" tab of your GitHub repository
- Check test results, coverage reports, and build status
- Review security scan results in the "Security" tab

## Troubleshooting

### Common Issues

1. **Tests failing**: Check the Actions logs for specific error messages
2. **Linting errors**: Run `npm run lint:fix` locally to fix issues
3. **Build failures**: Ensure all dependencies are properly installed
4. **Coverage upload fails**: Verify Codecov integration is set up correctly

### Local Testing

Before pushing, you can run the same checks locally:

```bash
# Run full CI pipeline
npm run ci

# Or run individual checks
npm run test
npm run lint
npm run build
```

## Contributing

When contributing to this project:

1. Create a feature branch from `develop`
2. Make your changes
3. Run tests locally: `npm run ci`
4. Push your changes
5. Create a pull request
6. GitHub Actions will automatically run tests and checks
7. Address any failing checks before merging
