import { useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'

export function ProjectVisual({ image, alt, className = '' }) {
  const [imageError, setImageError] = useState(false)

  const hasValidImage = Boolean(image && typeof image === 'string' && image.trim() !== '' && !imageError)

  return (
    <div className={`project-visual relative w-full h-full overflow-hidden bg-slate-100 dark:bg-slate-900/80 ${className}`}>
      {hasValidImage ? (
        <img
          src={image}
          alt={alt || 'Project screenshot'}
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 p-4 select-none">
          <ImageIcon className="w-9 h-9 mb-1.5 opacity-40 text-slate-400 dark:text-slate-500" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">No image available</span>
        </div>
      )}
    </div>
  )
}
