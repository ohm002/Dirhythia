export const WIDTH = 640
export const HEIGHT = 480
export const COL_1_KEY = 'd'
export const COL_2_KEY = 'f'
export const COL_3_KEY = 'j'
export const COL_4_KEY = 'k'
export const CURSOR_LEFT_KEY = 'ArrowLeft'
export const CURSOR_RIGHT_KEY = 'ArrowRight'
export const COL_WIDTH = 100
export const HOLD_WIDTH = 75
export const NOTE_HEIGHT = 10
export const PLAYFIELD_WIDTH = COL_WIDTH * 4
export const SCROLL_SPEED = 500 // px per sec
export const NOTE_TRAVEL_DURATION = (HEIGHT / SCROLL_SPEED) * 1000
export const JUDGEMENT_LINE_OFFSET_Y = 80
export const OFFSET = -50 // ms
// if you're early, adjust down
// if you're late, adjust up
export const NOTE_TRAVEL_FROM_LINE_TO_BOTTOM_DURATION =
  (JUDGEMENT_LINE_OFFSET_Y / SCROLL_SPEED) * 1000
