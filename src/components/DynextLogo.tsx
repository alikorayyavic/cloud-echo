interface DynextLogoProps {
  variant?: 'dark' | 'white'
  size?: 'sm' | 'md' | 'lg'
}

export default function DynextLogo({ variant = 'dark', size = 'md' }: DynextLogoProps) {
  const sizes = {
    sm: { text: '1.25rem', badge: '0.75rem', pad: '2px 7px', skew: -9 },
    md: { text: '1.55rem', badge: '0.85rem', pad: '3px 9px', skew: -9 },
    lg: { text: '2rem',    badge: '1.05rem', pad: '4px 12px', skew: -9 },
  }
  const s = sizes[size]

  const isDark = variant === 'dark'

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {/* "Dynext" italic bold text */}
      <span
        style={{
          fontFamily: "'Arial Black', 'Arial Bold', Gadget, sans-serif",
          fontStyle:  'italic',
          fontWeight: 900,
          fontSize:   s.text,
          color:      isDark ? '#1B3A8C' : 'white',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        Dynext
      </span>

      {/* "AI" parallelogram badge */}
      <span
        style={{
          display:       'inline-block',
          transform:     `skewX(${s.skew}deg)`,
          background:    isDark ? '#1B3A8C' : 'white',
          borderRadius:  '0 5px 5px 0',
          padding:       s.pad,
          marginLeft:    2,
        }}
      >
        <span
          style={{
            display:       'inline-block',
            transform:     `skewX(${-s.skew}deg)`,
            color:         isDark ? 'white' : '#1B3A8C',
            fontFamily:    "'Arial', 'Helvetica Neue', sans-serif",
            fontWeight:    800,
            fontSize:      s.badge,
            letterSpacing: '0.1em',
            lineHeight:    1,
          }}
        >
          AI
        </span>
      </span>
    </span>
  )
}
