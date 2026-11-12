import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitFork, MessageSquare, AlertCircle, Code, BookOpen, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Contributing",
  description: "Help improve Commands.app: add commands, add technologies, fix mistakes and improve the UI.",
  alternates: { canonical: "/contributing" },
};

export default function ContributingPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Contributing to Commands.app</h1>
          <p className="text-xl text-muted-foreground">
            Help us build the best command-line reference for developers
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-3">
          <a
            href="https://github.com/sanampatel/commands.app/issues/new?template=add-command.md"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="transition-all hover:shadow-md hover:border-primary cursor-pointer h-full">
              <CardHeader>
                <Code className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Add Command</CardTitle>
                <CardDescription>
                  Submit a new command to the database
                </CardDescription>
              </CardHeader>
            </Card>
          </a>

          <a
            href="https://github.com/sanampatel/commands.app/issues/new?template=bug-report.md"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="transition-all hover:shadow-md hover:border-primary cursor-pointer h-full">
              <CardHeader>
                <AlertCircle className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Report Issue</CardTitle>
                <CardDescription>
                  Found a bug or incorrect information?
                </CardDescription>
              </CardHeader>
            </Card>
          </a>

          <a
            href="https://github.com/sanampatel/commands.app/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="transition-all hover:shadow-md hover:border-primary cursor-pointer h-full">
              <CardHeader>
                <MessageSquare className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Discussions</CardTitle>
                <CardDescription>
                  Share ideas and ask questions
                </CardDescription>
              </CardHeader>
            </Card>
          </a>
        </div>

        {/* Ways to Contribute */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Ways to Contribute
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Badge variant="secondary">1</Badge>
                Add New Commands
              </h3>
              <p className="text-sm text-muted-foreground ml-8">
                Know a command that&apos;s missing? Add it to our database by editing{" "}
                <code className="px-1.5 py-0.5 bg-muted rounded text-xs">data/commands/&lt;technology&gt;.json</code>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Badge variant="secondary">2</Badge>
                Improve Documentation
              </h3>
              <p className="text-sm text-muted-foreground ml-8">
                Fix typos, improve descriptions, or add better examples to existing commands
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Badge variant="secondary">3</Badge>
                Add New Technologies
              </h3>
              <p className="text-sm text-muted-foreground ml-8">
                Suggest or add support for new CLI tools and frameworks
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Badge variant="secondary">4</Badge>
                Improve UI/UX
              </h3>
              <p className="text-sm text-muted-foreground ml-8">
                Enhance the user interface, add new features, or fix bugs
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Badge variant="secondary">5</Badge>
                Report Issues
              </h3>
              <p className="text-sm text-muted-foreground ml-8">
                Found incorrect information or a bug? Let us know!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Start Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitFork className="h-5 w-5" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>
              Follow these steps to contribute to Commands.app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Fork the Repository</h4>
                  <p className="text-sm text-muted-foreground">
                    Click the &ldquo;Fork&rdquo; button on our GitHub repository
                  </p>
                  <code className="block mt-2 px-3 py-2 bg-muted rounded text-xs">
                    https://github.com/sanampatel/commands.app
                  </code>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Clone Your Fork</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Clone the repository to your local machine
                  </p>
                  <code className="block px-3 py-2 bg-muted rounded text-xs">
                    git clone https://github.com/YOUR-USERNAME/commands.app.git
                    <br />
                    cd commands.app
                  </code>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Create a Branch</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Create a new branch for your changes
                  </p>
                  <code className="block px-3 py-2 bg-muted rounded text-xs">
                    git checkout -b add-new-command
                  </code>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Make Your Changes</h4>
                  <p className="text-sm text-muted-foreground">
                    Edit the technology&apos;s file in <code className="px-1.5 py-0.5 bg-muted rounded">data/commands/&lt;technology&gt;.json</code>.
                    See the{" "}
                    <a
                      href="https://github.com/sanampatel/commands.app/blob/main/CONTRIBUTING.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      detailed guide
                    </a>{" "}
                    for the data structure.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  5
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Test Your Changes</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Run the development server and verify your changes
                  </p>
                  <code className="block px-3 py-2 bg-muted rounded text-xs">
                    npm install
                    <br />
                    npm run validate
                    <br />
                    npm run dev
                  </code>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  6
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Commit and Push</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Commit your changes with a clear message
                  </p>
                  <code className="block px-3 py-2 bg-muted rounded text-xs">
                    git add .
                    <br />
                    {`git commit -m "Add docker compose commands"`}
                    <br />
                    git push origin add-new-command
                  </code>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  7
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Create Pull Request</h4>
                  <p className="text-sm text-muted-foreground">
                    Go to your fork on GitHub and click &ldquo;New Pull Request&rdquo;. Provide a clear
                    description of your changes.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Command Structure Example */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Adding a Command
            </CardTitle>
            <CardDescription>
              Each technology has its own file in data/commands/ (e.g. data/commands/docker.json). Here&apos;s the structure:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
{`{
  "id": "docker-compose-up",
  "name": "docker compose up",
  "description": "Build and start containers defined in compose file",
  "category": "Container Management",
  "technologyId": "docker",
  "flags": [
    {
      "flag": "-d",
      "description": "Run in detached mode"
    }
  ],
  "examples": [
    {
      "command": "docker compose up -d",
      "description": "Start containers in background"
    }
  ],
  "notes": [
    "Reads docker-compose.yml by default"
  ],
  "relatedCommands": ["docker-compose-down"]
}`}
            </pre>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Contribution Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <p>
                <strong>Be accurate:</strong> Ensure all commands, flags, and examples are correct
                and tested
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <p>
                <strong>Be clear:</strong> Write descriptions that are easy to understand for
                developers of all levels
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <p>
                <strong>Be concise:</strong> Keep descriptions brief but informative
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <p>
                <strong>Follow conventions:</strong> Match the style and format of existing commands
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <p>
                <strong>One change per PR:</strong> Keep pull requests focused on a single feature
                or fix
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="https://github.com/sanampatel/commands.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              GitHub Repository →
            </a>
            <a
              href="https://github.com/sanampatel/commands.app/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              Detailed Contributing Guide →
            </a>
            <a
              href="https://github.com/sanampatel/commands.app/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              Issues & Bug Reports →
            </a>
            <a
              href="https://github.com/sanampatel/commands.app/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              Community Discussions →
            </a>
          </CardContent>
        </Card>

        {/* Thank You */}
        <div className="text-center py-8 space-y-2">
          <h2 className="text-2xl font-bold">Thank You! 🎉</h2>
          <p className="text-muted-foreground">
            Your contributions help developers around the world. We appreciate your time and effort!
          </p>
        </div>
      </div>
    </div>
  );
}
