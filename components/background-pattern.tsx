'use client'

type PatternVariant = 'hero' | 'section' | 'page' | 'footer'

type BackgroundPatternProps = {
  variant?: PatternVariant
}

const rotations = [0, 90, 180, 270] as const

function getOpacity(variant: PatternVariant, x: number, y: number) {
  // Keep ornaments visible in empty areas and almost invisible near content.
  if (variant === 'hero') {
    const overHeroCopy = x >= 7 && x <= 49 && y >= 10 && y <= 88
    const overHeroVisual = x >= 53 && x <= 93 && y >= 10 && y <= 90
    if (overHeroCopy || overHeroVisual) return 0.008
    return 0.052
  }

  if (variant === 'section') {
    const centralContent = x >= 15 && x <= 85 && y >= 12 && y <= 88
    return centralContent ? 0.012 : 0.05
  }

  if (variant === 'page') {
    const denseCenter = x >= 10 && x <= 90 && y >= 10 && y <= 92
    return denseCenter ? 0.01 : 0.048
  }

  return 0.045
}

export function BackgroundPattern({ variant = 'section' }: BackgroundPatternProps) {
  const rows = 5
  const cols = 10
  const items: Array<{ x: number; y: number; rotate: number; opacity: number; size: number }> = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const offset = row % 2 === 0 ? 0 : 5.2
      const x = -2 + col * 11.5 + offset
      const y = 5 + row * 23
      const rotate = rotations[(row * 3 + col) % rotations.length]
      const size = 28 + ((row + col) % 3) * 4

      items.push({
        x,
        y,
        rotate,
        size,
        opacity: getOpacity(variant, x, y),
      })
    }
  }

  return (
    <div
      className={`ornament-field ornament-field-${variant}`}
      aria-hidden="true"
    >
      {items.map((item, index) => (
        <img
          key={`${variant}-${index}`}
          className="ornament-item"
          src="/patterns/kyrgyz-ornament.svg"
          alt=""
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `${item.size}px`,
            height: `${item.size}px`,
            opacity: item.opacity,
            transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}
