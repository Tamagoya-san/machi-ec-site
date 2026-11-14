import { notFound } from 'next/navigation'

// /ja/存在しないパス でも、言語に合わせた 404 ページ（not-found.tsx）を表示するための受け皿。
export default function CatchAll() {
  notFound()
}
