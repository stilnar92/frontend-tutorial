# React + Vite + Tailwind + FSD Project Setup Guide

This guide will help you set up a React project using Vite, Tailwind CSS, Class Variance Authority (CVA), and Feature-Sliced Design (FSD) architecture.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Step 1: Project Creation

```bash
# Create a new Vite project with React template
npm create vite@latest your-project-name -- --template react

# Navigate to project directory
cd your-project-name

# Install dependencies
npm install
```

## Step 2: Install Additional Dependencies

```bash
# Install Tailwind CSS and its dependencies
npm install -D tailwindcss postcss autoprefixer

# Install Class Variance Authority
npm install class-variance-authority

# Install ESLint and Prettier
npm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
```

## Step 3: Configure Tailwind CSS

```bash
# Initialize Tailwind CSS
npx tailwindcss init -p
```

Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Create `src/app/styles/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Step 4: Configure ESLint and Prettier

Create `.eslintrc.cjs`:
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'prettier/prettier': 'error',
    'react/prop-types': 'off',
  },
}
```

Create `.prettierrc`:
```json
{
  "semi": false,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "es5",
  "jsxSingleQuote": true,
  "bracketSpacing": true
}
```

## Step 5: Set Up FSD Structure

Create the following directory structure:
```
src/
├── app/          # Application initialization
│   └── styles/   # Global styles
├── pages/        # Pages/Screens
├── widgets/      # Independent page blocks
├── features/     # Business features
├── entities/     # Business entities
└── shared/       # Reusable components
    ├── api/      # API integration
    ├── lib/      # Utilities and helpers
    └── ui/       # UI components
```

## Step 6: Configure Path Aliases

Update `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
      '@features': path.resolve(__dirname, './src/features'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
})
```

Create `jsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@app/*": ["src/app/*"],
      "@pages/*": ["src/pages/*"],
      "@widgets/*": ["src/widgets/*"],
      "@features/*": ["src/features/*"],
      "@entities/*": ["src/entities/*"],
      "@shared/*": ["src/shared/*"]
    }
  }
}
```

## Step 7: Update Package Scripts

Update `package.json` scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "format": "prettier --write \"src/**/*.{js,jsx}\"",
    "lint:fix": "eslint . --ext js,jsx --fix"
  }
}
```

## Step 8: Usage Example

Create a button component with CVA (`src/shared/ui/Button/Button.jsx`):
```javascript
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

const Button = ({ className, variant, size, ...props }) => {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
}

export default Button
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## Project Structure

```
├── src/
│   ├── app/          # Application initialization
│   │   └── styles/   # Global styles
│   ├── pages/        # Pages/Screens
│   ├── widgets/      # Independent page blocks
│   ├── features/     # Business features
│   ├── entities/     # Business entities
│   └── shared/       # Reusable components
│       ├── api/      # API integration
│       ├── lib/      # Utilities and helpers
│       └── ui/       # UI components
├── .eslintrc.cjs     # ESLint configuration
├── .prettierrc       # Prettier configuration
├── jsconfig.json     # JavaScript configuration
├── package.json      # Project dependencies
├── tailwind.config.js # Tailwind CSS configuration
└── vite.config.js    # Vite configuration
