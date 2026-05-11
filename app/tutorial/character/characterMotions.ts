import {
  Easing,
  withRepeat,
  withSequence,
  withTiming,
  type WithSpringConfig,
} from "react-native-reanimated";

export const SPRING_SOFT: WithSpringConfig = {
  damping: 18,
  stiffness: 80,
  mass: 1,
};

export const SPRING_SNAPPY: WithSpringConfig = {
  damping: 14,
  stiffness: 200,
  mass: 0.8,
};

export const SPRING_BOUNCY: WithSpringConfig = {
  damping: 8,
  stiffness: 110,
  mass: 1,
};

export const SPRING_DROP: WithSpringConfig = {
  damping: 7,
  stiffness: 90,
  mass: 1.1,
};

export const SPRING_GLIDE: WithSpringConfig = {
  damping: 14,
  stiffness: 100,
  mass: 1,
};

export const SPRING_LEAN_RETURN: WithSpringConfig = {
  damping: 6,
  stiffness: 100,
  mass: 1,
};

export const idleFloat = () =>
  withRepeat(
    withSequence(
      withTiming(-5, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
      withTiming(5, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
    ),
    -1,
    false,
  );

/** Subtle breath — scale slowly inhales/exhales between 1.0 and 1.018 */
export const idleBreath = () =>
  withRepeat(
    withSequence(
      withTiming(1.018, {
        duration: 1600,
        easing: Easing.inOut(Easing.sin),
      }),
      withTiming(1.0, {
        duration: 1600,
        easing: Easing.inOut(Easing.sin),
      }),
    ),
    -1,
    false,
  );

/**
 * Pointing shake with anticipation — small wind-up in opposite direction first,
 * then commit to the pointing shake loop. Feels like the character "decides" to
 * point.
 */
export const pointingShake = () =>
  withSequence(
    // wind-up
    withTiming(3, {
      duration: 140,
      easing: Easing.out(Easing.quad),
    }),
    // shake loop
    withRepeat(
      withSequence(
        withTiming(-7, {
          duration: 180,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(6, {
          duration: 180,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(-6, {
          duration: 180,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(0, {
          duration: 180,
          easing: Easing.in(Easing.quad),
        }),
        withTiming(0, { duration: 800 }),
      ),
      -1,
      false,
    ),
  );

/** Taunt bob — "이리와 이리와" vertical bob with anticipation crouch first */
export const tauntBob = () =>
  withSequence(
    // crouch (anticipation)
    withTiming(4, { duration: 180, easing: Easing.out(Easing.quad) }),
    withRepeat(
      withSequence(
        withTiming(-9, {
          duration: 240,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(0, {
          duration: 240,
          easing: Easing.in(Easing.quad),
        }),
      ),
      -1,
      false,
    ),
  );

export const cheerPump = () =>
  withRepeat(
    withSequence(
      withTiming(1.1, { duration: 200, easing: Easing.out(Easing.quad) }),
      withTiming(1.0, { duration: 200, easing: Easing.in(Easing.quad) }),
    ),
    -1,
    false,
  );

export const celebrationSpin = () =>
  withRepeat(
    withTiming(360, { duration: 1500, easing: Easing.linear }),
    -1,
    false,
  );

/**
 * After a position change, oscillates rotation a tiny bit so the character
 * "shakes off" the travel momentum before settling.
 */
export const settleWobble = () =>
  withSequence(
    withTiming(-3, { duration: 120, easing: Easing.out(Easing.quad) }),
    withTiming(2, { duration: 120, easing: Easing.inOut(Easing.quad) }),
    withTiming(-1, { duration: 100, easing: Easing.inOut(Easing.quad) }),
    withTiming(0, { duration: 100, easing: Easing.in(Easing.quad) }),
  );

export const TIMINGS = {
  ENTRANCE_DROP_DELAY_MS: 80,
  TOOLTIP_ENTER_DELAY_MS: 350,
  TOOLTIP_TYPEWRITER_DELAY_MS: 200,
  STEP_TRANSITION_CHARACTER_DELAY_MS: 400,
} as const;
