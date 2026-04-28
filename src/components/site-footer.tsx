// src/components/site-footer.tsx
export function SiteFooter() {
  return (
    <footer className="border-t mt-10 sm:mt-16 safe-bottom">
      <div className="container py-4 sm:py-6 text-xs sm:text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2">
        <p>RoofMate Catalog</p>
        <p className="text-[10px] sm:text-xs">All prices in INR.</p>
      </div>
    </footer>
  );
}
