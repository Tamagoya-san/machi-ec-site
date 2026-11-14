const yen = new Intl.NumberFormat('ja-JP')

/** 4400 → "¥4,400" */
export const formatPrice = (value: number): string => `¥${yen.format(value)}`

/** 1 → "01" */
export const pad2 = (value: number): string => String(value).padStart(2, '0')
