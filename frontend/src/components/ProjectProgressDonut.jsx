import React, { useMemo, useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

/**
 * ProjectProgressDonut
 * A thin ring (donut) progress indicator with a centered percentage label.
 *
 * Props:
 *  value        - number (0-100) progress percent
 *  size         - px width/height of the canvas container
 *  thickness    - ring stroke thickness in px
 *  progressColor- color of the completed portion
 *  trackColor   - color of the remaining portion
 *  labelColor   - color of the centered label text
 *  showLabel    - boolean to toggle center label
 *  animated     - boolean to enable initial animation
 */
export default function ProjectProgressDonut({
  value = 41,
  size = 160,
  thickness = 14,
  progressColor = '#10B981',
  trackColor = '#E5E7EB',
  labelColor = '#111827',
  showLabel = true,
  animated = true,
  // New options
  semiGauge = false, // render 180° arc (top) instead of full circle
  animateCount = false, // count-up the center number
  patternPending = false, // show hatched pattern for pending segment when breakdown present
  // Text sizing controls (multipliers on base size ratios)
  labelScale = 1, // scales the main percentage text (base is size * 0.22)
  subtitleScale = 1, // scales the subtitle text (base is size * 0.08)
  // Center subtitle text
  centerSubtitle = 'Project Progress',
  // Pattern density controls
  patternSize = 8,
  patternThickness = 3,
  // Gap between arc segments (px) when semiGauge is true
  gapPx = 4,
  // Whether arc segment ends are rounded; turn off to minimize visible seams between segments
  roundedEnds = true,
  // Degrees to inset the arc start from the hard left when semiGauge is true
  padDegrees = 10,
  // Explicit start angle (in degrees) when semiGauge is true. Defaults to -180 (left).
  // Negative values rotate clockwise from the right-hand side; -180 is left; -90 is top.
  startAngleDeg = -180,
  // Optional detailed breakdown to render three-shade progress
  // { completed: number, inProgress: number, pending: number }
  breakdown,
  showLegend = true,
  legendLabels = { completed: 'Completed', inProgress: 'In Progress', pending: 'Pending' },
  colors = { completed: '#064A27', inProgress: '#0A6F39', pending: '#10B981' },
}) {
  // Clamp value and guard NaN
  const done = useMemo(() => {
    const numeric = Number(value)
    if (Number.isNaN(numeric)) return 0
    return Math.min(100, Math.max(0, numeric))
  }, [value])
  const remaining = 100 - done

  // Cutout calculation: derive inner radius so visual thickness ~= provided px
  // cutout % = (innerRadius / outerRadius) * 100; outerRadius ~ size/2
  const cutoutPercent = useMemo(() => {
    const inner = (size / 2) - thickness
    const pct = (inner / (size / 2)) * 100
    // Bound 0-95 to avoid fully collapsed / overly thin rendering
    return `${Math.min(95, Math.max(0, pct))}%`
  }, [size, thickness])

  // Utility: create a diagonal stripe CanvasPattern
  const makeStripePattern = (fg = '#13C48A', bg = 'transparent', size = patternSize, thickness = patternThickness) => {
    if (typeof document === 'undefined') return fg
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return fg
    // background
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, size, size)
    // stripes (diagonal)
    ctx.strokeStyle = fg
    ctx.lineWidth = thickness
    ctx.beginPath()
    ctx.moveTo(0, size)
    ctx.lineTo(size, 0)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(-size * 0.25, size)
    ctx.lineTo(size * 0.75, 0)
    ctx.stroke()
    return ctx.createPattern(canvas, 'repeat') || fg
  }

  const data = useMemo(() => {
    if (breakdown && (breakdown.completed || breakdown.inProgress || breakdown.pending)) {
      const c = Math.max(0, Number(breakdown.completed || 0))
      const i = Math.max(0, Number(breakdown.inProgress || 0))
      const p = Math.max(0, Number(breakdown.pending || 0))
      const total = c + i + p
      // Derive value if not explicitly provided
      const percent = total > 0 ? (c / total) * 100 : 0
      // Prepare colors / pattern (pending last)
      const pendingVisual = patternPending ? makeStripePattern(colors.pending, 'rgba(255,255,255,0)') : colors.pending
      return {
        datasets: [
          {
            data: [c, i, p],
            backgroundColor: [colors.completed, colors.inProgress, pendingVisual],
            borderWidth: 0,
            // Round only the outer tips to avoid a seam between segments
            borderRadius: roundedEnds
              ? ((ctx) => {
                  const idx = ctx.dataIndex || 0
                  const count = (ctx.dataset && ctx.dataset.data && ctx.dataset.data.length) || 0
                  const r = 50
                  if (count <= 1) return r
                  if (idx === 0) return { outerStart: r, innerStart: r, outerEnd: 0, innerEnd: 0 }
                  if (idx === count - 1) return { outerStart: 0, innerStart: 0, outerEnd: r, innerEnd: r }
                  return 0
                })
              : 0,
            // For semiGauge use a 180° arc starting at left (-180deg) so first segment appears on the left
            circumference: semiGauge ? 180 : 360,
            rotation: semiGauge ? (startAngleDeg + padDegrees) : -90,
            spacing: semiGauge ? gapPx : 0,
            // store meta for label display
            _total: total,
            _percent: percent,
          },
        ],
      }
    }
    return {
      datasets: [
        {
          data: [done, remaining],
          backgroundColor: [progressColor, trackColor],
          borderWidth: 0,
          borderRadius: roundedEnds ? 50 : 0, // rounded ends
          circumference: semiGauge ? 180 : 360, // arc length
          rotation: semiGauge ? (startAngleDeg + padDegrees) : -90, // start slightly inset from left for semi-gauge
          spacing: semiGauge ? gapPx : 0,
        },
      ],
    }
  }, [breakdown, done, remaining, progressColor, trackColor, colors.completed, colors.inProgress, colors.pending, semiGauge, patternPending])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: cutoutPercent,
    animation: animated ? { animateRotate: true, animateScale: false, duration: 900, easing: 'easeOutQuart' } : false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  }), [cutoutPercent, animated])

  const centerPercent = useMemo(() => {
    if (data?.datasets?.[0]?._percent != null) return Math.round(data.datasets[0]._percent)
    return Math.round(done)
  }, [data, done])

  // Animated count-up for center text
  const [displayPercent, setDisplayPercent] = useState(centerPercent)
  useEffect(() => {
    if (!animateCount) { setDisplayPercent(centerPercent); return }
    const start = displayPercent
    const end = centerPercent
    const diff = end - start
    if (diff === 0) return
    const duration = 600
    const startTs = performance.now()
    let raf
    const tick = (ts) => {
      const t = Math.min(1, (ts - startTs) / duration)
      setDisplayPercent(Math.round(start + diff * t))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => raf && cancelAnimationFrame(raf)
  }, [centerPercent, animateCount])

  return (
    <div>
      <div
        style={{ position: 'relative', width: size, height: size }}
        aria-label={`Project progress ${centerPercent}%`}
        role="img"
      >
  <Doughnut data={data} options={options} />
        {showLabel && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              userSelect: 'none',
            }}
          >
            <div style={{ fontSize: size * 0.22 * labelScale, fontWeight: 700, color: labelColor }}>{displayPercent}%</div>
            <div style={{ fontSize: size * 0.08 * subtitleScale, color: '#6B7280' }}>{centerSubtitle}</div>
          </div>
        )}
      </div>
      {showLegend && breakdown && (
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
          <LegendDot color={colors.completed} label={legendLabels.completed} value={breakdown.completed || 0} />
          <LegendDot color={colors.inProgress} label={legendLabels.inProgress} value={breakdown.inProgress || 0} />
          <LegendDot color={colors.pending} label={legendLabels.pending} value={breakdown.pending || 0} />
        </div>
      )}
    </div>
  )
}

function LegendDot({ color, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 12 }}>
  <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block', boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }} />
      <span>{label}</span>
      <span style={{ color: '#9CA3AF' }}>({value})</span>
    </div>
  )
}
