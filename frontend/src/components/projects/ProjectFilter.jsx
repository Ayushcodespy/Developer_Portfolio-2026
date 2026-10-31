import { Search, X } from 'lucide-react'

export function ProjectFilter({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery = '',
  onSearchChange,
}) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
      {/* Category Pills */}
      <div
        className="flex flex-wrap items-center gap-2"
        role="tablist"
        aria-label="Filter projects by category"
      >
        {categories.map((category) => {
          const isActive = activeCategory === category.id
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007BA7]/50 cursor-pointer ${
                isActive
                  ? 'bg-[#007BA7] text-white border border-[#007BA7] shadow-md shadow-[#007BA7]/25'
                  : 'bg-white dark:bg-[#14191D] text-[#475569] dark:text-[#B8C2CC] border border-[#D9E2EA] dark:border-[#26333A] hover:bg-slate-100 dark:hover:bg-[#181818] hover:text-[#17212B] dark:hover:text-[#F5F7FA] hover:border-[#007BA7]/40 shadow-2xs'
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              {category.label}
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
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-full bg-white dark:bg-[#14191D] border border-[#D9E2EA] dark:border-[#26333A] text-[#17212B] dark:text-[#F5F7FA] placeholder-[#64748B] dark:placeholder-[#8B98A5] focus:outline-none focus:border-[#007BA7] focus:ring-2 focus:ring-[#007BA7]/20 shadow-2xs transition-all"
            aria-label="Search projects"
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
  )
}
