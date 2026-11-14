import type { Photo } from './types'

// Machi（@machihistory）の写真。Instagram の投稿から取得したもの（テストサイト用）。
//   portrait.jpg         … /p/DeMw0O9mUPK/（5枚目）
//   travel-*.jpg         … /p/Dc3j2dOmSn5/（撮影：@waaata_photo）
//   designfesta.jpg      … /reel/Dfue_j-gx0M/（カバー）
// 正式公開の前に、使う写真をMachi本人に選び直してもらうこと。

const photo = (file: string, ja: string, zh: string): Photo => ({
  src: `/photos/machi/${file}`,
  width: 1400,
  height: 1867,
  alt: { ja, zh },
})

export const machi = {
  portrait: photo('portrait.jpg', '白い着物姿のMachi', '身穿白色和服的Machi'),
  portraitCredit: 'Photo: Machi（@machihistory）',
  travel: [
    photo('travel-platform.jpg', '夏の駅のホームに立つMachi', '站在夏日車站月台上的Machi'),
    photo('travel-sky.jpg', '青空の下、田舎道に立つMachi', '藍天下站在鄉間小路上的Machi'),
    photo('travel-station.jpg', '木造の駅舎で空を見上げるMachi', '在木造車站裡仰望天空的Machi'),
  ],
  travelCredit: 'Photo: @waaata_photo',
}
