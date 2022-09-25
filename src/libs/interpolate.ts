export function interpolate(
  input: number,
  inputRange: [number, number],
  outputRange: [number, number]
): number {
  const [inputMin, inputMax] = inputRange
  const [outputMin, outputMax] = outputRange

  if (input < inputMin) return outputMin
  if (input > inputMax) return outputMax
  if (outputMin === outputMax) return outputMin

  return (
    Math.round(((input - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) +
    outputMin)
  )
}
