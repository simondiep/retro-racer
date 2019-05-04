import { drawIntroScreen, drawShape } from "./canvas-view.js";
import { LANES, SEGMENT_LENGTH, FPS, SHAKE_INTENSITY, MAX_SPEED, DRAW_DISTANCE } from "./config.js";
import { calculateNewPlayerHorizontalPosition, calculateNewSpeed, getCarImage } from "./controls.js";
import { createRoadSegments, convertZPositionRoadTo2dCoords } from "./road.js";

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let segments = createRoadSegments();
let trackLength = segments.length * SEGMENT_LENGTH;
let speed = 0;
let playerHorizontalDistanceFromCenter = 0;

let currentZPosition = 0;
let baseSegment = segments[currentZPosition];

drawIntroScreen();

window.addEventListener("keydown", startGameEventListener);

function startGameEventListener() {
  window.removeEventListener("keydown", startGameEventListener);
  playBackgroundMusic();
  setInterval(() => {
    requestAnimationFrame(renderLoop);
  }, 1000 / FPS);
}

function playBackgroundMusic() {
  const music = document.getElementById("music-background");
  music.volume = 0.1;
  music.play();
}

function renderLoop() {
  // Sky
  context.fillStyle = "#72D7EE";
  context.fillRect(0, 0, canvas.width, canvas.height);
  // TODO render scenery/background

  playerHorizontalDistanceFromCenter = calculateNewPlayerHorizontalPosition(playerHorizontalDistanceFromCenter, speed);
  speed = calculateNewSpeed(playerHorizontalDistanceFromCenter, speed);

  currentZPosition += speed;
  if (currentZPosition > trackLength) {
    currentZPosition -= trackLength;
  }

  for (let n = 0; n < DRAW_DISTANCE; n++) {
    const segment = segments[(baseSegment.index + n) % segments.length];
    const isLooped = segment.index < baseSegment.index;
    const segment2D_1 = convertZPositionRoadTo2dCoords(
      playerHorizontalDistanceFromCenter,
      segment.z1,
      currentZPosition,
      isLooped,
      trackLength,
    );
    const segment2D_2 = convertZPositionRoadTo2dCoords(
      playerHorizontalDistanceFromCenter,
      segment.z2,
      currentZPosition,
      isLooped,
      trackLength,
    );

    context.fillStyle = segment.grassColor;
    context.fillRect(0, segment2D_2.y, canvas.width, segment2D_1.y - segment2D_2.y);
    const rumbleWidth1 = segment2D_1.w / 6;
    const rumbleWidth2 = segment2D_2.w / 6;

    // left rumble
    drawShape({
      x1: segment2D_1.x - segment2D_1.w - rumbleWidth1,
      y1: segment2D_1.y,
      x2: segment2D_1.x - segment2D_1.w,
      y2: segment2D_1.y,
      x3: segment2D_2.x - segment2D_2.w,
      y3: segment2D_2.y,
      x4: segment2D_2.x - segment2D_2.w - rumbleWidth2,
      y4: segment2D_2.y,
      color: segment.rumbleColor,
    });
    // right rumble
    drawShape({
      x1: segment2D_1.x + segment2D_1.w + rumbleWidth1,
      y1: segment2D_1.y,
      x2: segment2D_1.x + segment2D_1.w,
      y2: segment2D_1.y,
      x3: segment2D_2.x + segment2D_2.w,
      y3: segment2D_2.y,
      x4: segment2D_2.x + segment2D_2.w + rumbleWidth2,
      y4: segment2D_2.y,
      color: segment.rumbleColor,
    });
    // road
    drawShape({
      x1: segment2D_1.x - segment2D_1.w,
      y1: segment2D_1.y,
      x2: segment2D_1.x + segment2D_1.w,
      y2: segment2D_1.y,
      x3: segment2D_2.x + segment2D_2.w,
      y3: segment2D_2.y,
      x4: segment2D_2.x - segment2D_2.w,
      y4: segment2D_2.y,
      color: segment.roadColor,
    });

    if (segment.showLaneStripe) {
      const laneMarkerWidth1 = segment2D_1.w / 32;
      const laneMarkerWidth2 = segment2D_2.w / 32;
      const laneWidth1 = (segment2D_1.w * 2) / LANES;
      const laneWidth2 = (segment2D_2.w * 2) / LANES;
      let laneX1 = segment2D_1.x - segment2D_1.w + laneWidth1;
      let laneX2 = segment2D_2.x - segment2D_2.w + laneWidth2;
      for (let lane = 1; lane < LANES; lane++) {
        // Lane stripe
        drawShape({
          x1: laneX1 - laneMarkerWidth1 / 2,
          y1: segment2D_1.y,
          x2: laneX1 + laneMarkerWidth1 / 2,
          y2: segment2D_1.y,
          x3: laneX2 + laneMarkerWidth2 / 2,
          y3: segment2D_2.y,
          x4: laneX2 - laneMarkerWidth2 / 2,
          y4: segment2D_2.y,
          color: "white",
        });
        laneX1 += laneWidth1;
        laneX2 += laneWidth2;
      }
    }

    baseSegment = segments[Math.floor(currentZPosition / SEGMENT_LENGTH) % segments.length];
    // TODO render fog
  }

  // shake car more when going faster
  const shakeCarX = (speed / MAX_SPEED) * getRandom(-SHAKE_INTENSITY, SHAKE_INTENSITY);
  const shakeCarY = (speed / MAX_SPEED) * getRandom(-SHAKE_INTENSITY, SHAKE_INTENSITY);

  // Draw Car
  context.drawImage(getCarImage(), canvas.width / 2 - 100, canvas.height - 200, 200 + shakeCarX, 200 + shakeCarY);

  // Draw Distance and Speed indicators
  context.fillStyle = "white";
  context.font = "30px Arial";
  context.fillText("Speed: " + speed, 20, 100);
  context.fillText("Distance: " + currentZPosition, 20, 40);
}

/**
 * Helper functions
 */

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}
