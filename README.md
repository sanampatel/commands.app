# Commands.app 🚀

A modern, comprehensive command-line reference for developers. Search, explore, and master CLI commands across multiple technologies.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js-000000?logo=next.js)](https://nextjs.org/)

## ✨ Features

- 📚 **850+ Commands** across 28 technologies, with flags, real-world examples and gotchas
- 🔎 **Global Command Palette** - press `⌘K` / `Ctrl+K` (or `/`) anywhere to search every command
- 🔍 **Fuzzy Search** per technology, with category filters and shareable `?q=` / `?category=` URLs
- ⚖️ **Command Comparison** - compare up to 3 commands side by side, with shareable links
- ⭐ **Favorites** - star commands and find them all on the Favorites page (synced across tabs)
- 📄 **Export** - copy as Markdown, download Markdown, or print / save as PDF
- ⚠️ **Highlighted warnings** for destructive commands, plus deprecation notes for outdated ones
- ✏️ **Edit on GitHub** links on every page to make contributing easy
- 🌙 **Dark Mode**, 📱 responsive layout, ♿ keyboard and screen-reader friendly
- 🚀 **Fully static** - every page is pre-rendered with Next.js 16, plus sitemap, robots and Open Graph metadata
- 🧩 **Open data** - each technology's commands are served as JSON at `/data/<technology>`

## 🛠️ Technologies Covered

**Shell & System**

- **Linux** - Essential Linux command line tools and utilities (85 commands)
- **SSH** - Secure shell: remote login, keys, tunnels and file transfer (22 commands)
- **tmux** - Terminal multiplexer for sessions, windows and panes (21 commands)
- **Vim** - Modal text editor commands, motions and Ex commands (25 commands)

**Version Control**

- **Git** - Version control system commands (36 commands)
- **GitHub CLI** - Work with pull requests, issues, releases and Actions from the terminal with gh (34 commands)

**Languages & Runtimes**

- **Python** - Python and pip commands for Python development (20 commands)
- **Go** - Go toolchain commands for building, testing and managing modules (26 commands)
- **Rust & Cargo** - Cargo and rustup commands for building and managing Rust projects (26 commands)
- **Bun** - All-in-one JavaScript runtime, package manager, bundler and test runner (20 commands)

**Package Managers**

- **npm** - Node Package Manager commands for JavaScript development (26 commands)
- **Yarn** - Fast, reliable package manager for JavaScript (31 commands)
- **pnpm** - Fast, disk-efficient package manager for JavaScript and monorepos (27 commands)
- **uv** - Extremely fast Python package and project manager written in Rust (21 commands)
- **Composer** - Dependency manager for PHP projects (22 commands)
- **Homebrew** - The missing package manager for macOS and Linux (25 commands)

**Frameworks**

- **Laravel** - Laravel Artisan CLI commands for PHP development (83 commands)
- **Next.js** - Next.js CLI commands for React application development (15 commands)
- **Laravel Filament** - Filament Admin Panel commands for Laravel applications (21 commands)

**Databases**

- **PostgreSQL** - PostgreSQL database management commands and psql utilities (27 commands)
- **Redis** - Redis in-memory data store commands and redis-cli utilities (64 commands)
- **MySQL** - MySQL client, server administration and backup commands (31 commands)
- **MongoDB** - mongosh shell and MongoDB database tools (26 commands)

**DevOps & Cloud**

- **Docker** - Container management and orchestration commands (42 commands)
- **Kubernetes** - Kubernetes container orchestration and kubectl commands (43 commands)
- **Terraform** - Infrastructure as code: plan, apply and manage cloud resources (25 commands)
- **AWS CLI** - Amazon Web Services command line interface for S3, EC2, IAM, Lambda and more (28 commands)
- **Nginx** - Nginx web server and reverse proxy management commands (21 commands)

## 🚀 Getting Started

### Prerequisites

- Node.js 20.9 or higher (22 LTS recommended)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/sanampatel/commands.app.git
cd commandsapp
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
commandsapp/
├── app/
│   ├── [technology]/           # Technology list + [command] detail pages
│   ├── compare/                # Side-by-side comparison
│   ├── favorites/              # Starred commands
│   ├── data/[technology]/      # Static JSON API per technology
│   ├── search-index.json/      # Static search index for the command palette
│   ├── sitemap.ts, robots.ts   # SEO
│   └── page.tsx                # Homepage
├── components/                 # React components (ui/ = shadcn/ui)
├── data/
│   ├── technologies.json       # Technology definitions
│   ├── commands/<id>.json      # One file of commands per technology
│   └── index.ts                # Registry + lookup helpers
├── lib/                        # favorites, export, site config, helpers
├── scripts/validate-data.mjs   # Data validator (npm run validate)
└── types/index.ts              # TypeScript types
```

## 🤝 Contributing

We love contributions! Commands.app is a community-driven project, and we welcome contributions of all kinds.

### Ways to Contribute

- 🆕 **Add new commands** to existing technologies
- 📝 **Improve documentation** and fix typos
- 🎨 **Enhance UI/UX** and add new features
- 🐛 **Report bugs** and issues
- 💡 **Suggest new technologies** to add
- ⭐ **Star the repository** to show support

### Quick Start

1. Fork the repository
2. Create a branch: `git checkout -b add-new-command`
3. Edit `data/commands/<technology>.json`
4. Validate and test locally: `npm run validate && npm run dev`
5. Commit: `git commit -m "Add docker compose commands"`
6. Push: `git push origin add-new-command`
7. Open a Pull Request

### Command Structure

```json
{
  "id": "command-id",
  "name": "command name",
  "description": "What the command does",
  "category": "Category Name",
  "technologyId": "technology-id",
  "flags": [
    {
      "flag": "-f",
      "description": "Flag description"
    }
  ],
  "examples": [
    {
      "command": "example command",
      "description": "Example description"
    }
  ],
  "notes": ["Helpful tips"],
  "relatedCommands": ["related-command-id"]
}
```

For detailed guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

## 📋 Adding a New Technology

Want to add support for a new CLI tool? Here's how:

1. **Open an issue** to discuss the technology
2. **Add the technology** to `data/technologies.json`:

```json
{
  "id": "technology-id",
  "name": "Technology Name",
  "description": "Brief description",
  "icon": "🎯",
  "color": "#HEX_COLOR",
  "group": "DevOps & Cloud"
}
```

   `group` is one of: `Shell & System`, `Version Control`, `Languages & Runtimes`, `Package Managers`, `Frameworks`, `Databases`, `DevOps & Cloud`.

3. **Add commands** in `data/commands/technology-id.json` (minimum 10-15 essential commands). Command ids must be globally unique, so prefix them (e.g. `tf-plan`).
4. **Register the file** in `data/index.ts` and **add an icon** in `components/tech-icon.tsx`: map it to a [tech-stack-icons](https://www.tech-stack-icons.com) name, or if it isn't there, add an SVG to `public/icons/<id>.svg` (e.g. from [Devicon / techicons.dev](https://techicons.dev)) and list it in `localIcons`. The emoji in `technologies.json` is only a last-resort fallback
5. **Run `npm run validate`** - it checks schema, unique ids and that every related command exists
6. **Submit a PR** with your changes

## 🐛 Bug Reports

Found a bug? Please [open an issue](https://github.com/sanampatel/commands.app/issues/new?template=bug-report.md) with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 💡 Feature Requests

Have an idea? [Open a feature request](https://github.com/sanampatel/commands.app/issues/new?template=feature-request.md) and let's discuss it!

## 🧪 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/) for UI, [tech-stack-icons](https://www.tech-stack-icons.com) and [Devicon](https://devicon.dev) (MIT) for technology logos
- **Theme:** [next-themes](https://github.com/pacocoursey/next-themes)

## 📊 Project Stats

- **Total Commands:** 325+
- **Technologies:** 12
- **Contributors:** Growing!
- **License:** MIT

## 🌟 Roadmap

- [x] Add more technologies (PostgreSQL, Redis, Kubernetes)
- [x] Advanced search with fuzzy matching
- [x] Command comparison feature
- [x] Export commands as PDF/Markdown
- [ ] Multi-language support
- [ ] Community-contributed examples
- [ ] CLI tool for offline access
- [ ] VS Code extension

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- All [contributors](https://github.com/sanampatel/commands.app/graphs/contributors) who have helped build this project
- [Shadcn UI](https://ui.shadcn.com/) for the beautiful components
- [Vercel](https://vercel.com/) for hosting
- The open-source community for inspiration and support

## 📧 Contact

- **GitHub Issues:** [Report bugs or request features](https://github.com/sanampatel/commands.app/issues)
- **Discussions:** [Join the conversation](https://github.com/sanampatel/commands.app/discussions)
- **Website:** [https://commands.app](https://commands.app)

## 💖 Support

If you find Commands.app helpful:

- ⭐ Star the repository
- 🐛 Report bugs and issues
- 📝 Contribute commands
- 📢 Share with fellow developers

---

**Made with ❤️ by the community**

**Happy coding!** 🚀
