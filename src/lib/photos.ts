// src/assets/photos/ に置いた画像をビルド時に自動で拾う。
// 例：hero.jpg / profile.jpg / product-alishan-oolong.jpg
const files = import.meta.glob<string>('../assets/photos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
})

const byName = new Map(
  Object.entries(files).map(([path, url]) => [path.split('/').pop()!.replace(/\.\w+$/, ''), url]),
)

export const photo = (name: string) => byName.get(name)
