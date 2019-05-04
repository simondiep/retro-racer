import { RUMBLE_LENGTH, SEGMENT_LENGTH, TOTAL_SEGMENTS } from "./config.js";

export function createRoadSegments() {
  const segments = [];
  for (let n = 0; n < TOTAL_SEGMENTS; n++) {
    segments.push({
      index: n,
      z1: n * SEGMENT_LENGTH,
      z2: (n + 1) * SEGMENT_LENGTH,
      showLaneStripe: Math.floor(n / RUMBLE_LENGTH) % 2 ? true : false,
      grassColor: Math.floor(n / RUMBLE_LENGTH) % 2 ? "#10AA10" : "#009A00",
      rumbleColor: Math.floor(n / RUMBLE_LENGTH) % 2 ? "#555555" : "#BBBBBB",
    });
  }
  return segments;
}

export function convertZPositionRoadTo2dCoords(playerX, z, currentZPosition, isLooped, trackLength) {
  const cameraY = canvas.height - 50;
  const cameraZ = isLooped ? currentZPosition - trackLength : currentZPosition;
  const fieldOfView = 100;
  const cameraDepth = 1 / Math.tan(((fieldOfView / 2) * Math.PI) / 180);
  const roadWidth = 1000;
  const translatedX = -playerX * roadWidth;
  const translatedY = -cameraY;
  const translatedZ = Math.abs(z - cameraZ);
  const scale = cameraDepth / translatedZ;
  return {
    x: Math.round(canvas.width / 2 + (scale * translatedX * canvas.width) / 2),
    y: Math.round(canvas.height / 2 - (scale * translatedY * canvas.height) / 2),
    w: Math.round((scale * roadWidth * canvas.width) / 2),
  };
}
