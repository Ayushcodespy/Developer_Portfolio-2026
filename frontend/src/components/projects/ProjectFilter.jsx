import { Search, X } from 'lucide-react'

export function ProjectFilter({
  categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'Development', label: 'Development' },
    { id: 'Data Analysis', label: 'Data Analysis' },
  ],
  activeCategory = 'all',
  onCategoryChange,
  searchQuery = '',
  onSearchChange,
  availableTechnologies = [],
  activeTech = null,
  onTechChange,
}) {
  return (
    <div className="space-y-4 pt-2">
      {/* Primary Category Selector & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Prominent Two-Career Segmented Category Selector */}
        <div
          className="inline-flex flex-wrap items-center p-1 bg-slate-100 dark:bg-[#14191D] rounded-xl border border-[#D9E2EA] dark:border-[#26333A] shadow-xs"
          role="tablist"
          aria-label="Filter projects by career track"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id
            const isDataAnalysis = cat.id === 'Data Analysis'

            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007BA7] cursor-pointer ${
                  isActive
                    ? isDataAnalysis
                      ? 'bg-[#FF2D95] text-white shadow-md shadow-[#FF2D95]/25 font-bold'
                      : 'bg-[#007BA7] text-white shadow-md shadow-[#007BA7]/25 font-bold'
                    : 'text-[#475569] dark:text-[#B8C2CC] hover:text-[#17212B] dark:hover:text-[#F5F7FA] hover:bg-slate-200/60 dark:hover:bg-[#181818]'
                }`}
                onClick={() => onCategoryChange(cat.id)}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Search Input Bar */}
        {typeof onSearchChange === 'function' && (
          <div className="relative w-full md:w-72 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748B] dark:text-[#8B98A5]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#14191D] border border-[#D9E2EA] dark:border-[#26333A] text-[#17212B] dark:text-[#F5F7FA] placeholder-[#64748B] dark:placeholder-[#8B98A5] focus:outline-none focus:border-[#007BA7] focus:ring-2 focus:ring-[#007BA7]/20 shadow-xs transition-all"
              aria-label="Search projects by title, description or technology"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#64748B] hover:text-[#17212B] dark:text-[#8B98A5] dark:hover:text-white transition-colors"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Secondary Technology Pills (Beneath Main Category Selector) */}
      {availableTechnologies.length > 0 && typeof onTechChange === 'function' && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1" aria-label="Filter by technology">
          <span className="text-[11px] font-medium text-[#64748B] dark:text-[#8B98A5] mr-1">
            Tech tags:
          </span>
          <button
            type="button"
            onClick={() => onTechChange(null)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all cursor-pointer ${
              !activeTech
                ? 'bg-[#007BA7]/15 text-[#007BA7] dark:text-[#38BDF8] border border-[#007BA7]/40 font-semibold'
                : 'bg-white dark:bg-[#14191D] text-[#64748B] dark:text-[#8B98A5] border border-[#D9E2EA] dark:border-[#26333A] hover:border-[#007BA7]/40'
            }`}
          >
            All
          </button>
          {availableTechnologies.map((tech) => {
            const isSelected = activeTech === tech
            return (
              <button
                key={tech}
                type="button"
                onClick={() => onTechChange(isSelected ? null : tech)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-full transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#007BA7] text-white border border-[#007BA7] shadow-xs font-semibold'
                    : 'bg-white dark:bg-[#14191D] text-[#64748B] dark:text-[#8B98A5] border border-[#D9E2EA] dark:border-[#26333A] hover:text-[#17212B] dark:hover:text-white hover:border-[#007BA7]/40'
                }`}
              >
                {tech}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
