/**
 * points = 1 if win
 * points = 0.5 if draw
 * points = 0 if lose
 * 
 * Calculates the new elo ranking for a player after a game
 */
export const getNewScore = (selfScore, otherScore, points) => {
  const exponent = (otherScore - selfScore) / 400
  const expectedScore = 1 / (1 + Math.pow(10, exponent))

  const newRating = selfScore + 20 * (points - expectedScore)

  return newRating
}
