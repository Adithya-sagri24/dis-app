import { EmotionExpressions, Mood } from '../types';

/**
 * Maps the raw expression scores from face-api.js to a standardized
 * Mood object containing a dominant emotion, valence, and energy.
 *
 * This uses the circumplex model of affect, where:
 * - Valence: A measure of pleasantness, from -1 (negative) to 1 (positive).
 * - Energy: A measure of arousal/activation, from -1 (calm) to 1 (energetic).
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


/**
 * Returns target valence and energy values for emotion regulation.
 * Instead of matching the current mood, this function provides targets
 * to guide the user towards a more balanced or desired state.
 *
 * @param emotion - The dominant emotion detected.
 * @returns An object with target valence and energy.
 */
export function getEmotionRegulationTarget(emotion: string): { valence: number; energy: number } {
  const regulationMap: { [key: string]: { valence: number; energy: number } } = {
    angry:     { valence: 0.5, energy: -0.8 }, // Calm down -> Medium valence / Low energy
    sad:       { valence: 0.9, energy: 0.6 },  // Cheer up -> High valence / Medium-high energy
    fearful:   { valence: 0.6, energy: -0.7 }, // Relax -> Medium valence / Low energy
    disgusted: { valence: 0.5, energy: -0.5 }, // Settle -> Medium valence / Low energy
    surprised: { valence: 0.5, energy: 0.2 },  // Stabilize -> Medium valence / Medium energy
    happy:     { valence: 0.8, energy: 0.7 },  // Sustain -> High valence / Medium-high energy
    neutral:   { valence: 0.5, energy: 0.4 },  // Focus -> Medium valence / Medium energy
    // A 'tired' state isn't a primary emotion from face-api, but we can add a default for low energy states
    default:   { valence: 0.6, energy: 0.8 },  // Energize -> Medium valence / High energy
  };

  return regulationMap[emotion] || regulationMap.default;
}