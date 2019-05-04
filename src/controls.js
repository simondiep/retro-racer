import {
  FPS,
  MAX_SPEED,
  ACCEL_SPEED,
  BREAKING_SPEED,
  DECEL_SPEED,
  OFFROAD_DECEL_SPEED,
  OFFROAD_MAX_SPEED,
} from "./config.js";

const KEY_PRESSED = {
  UP: false,
  DOWN: false,
  LEFT: false,
  RIGHT: false,
};

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

export function getCarImage() {
  if (KEY_PRESSED.LEFT) {
    return carTurnLeftImage;
  } else if (KEY_PRESSED.RIGHT) {
    return carTurnRightImage;
  }
  return carImage;
}

export function calculateNewPlayerHorizontalPosition(currentXPos, speed) {
  let newXPos = currentXPos;
  const dx = (1 / FPS) * 2 * (speed / MAX_SPEED);
  if (KEY_PRESSED.LEFT) {
    newXPos = newXPos - dx;
  } else if (KEY_PRESSED.RIGHT) {
    newXPos = newXPos + dx;
  }

  // Limit how far in each direction you can be
  if (newXPos > 2) {
    newXPos = 2;
  } else if (newXPos < -2) {
    newXPos = -2;
  }
  return newXPos;
}

export function calculateNewSpeed(currentXPos, currentSpeed) {
  let newSpeed = currentSpeed;
  if (KEY_PRESSED.UP) newSpeed = newSpeed + ACCEL_SPEED / FPS;
  else if (KEY_PRESSED.DOWN) newSpeed = newSpeed + BREAKING_SPEED / FPS;
  else newSpeed = newSpeed + DECEL_SPEED / FPS;

  // offroad
  if ((currentXPos < -1 || currentXPos > 1) && newSpeed > OFFROAD_MAX_SPEED) {
    newSpeed = newSpeed + OFFROAD_DECEL_SPEED / FPS;
  }

  if (newSpeed < 0) {
    newSpeed = 0;
  } else if (newSpeed > MAX_SPEED) {
    newSpeed = MAX_SPEED;
  }
  return newSpeed;
}

function keyDownHandler(event) {
  switch (event.keyCode) {
    case 65: //Left(a)
      KEY_PRESSED.LEFT = true;
      break;
    case 68: //Right(d)
      KEY_PRESSED.RIGHT = true;
      break;
    case 83: //Down(s)
      KEY_PRESSED.DOWN = true;
      break;
    case 87: //Up(w)
      KEY_PRESSED.UP = true;
      break;
  }
}

function keyUpHandler(event) {
  switch (event.keyCode) {
    case 65: //Left(a)
      KEY_PRESSED.LEFT = false;
      break;
    case 68: //Right(d)
      KEY_PRESSED.RIGHT = false;
      break;
    case 83: //Down(s)
      KEY_PRESSED.DOWN = false;
      break;
    case 87: //Up(w)
      KEY_PRESSED.UP = false;
      break;
  }
}
