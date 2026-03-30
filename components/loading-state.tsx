export function LoadingState() {
  return (
    <div className="mt-16 flex flex-col items-center justify-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-border rounded-full"></div>
        <div
          className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"
        ></div>
      </div>
      <p className="text-lg text-muted-foreground text-center">
        🔍 Analyzing website security...
      </p>
      <p className="text-sm text-muted-foreground">This might take a moment</p>
    </div>
  );
}
