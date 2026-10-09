interface Props {
  value: number
  max: number
  onChange: (value: number) => void
  small?: boolean
}

export function QtyStepper({ value, max, onChange, small }: Props) {
  return (
    <div className={`qty ${small ? 'qty--small' : ''}`}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="数量を減らす">
        −
      </button>
      <span aria-live="polite" aria-label={`数量 ${value}`}>
        {value}
      </span>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="数量を増やす">
        +
      </button>
    </div>
  )
}
