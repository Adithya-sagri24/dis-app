import { EmotionExpressions, Mood } from '../types';

/**
 * Maps the raw expression scores from face-api.js to a standardized
 * Mood object containing a dominant emotion, valence, and energy.
 *
 * This uses the circumplex model of affect, where:
 * - Valence: A measure of pleasantness, from -1 (negative) to 1 (positive).
 * - Energy: A measure of arousal/activation, from -1 (calm) to 1 (excited).
 *
 * @param expressions - The raw expression scores from face-api.js.
 * @returns A Mood object with the dominant emotion and calculated vectors.
 */
export function mapExpressionsToEmotionVector(expressions: EmotionExpressions): Mood {
  // 1. Determine the dominant emotion by finding the expression with the highest score.
  const dominantEmotion = Object.entries(expressions).reduce(
    (acc, [emotion, score]) => (score > acc.score ? { emotion, score } : acc),
    { emotion: 'neutral', score: 0 }
  ).emotion;

  // 2. Calculate valence and energy based on the circumplex model.
  // This provides a more nuanced vector than a simple lookup table by blending scores.
  const valence = expressions.happy - (expressions.sad + expressions.angry + expressions.fearful + expressions.disgusted);
  const energy = expressions.angry + expressions.surprised + expressions.fearful - (expressions.sad + expressions.neutral);

  return {
    emotion: dominantEmotion,
    // Clamp values to the expected [-1, 1] range for consistency.
    valence: Math.max(-1, Math.min(1, valence)),
    energy: Math.max(-1, Math.min(1, energy)),
  };
}
