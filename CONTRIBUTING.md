# Contributing to Commands.app

Thank you for your interest in contributing to Commands.app! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Adding Commands](#adding-commands)
- [Adding New Technologies](#adding-new-technologies)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### 1. Add New Commands

The most common contribution is adding new commands to existing technologies. Each technology has its own file in `data/commands/` (for example `data/commands/docker.json`).

### 2. Improve Documentation

- Fix typos or grammatical errors
- Improve command descriptions
- Add better examples
- Add helpful notes or tips

### 3. Add New Technologies

Suggest or implement support for new CLI tools and frameworks.

### 4. Report Bugs

Found a bug? [Open an issue](https://github.com/sanampatel/commands.app/issues/new?template=bug-report.md) with details about the problem.

### 5. Suggest Features

Have an idea? [Open a feature request](https://github.com/sanampatel/commands.app/issues/new?template=feature-request.md) to discuss it.

### 6. Improve UI/UX

Contributions to improve the user interface and experience are always welcome.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A GitHub account

### Setup Development Environment

1. **Fork the repository**

   Click the "Fork" button at the top right of the repository page.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR-USERNAME/commandsapp.git
   cd commandsapp
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/sanampatel/commands.app.git
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Adding Commands

### Command Structure

Each technology has its own file in `data/commands/` (for example `data/commands/docker.json`). Each command follows this structure:

```json
{
  "id": "unique-command-id",
  "name": "command name",
  "description": "Brief description of what the command does",
  "category": "Category Name",
  "technologyId": "technology-id",
  "flags": [
    {
      "flag": "-f, --flag",
      "description": "Description of the flag"
    }
  ],
  "examples": [
    {
      "command": "example command",
      "description": "What this example demonstrates"
    }
  ],
  "notes": [
    "Additional helpful information",
    "Tips or warnings"
  ],
  "relatedCommands": ["related-command-id"]
}
```

### Field Descriptions

- **id** (required): Unique identifier using kebab-case (e.g., `git-commit`, `docker-run`)
- **name** (required): The actual command as typed in terminal
- **description** (required): Clear, concise description of what the command does
- **category** (required): Logical grouping (e.g., "File Management", "Container Management")
- **technologyId** (required): Must match an existing technology ID
- **flags** (optional): Array of command flags/options
- **examples** (required): At least one practical example
- **notes** (optional): Additional information, tips, or warnings
- **relatedCommands** (optional): Array of related command IDs
- **status** (optional): `"legacy"` (superseded by a newer tool or version), `"deprecated"` (deprecated or removed in current versions) or `"preview"` (experimental/beta). Shown as a badge; explain the details in `notes`.

### Step-by-Step: Adding a Command

1. **Create a new branch**

   ```bash
   git checkout -b add-docker-network-command
   ```

2. **Open the technology's file**, e.g. `data/commands/docker.json`

3. **Find the correct location**

   - Keep commands grouped by category, most common first
   - Use a globally unique, kebab-case `id` prefixed with the technology (e.g. `docker-network-create`) — it becomes the page URL, so never rename existing ids
   - Only reference ids from the same file in `relatedCommands`
   - Start destructive-command notes with `WARNING:` so they're highlighted on the page

4. **Add your command**

   ```json
   {
     "id": "docker-network-create",
     "name": "docker network create",
     "description": "Create a new Docker network",
     "category": "Network Management",
     "technologyId": "docker",
     "flags": [
       {
         "flag": "--driver",
         "description": "Driver to manage the network (default: bridge)"
       },
       {
         "flag": "--subnet",
         "description": "Subnet in CIDR format"
       }
     ],
     "examples": [
       {
         "command": "docker network create my-network",
         "description": "Create a basic bridge network"
       },
       {
         "command": "docker network create --driver bridge --subnet 192.168.0.0/16 my-network",
         "description": "Create network with custom subnet"
       }
     ],
     "notes": [
       "Default driver is bridge",
       "Use --driver overlay for swarm mode"
     ],
     "relatedCommands": ["docker-network-ls", "docker-network-rm"]
   }
   ```

5. **Validate the data**

   ```bash
   npm run validate
   ```

   This checks JSON syntax, required fields, unique ids and that every related command exists. CI runs it on every pull request, and the build fails if it doesn't pass.

6. **Test locally**

   ```bash
   npm run dev
   ```

   Navigate to the technology page and verify your command appears correctly.

7. **Commit your changes**

   ```bash
   git add data/commands/docker.json
   git commit -m "Add docker network create command"
   ```

## Adding New Technologies

### Technology Structure

Technologies are defined in `data/technologies.json`:

```json
{
  "id": "technology-id",
  "name": "Display Name",
  "description": "Brief description of the technology",
  "icon": "🎯",
  "color": "#HEX_COLOR",
  "group": "DevOps & Cloud"
}
```

`group` controls where it appears on the homepage: one of `Shell & System`, `Version Control`, `Languages & Runtimes`, `Package Managers`, `Frameworks`, `Databases`, `DevOps & Cloud`.

### Steps to Add a Technology

1. **Add to `data/technologies.json`**

2. **Create `data/commands/<technology-id>.json`** with at least 10-15 essential commands.

3. **Register it** in `data/index.ts` (import the JSON and add it to `commandFiles`). Then add its logo in `components/tech-icon.tsx`: map it to a [tech-stack-icons](https://www.tech-stack-icons.com) name (preferred), or, if it isn't available there, save an SVG as `public/icons/<technology-id>.svg` (for example from [Devicon](https://devicon.dev) / [techicons.dev](https://techicons.dev), checking the license) and add it to `localIcons`. Check it in both light and dark mode; use `monochrome: true` for dark-on-transparent logos, or provide `<id>-dark.svg` with `darkVariant: true`. The emoji in `technologies.json` is only a last-resort fallback. Navigation, search, the sitemap and the homepage pick the technology up automatically.

4. **Create issue first**

   For new technologies, please [create an issue](https://github.com/sanampatel/commands.app/issues/new) first to discuss before implementing.

## Submitting Changes

### Before Submitting

- [ ] Test your changes locally
- [ ] `npm run validate` passes
- [ ] `npm run lint` passes
- [ ] Verify no typos in descriptions
- [ ] Check that examples work correctly
- [ ] Ensure your code follows the existing style

### Creating a Pull Request

1. **Push your branch**

   ```bash
   git push origin your-branch-name
   ```

2. **Open a Pull Request**

   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

3. **PR Description Should Include**

   - What changes you made
   - Why you made them
   - Any relevant issue numbers (e.g., "Closes #123")
   - Screenshots if UI changes

### PR Review Process

- Maintainers will review your PR
- You may be asked to make changes
- Once approved, your PR will be merged
- Your contribution will be credited

## Style Guidelines

### Writing Style

- **Be concise**: Keep descriptions brief but informative
- **Be clear**: Write for developers of all skill levels
- **Be accurate**: Test all commands and examples
- **Use active voice**: "Creates a file" not "A file is created"
- **Avoid jargon**: Explain technical terms when necessary

### Command Descriptions

✅ **Good**: "Create a new Git branch and switch to it"

❌ **Bad**: "This command is used for the creation of branches"

### Examples

- Provide realistic, practical examples
- Include common use cases
- Add comments when helpful
- Show expected output when relevant

### Categories

Use consistent, clear categories based on context:

**For Core Framework Commands:**
- File Management
- Container Management
- Version Control
- Package Management
- Database
- Configuration
- Development
- Code Generation
- Testing
- Deployment

**For Laravel Official Packages:**
Use the package name as the category:
- Horizon (queue management)
- Telescope (debugging)
- Pulse (monitoring)
- Scout (search)
- Passport (OAuth2)
- Sanctum (API authentication)
- Breeze (auth scaffolding)
- Sail (Docker environment)
- Socialite (social authentication)

This keeps related commands grouped by their package, making it easier for users to find package-specific commands.

## Community

### Getting Help

- 💬 [GitHub Discussions](https://github.com/sanampatel/commands.app/discussions) - Ask questions and share ideas
- 🐛 [Issues](https://github.com/sanampatel/commands.app/issues) - Report bugs or request features
- 📧 Contact maintainers through GitHub

### Recognition

Contributors are recognized in several ways:
- Listed in README.md
- Mentioned in release notes
- GitHub contributor badge

## Questions?

Don't hesitate to ask! Open an issue or discussion if you need help or clarification.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to Commands.app! 🎉
