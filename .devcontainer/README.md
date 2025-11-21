# Dev Container Configuration

This project uses a dev container for consistent development environment setup.

## What's Included

- Node.js 20 (LTS)
- TypeScript support
- Git and GitHub CLI
- VS Code extensions:
  - ESLint
  - Prettier
  - TypeScript
  - Tailwind CSS

## Usage

1. Open the project in VS Code
2. When prompted, click "Reopen in Container" or use the Command Palette (Cmd/Ctrl+Shift+P) and select "Dev Containers: Reopen in Container"
3. The container will build and install dependencies automatically

## Customization

Edit `.devcontainer/devcontainer.json` to customize:
- Node.js version
- Installed extensions
- Post-create commands
- Port forwarding

