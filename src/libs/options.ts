// todo: make this configurable
function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  )
}
function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  )
}

export const COLCOLOR = [0xff6161, 0x3dd2ff, 0xff6161, 0x3dd2ff]
export const WIDTH = 1200
export const HEIGHT = 700
export const COL_1_KEY = 'f'
export const COL_2_KEY = 'g'
export const COL_3_KEY = 'h'
export const COL_4_KEY = 'j'
export const CURSOR_LEFT_KEY = 'u'
export const CURSOR_RIGHT_KEY = 'i'
export const COL_WIDTH = 80
export const HOLD_WIDTH = COL_WIDTH-20
export const NOTE_HEIGHT = 20
export const PLAYFIELD_WIDTH = COL_WIDTH * 4
export const SCROLL_SPEED = 1000 // px per sec
export const NOTE_TRAVEL_DURATION = (HEIGHT / SCROLL_SPEED) * 1000
export const JUDGEMENT_LINE_OFFSET_Y = 80
export const OFFSET = 50 // ms ************** CHART OFFSET
// if you're early, adjust down
// if you're late, adjust up
export const NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION =
  (JUDGEMENT_LINE_OFFSET_Y / SCROLL_SPEED) * 1000
