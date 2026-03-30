export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-primary">🎯</div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">HackerBuddy</h1>
            <p className="text-sm text-muted-foreground">
              Your friendly ethical hacker assistant
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
