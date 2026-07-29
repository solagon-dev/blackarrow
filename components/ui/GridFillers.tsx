/**
 * Fills the empty tail of a `gap-px bg-gray-200` grid.
 *
 * Those grids draw their hairline dividers by letting the container's grey
 * background show through a 1px gap. That works for a full grid, but when the
 * last row is short the same grey shows through the empty cells as a solid
 * block — five coverage cards in a three-column grid render as five cards and
 * a large grey rectangle that reads as a broken or still-loading tile.
 *
 * The number of empty cells depends on the breakpoint (five items leaves one
 * gap at three columns but three at four columns), so a fixed number of filler
 * divs can't work. This renders enough fillers for the widest configuration and
 * hides each one at the breakpoints where it isn't needed.
 *
 * Purely presentational, so every filler is aria-hidden.
 */
type Cols = {
  /** Columns below the `sm` breakpoint. Defaults to 1 — never leaves a gap. */
  base?: number
  sm?: number
  lg?: number
}

/** Empty cells left by `count` items in `cols` columns. */
function gap(count: number, cols: number | undefined): number {
  if (!cols || cols < 2) return 0
  return (cols - (count % cols)) % cols
}

export default function GridFillers({
  count,
  cols,
  as: Tag = 'div',
  fill = 'bg-white',
}: {
  count: number
  cols: Cols
  /** Match the grid's child element — `li` inside a <ul>, `div` otherwise. */
  as?: 'div' | 'li'
  /** Match the surrounding cards. Dark sections use `bg-navy-900`. */
  fill?: string
}) {
  const gaps = {
    base: gap(count, cols.base ?? 1),
    sm: gap(count, cols.sm ?? cols.base ?? 1),
    lg: gap(count, cols.lg ?? cols.sm ?? cols.base ?? 1),
  }

  const total = Math.max(gaps.base, gaps.sm, gaps.lg)
  if (total === 0) return null

  return (
    <>
      {Array.from({ length: total }, (_, i) => {
        // Each filler is shown only at the breakpoints that still have a gap
        // at its index. Tailwind needs whole class names, so both states are
        // written out at every breakpoint rather than composed.
        const visibility = [
          i < gaps.base ? 'block' : 'hidden',
          cols.sm ? (i < gaps.sm ? 'sm:block' : 'sm:hidden') : '',
          cols.lg ? (i < gaps.lg ? 'lg:block' : 'lg:hidden') : '',
        ]
          .filter(Boolean)
          .join(' ')

        return <Tag key={i} aria-hidden="true" className={`${fill} ${visibility}`} />
      })}
    </>
  )
}
