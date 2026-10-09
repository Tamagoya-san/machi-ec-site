const yen = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' })

export const formatYen = (value: number) => yen.format(value)
