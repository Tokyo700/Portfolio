/**
 * Pill button with the rolling-letters hover and a dot that expands to
 * flood the button. Renders an <a> when `href` is given, else a <button>.
 */
export default function RollButton({
  children,
  href,
  onClick,
  type = 'button',
  variant = 'light',
  className = '',
  textClassName = 'text-[1.15vw] max-[1025px]:text-[3vw] max-md:text-[4.2vw]',
  disabled,
  ...rest
}) {
  const text = String(children)
  const palette =
    variant === 'flame'
      ? 'flame-gradient text-white hover:text-[#070707]'
      : 'bg-white text-[#111] hover:text-white border border-white/20'
  const dot = variant === 'flame' ? 'bg-white' : 'bg-[#070707]'

  const inner = (
    <>
      <span
        aria-hidden
        className="relative z-10 flex shrink-0 items-center justify-center w-[0.5vw] h-[0.5vw] min-w-1.5 min-h-1.5 max-[1025px]:w-[1.5vw] max-[1025px]:h-[1.5vw] max-md:w-[2.3vw] max-md:h-[2.3vw]"
      >
        <span
          className={`absolute inset-0 rounded-full ${dot} transition-transform duration-[400ms] group-hover:scale-[120] motion-reduce:transition-none`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)' }}
        />
      </span>
      <span aria-hidden className={`invisible block h-[1.3em] leading-[1.3] ${textClassName}`}>
        {text}
      </span>
      <span
        className={`absolute left-1/2 top-1/2 z-20 block h-[1.3em] -translate-x-1/2 -translate-y-1/2 overflow-hidden ${textClassName}`}
      >
        <span className="block leading-[1.3] whitespace-pre">
          {[...text].map((ch, i) => (
            <span
              key={i}
              className="relative inline-block group-hover:-translate-y-[1.3em] transition-transform duration-[600ms] motion-reduce:transition-none"
              style={{
                textShadow: '0 1.3em currentColor',
                transitionDelay: `${i * 0.01}s`,
                transitionTimingFunction: 'cubic-bezier(0.625, 0.05, 0, 1)',
              }}
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </span>
      </span>
      <span aria-hidden className="block shrink-0 w-[0.5vw] max-[1025px]:w-[1.5vw] max-md:w-[2.3vw]" />
    </>
  )

  const classes = `group relative flex w-fit items-center justify-center gap-[0.9vw] h-[3.5vw] min-h-11 px-[2vw] rounded-full overflow-hidden whitespace-nowrap font-medium cursor-pointer transition-colors duration-500 disabled:opacity-60 disabled:cursor-wait max-[1025px]:gap-[1.6vw] max-[1025px]:h-[8vw] max-[1025px]:px-[3.5vw] max-md:gap-[2.4vw] max-md:h-[12vw] max-md:px-[5vw] ${palette} ${className}`

  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes} aria-label={text} {...rest}>
        {inner}
      </a>
    )
  }
  return (
    <button type={type} onClick={onClick} className={classes} aria-label={text} disabled={disabled} {...rest}>
      {inner}
    </button>
  )
}
