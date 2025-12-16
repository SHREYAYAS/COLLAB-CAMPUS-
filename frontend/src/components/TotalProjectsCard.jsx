import React from 'react'
import { useTheme } from '@mui/material/styles'
import GridViewIcon from '@mui/icons-material/GridView'
import StatCard from './StatCard'

/**
 * TotalProjectsCard
 * Safe wrapper around StatCard that guarantees a visible gradient background and white text,
 * even if theme.custom tokens are missing. Keeps the corner arrow and icon consistent.
 */
export default function TotalProjectsCard({ count = 0, onOpen }) {
  const theme = useTheme()
  const fallbackGradient = 'linear-gradient(135deg, #032514 0%, #064A27 28%, #0A6F39 52%, #0F8F48 72%, #10B981 100%)'
  const fallbackShadow = '0 12px 28px -4px rgba(16,185,129,0.35), 0 4px 12px -2px rgba(6,74,39,0.4)'
  const gradient = theme?.custom?.gradients?.emerald || fallbackGradient
  const shadow = theme?.custom?.shadows?.emerald || fallbackShadow

  return (
    <StatCard
      title="Total Projects"
      value={count}
      icon={<GridViewIcon fontSize="small" sx={{ color: '#fff' }} />}
      subtitle="Increased from last month"
      trend="up"
      titleColor="#ffffff"
      valueColor="#ffffff"
      subtitleAsBadge
      badgeBg="rgba(255,255,255,0.18)"
      badgeColor="#ffffff"
      trendColor="#ffffff"
      sx={{
        background: gradient,
        color: 'white',
        borderRadius: 6,
        boxShadow: shadow,
        border: '1px solid rgba(255,255,255,0.30)',
        overflow: 'hidden',
      }}
      showCornerArrow
      onCornerClick={onOpen}
      cornerTooltip="Open projects"
      cornerSx={{
        bgcolor: 'rgba(255,255,255,0.85)',
        borderColor: 'rgba(255,255,255,0.95)',
        '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
        color: 'text.primary',
      }}
      iconBoxSx={{
        bgcolor: 'rgba(255,255,255,0.22)',
        border: '1px solid rgba(255,255,255,0.35)',
      }}
    />
  )
}
