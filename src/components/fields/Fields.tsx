import { motion } from 'framer-motion'
import { cx } from '@/lib/utils'

export function Label({ children, hint }: { children: string; hint?: string }) {
  return (
    <div className="mb-2">
      <label className="block font-display text-[15px] font-bold leading-snug">
        {children}
      </label>
      {hint && <p className="mt-0.5 text-[12px] text-white/55">{hint}</p>}
    </div>
  )
}

export function TextField({
  value,
  onChange,
  placeholder,
  invalid,
  inputMode = 'text',
  autoComplete,
  onEnter,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  invalid?: boolean
  inputMode?: 'text' | 'tel'
  autoComplete?: string
  onEnter?: () => void
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          onEnter?.()
        }
      }}
      placeholder={placeholder}
      inputMode={inputMode}
      autoComplete={autoComplete}
      className={cx(
        'w-full rounded-xl border bg-white/5 px-4 py-3 text-white outline-none transition',
        'placeholder:text-white/35 focus:border-rosa focus:bg-white/10',
        invalid ? 'border-rosa/70' : 'border-white/15',
      )}
    />
  )
}

export function ChoiceGrid({
  options,
  value,
  onChange,
  columns = 1,
}: {
  options: readonly { value: string; label: string; hint?: string }[]
  value: string
  onChange: (v: string) => void
  columns?: 1 | 2
}) {
  return (
    <div className={cx('grid gap-2', columns === 2 && 'grid-cols-2')}>
      {options.map((o) => {
        const selected = value === o.value
        return (
          <motion.button
            key={o.value}
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(o.value)}
            className={cx(
              'rounded-xl border px-3.5 py-2.5 text-left transition',
              selected
                ? 'border-rosa bg-brand-grad text-roxo-950'
                : 'border-white/15 bg-white/5 text-white hover:border-white/35',
            )}
          >
            <span
              className={cx(
                'block text-[13px] font-semibold leading-snug',
                selected && 'font-bold',
              )}
            >
              {o.label}
            </span>
            {o.hint && (
              <span
                className={cx(
                  'mt-0.5 block text-[11px] leading-snug',
                  selected ? 'text-roxo-900/75' : 'text-white/50',
                )}
              >
                {o.hint}
              </span>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  loading,
}: {
  children: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={cx(
        'w-full rounded-xl px-4 py-3.5 font-display text-[15px] font-black transition',
        disabled || loading
          ? 'cursor-not-allowed bg-white/10 text-white/40'
          : 'bg-brand-grad text-roxo-950 shadow-lg shadow-magenta/25',
      )}
    >
      {loading ? 'Enviando...' : children}
    </motion.button>
  )
}
