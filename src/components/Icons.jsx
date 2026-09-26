// Inline line icons only — no icon font, no emoji.
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const Svg = ({ size = 20, children, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    {...base}
    {...rest}
  >
    {children}
  </svg>
)

export const ArrowRight = (p) => (
  <Svg {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </Svg>
)

export const ArrowLeft = (p) => (
  <Svg {...p}>
    <path d="M20 12H5M11 18l-6-6 6-6" />
  </Svg>
)

export const Check = (p) => (
  <Svg {...p} strokeWidth={2.4}>
    <path d="M4.5 12.5l5 5 10-11" />
  </Svg>
)

export const ChevronRight = (p) => (
  <Svg {...p}>
    <path d="M9 5l7 7-7 7" />
  </Svg>
)

export const Info = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.6v.1" />
  </Svg>
)

export const External = (p) => (
  <Svg {...p}>
    <path d="M14 5h5v5M19 5l-8 8" />
    <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
  </Svg>
)

export const ThumbUp = (p) => (
  <Svg {...p}>
    <path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3z" />
    <path d="M7 11l4.2-7.4a1 1 0 0 1 1.8.5V9h5.2a2 2 0 0 1 2 2.3l-1.1 7A2 2 0 0 1 17.1 20H7" />
  </Svg>
)

export const Flag = (p) => (
  <Svg {...p}>
    <path d="M5 21V4" />
    <path d="M5 5h10.5l-1.6 3.5L15.5 12H5z" />
  </Svg>
)

export const Clock = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.2l3.2 2" />
  </Svg>
)

export const Coins = (p) => (
  <Svg {...p}>
    <ellipse cx="12" cy="6.5" rx="7" ry="3" />
    <path d="M5 6.5v11c0 1.7 3.1 3 7 3s7-1.3 7-3v-11" />
    <path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
  </Svg>
)

export const Calendar = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="1" />
    <path d="M3.5 10h17M8 3.5v3M16 3.5v3" />
  </Svg>
)

export const Route = (p) => (
  <Svg {...p}>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="M8.5 6H14a3.5 3.5 0 0 1 0 7h-4a3.5 3.5 0 0 0 0 7h5.5" />
  </Svg>
)

export const Users = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.4a3.2 3.2 0 0 1 0 5.2M17.5 14.8A5.5 5.5 0 0 1 20.5 20" />
  </Svg>
)

export const Alert = (p) => (
  <Svg {...p}>
    <path d="M12 4.5l8.5 15H3.5z" />
    <path d="M12 10v4M12 17.2v.1" />
  </Svg>
)

export const Refresh = (p) => (
  <Svg {...p}>
    <path d="M20 12a8 8 0 1 1-2.4-5.7" />
    <path d="M20 4v4.5h-4.5" />
  </Svg>
)

export const ChevronDown = (p) => (
  <Svg {...p}>
    <path d="M5 9l7 7 7-7" />
  </Svg>
)

export const Close = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
)

export const EyeOff = (p) => (
  <Svg {...p}>
    <path d="M3 3l18 18" />
    <path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c5.5 0 9 7 9 7a16.4 16.4 0 0 1-2.9 3.7M6.6 6.6C4.3 8.1 3 12 3 12s3.5 7 9 7a9.5 9.5 0 0 0 4.4-1.1" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </Svg>
)

export const Plus = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)

export const Pencil = (p) => (
  <Svg {...p}>
    <path d="M4 20h4L19 9l-4-4L4 16z" />
    <path d="M13.5 6.5l4 4" />
  </Svg>
)

export const Trash = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </Svg>
)
