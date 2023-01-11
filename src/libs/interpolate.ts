export function interpolate(
  input: number,
  inputRange: [number, number],
  outputRange: [number, number],
  nolimit?: boolean
): number {
  const [inputMin, inputMax] = inputRange
  const [outputMin, outputMax] = outputRange

  if (input < inputMin && !nolimit) return outputMin
  if (input > inputMax && !nolimit) return outputMax
  if (outputMin === outputMax && !nolimit) return outputMin

  return (
    ((input - inputMin) / (inputMax - inputMin)) * (outputMax - outputMin) +
    outputMin
  )
}

export function easeOutCubic(
  input: number,
  inputRange: [number, number],
  outputRange: [number, number]
): number {
  const [inputMin, inputMax] = inputRange
  const [outputMin, outputMax] = outputRange
  // input = inputMin + Math.pow(Math.abs(inputMax - inputMin) - input, 3)
  let inputt = (input - inputMin) / (inputMax - inputMin)
  inputt = 1 - ((1 - inputt)**3);
  if (input < inputMin) return outputMin
  if (input > inputMax) return outputMax
  if (outputMin === outputMax) return outputMin
  return (
    (inputt) * (outputMax - outputMin) +
    outputMin
  )
}
