// Implemented unit tests for the `mapExpressionsToEmotionVector` utility function.
import { describe, it, expect } from 'vitest';
import { mapExpressionsToEmotionVector } from '../emotionUtils';
import { EmotionExpressions } from '../../types';

describe('mapExpressionsToEmotionVector', () => {
  it('should correctly identify "happy" as the dominant emotion with positive valence and moderate energy', () => {
    const expressions: EmotionExpressions = {
      neutral: 0.1, happy: 0.9, sad: 0.0, angry: 0.0, fearful: 0.0, disgusted: 0.0, surprised: 0.0,
    };
    const mood = mapExpressionsToEmotionVector(expressions);
    expect(mood.emotion).toBe('happy');
    expect(mood.valence).toBeCloseTo(0.9);
    expect(mood.energy).toBeCloseTo(-0.1);
  });

  it('should correctly identify "sad" as the dominant emotion with negative valence and negative energy', () => {
    const expressions: EmotionExpressions = {
      neutral: 0.2, happy: 0.0, sad: 0.8, angry: 0.0, fearful: 0.0, disgusted: 0.0, surprised: 0.0,
    };
    const mood = mapExpressionsToEmotionVector(expressions);
    expect(mood.emotion).toBe('sad');
    expect(mood.valence).toBeCloseTo(-0.8);
    expect(mood.energy).toBeCloseTo(-1.0); // -0.8 - 0.2 = -1.0
  });

  it('should correctly identify "angry" as the dominant emotion with negative valence and positive energy', () => {
    const expressions: EmotionExpressions = {
      neutral: 0.1, happy: 0.0, sad: 0.0, angry: 0.8, fearful: 0.1, disgusted: 0.0, surprised: 0.0,
    };
    const mood = mapExpressionsToEmotionVector(expressions);
    expect(mood.emotion).toBe('angry');
    expect(mood.valence).toBeCloseTo(-0.9); // 0 - (0+0.8+0.1+0) = -0.9
    expect(mood.energy).toBeCloseTo(0.8); // 0.8+0+0.1 - (0+0.1) = 0.8
  });

  it('should correctly identify "surprised" as the dominant emotion with neutral valence and positive energy', () => {
    const expressions: EmotionExpressions = {
      neutral: 0.1, happy: 0.0, sad: 0.0, angry: 0.0, fearful: 0.0, disgusted: 0.0, surprised: 0.9,
    };
    const mood = mapExpressionsToEmotionVector(expressions);
    expect(mood.emotion).toBe('surprised');
    expect(mood.valence).toBe(0);
    expect(mood.energy).toBeCloseTo(0.8); // 0+0.9+0 - (0+0.1) = 0.8
  });

  it('should clamp valence when it exceeds 1', () => {
    // This is technically not possible with face-api which sums to 1, but we test the function's robustness
    const expressions: EmotionExpressions = {
      neutral: 0, happy: 1.5, sad: 0, angry: 0, fearful: 0, disgusted: 0, surprised: 0,
    };
    const mood = mapExpressionsToEmotionVector(expressions);
    expect(mood.valence).toBe(1);
  });

  it('should clamp valence when it is less than -1', () => {
    const expressions: EmotionExpressions = {
      neutral: 0, happy: 0, sad: 0.8, angry: 0.8, fearful: 0, disgusted: 0, surprised: 0,
    };
    const mood = mapExpressionsToEmotionVector(expressions);
    expect(mood.valence).toBe(-1); // 0 - (0.8+0.8) = -1.6, clamped to -1
  });

  it('should clamp energy when it exceeds 1', () => {
    const expressions: EmotionExpressions = {
      neutral: 0, happy: 0, sad: 0, angry: 0.8, fearful: 0.5, disgusted: 0, surprised: 0,
    };
    const mood = mapExpressionsToEmotionVector(expressions);
    expect(mood.energy).toBe(1); // 0.8 + 0.5 = 1.3, clamped to 1
  });

  it('should clamp energy when it is less than -1', () => {
    const expressions: EmotionExpressions = {
      neutral: 0.8, happy: 0, sad: 0.8, angry: 0, fearful: 0, disgusted: 0, surprised: 0,
    };
    const mood = mapExpressionsToEmotionVector(expressions);
    expect(mood.energy).toBe(-1); // 0 - (0.8+0.8) = -1.6, clamped to -1
  });

  it('should handle a perfectly neutral expression', () => {
    const expressions: EmotionExpressions = {
      neutral: 1.0, happy: 0, sad: 0, angry: 0, fearful: 0, disgusted: 0, surprised: 0,
    };
    const mood = mapExpressionsToEmotionVector(expressions);
    expect(mood.emotion).toBe('neutral');
    expect(mood.valence).toBe(0);
    expect(mood.energy).toBe(-1);
  });
});
