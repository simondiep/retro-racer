export const LANES = 3;
export const RUMBLE_LENGTH = 3;
export const SEGMENT_LENGTH = 200;
export const TOTAL_SEGMENTS = 500;
export const FPS = 30;
export const SHAKE_INTENSITY = 2;  // in pixels

export const MAX_SPEED = SEGMENT_LENGTH * FPS / 20;
export const ACCEL_SPEED = MAX_SPEED/5;
export const BREAKING_SPEED = -MAX_SPEED;
export const DECEL_SPEED = -MAX_SPEED/5;
export const OFFROAD_DECEL_SPEED = -MAX_SPEED/2;
export const OFFROAD_MAX_SPEED =  MAX_SPEED/4;
export const DRAW_DISTANCE = 300;