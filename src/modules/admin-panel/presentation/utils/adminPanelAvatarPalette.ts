import type { IAdminPanelUser } from '../../data/models/AdminPanel'
import { ADMIN_AVATAR_COLOR } from '../constants/adminPanelAvatar'
import {
  AVATAR_COLOR_TOKENS,
  type AvatarColorTone
} from './getAvatarColorStyles'

export function buildInitialAvatarPalette(users: IAdminPanelUser[]) {
  let availableColors = shuffleAvatarColors(
    AVATAR_COLOR_TOKENS.filter((color) => color !== ADMIN_AVATAR_COLOR),
    users.map((user) => user.id).join('|')
  )

  const avatarColorByUserId = users.reduce<Record<string, AvatarColorTone>>(
    (accumulator, user) => {
      if (user.isAdmin) {
        accumulator[user.id] = ADMIN_AVATAR_COLOR
        return accumulator
      }

      const { nextColor, nextAvailableColors } = drawAvatarColor(
        availableColors,
        user.id
      )
      availableColors = nextAvailableColors
      accumulator[user.id] = nextColor
      return accumulator
    },
    {}
  )

  return {
    avatarColorByUserId,
    availableColors
  }
}

function getSeededNumber(seed: string): number {
  return [...seed].reduce(
    (accumulator, char) =>
      (accumulator * 31 + char.charCodeAt(0)) % 2147483647,
    7
  )
}

function shuffleAvatarColors(
  colors: readonly AvatarColorTone[],
  seed = `${colors.join('-')}-${colors.length}`
): AvatarColorTone[] {
  const shuffledColors = [...colors]
  let currentSeed = getSeededNumber(seed)

  for (
    let currentIndex = shuffledColors.length - 1;
    currentIndex > 0;
    currentIndex -= 1
  ) {
    currentSeed = (currentSeed * 48271) % 2147483647
    const randomIndex = currentSeed % (currentIndex + 1)
    ;[shuffledColors[currentIndex], shuffledColors[randomIndex]] = [
      shuffledColors[randomIndex],
      shuffledColors[currentIndex]
    ]
  }

  return shuffledColors
}

function drawAvatarColor(availableColors: AvatarColorTone[], seed?: string) {
  const nextAvailableColors =
    availableColors.length > 0
      ? [...availableColors]
      : shuffleAvatarColors(AVATAR_COLOR_TOKENS, seed)

  const nextColor = nextAvailableColors.shift() ?? ADMIN_AVATAR_COLOR

  return {
    nextColor,
    nextAvailableColors
  }
}
