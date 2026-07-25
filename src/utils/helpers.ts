export const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export const uid = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
