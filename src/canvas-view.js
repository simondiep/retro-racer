const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

export function drawIntroScreen() {
  context.fillStyle = "#72D7EE";
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawText(canvas.width / 2, canvas.height / 3, "#dbfaff", "Retro Racer");
  drawText(canvas.width / 2, (canvas.height * 2) / 3, "#fffbbc", "Hold 'W' to accelerate", 36);
  drawText(canvas.width / 2, (canvas.height * 3) / 4, "#fffbbc", "Press 'A' or 'D' to turn", 36);
  drawText(canvas.width / 2, (canvas.height * 5) / 6, "#dbdbdb", "Press any key to begin", 24);
}

export function drawShape(shape) {
  const { x1, y1, x2, y2, x3, y3, x4, y4, color } = shape;
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineTo(x3, y3);
  context.lineTo(x4, y4);
  context.closePath();
  context.fill();
}

function drawText(centerX, centerY, color, text, fontSize = 72) {
  context.save();
  context.lineWidth = 5;
  context.strokeStyle = "black";
  context.fillStyle = color;
  context.font = `bold ${fontSize}px Arial`;

  const textWidth = context.measureText(text).width;
  const textHeight = 24;
  let x = centerX - textWidth / 2;
  let y = centerY + textHeight / 2;

  context.strokeText(text, x, y);
  context.fillText(text, x, y);
  context.restore();
}
