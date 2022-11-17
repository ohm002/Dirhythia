export function getWidth() {
  return Math.max(
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  )
}
export function getHeight() {
  return Math.max(document.documentElement.clientHeight)
}
