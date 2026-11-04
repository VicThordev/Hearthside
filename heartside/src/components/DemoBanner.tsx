export function DemoBanner() {
  return <div role="status" className="bg-amber-100 px-4 py-2 text-center text-xs font-semibold text-amber-950 border-b border-amber-200">
    <span className="sm:hidden">Preview: all care information is fictional. Do not enter real data.</span>
    <span className="hidden sm:inline">Preview environment — all displayed care information is fictional. Do not enter real health, insurance, legal, or access information.</span>
  </div>;
}
