// 初期化 =====================
let can = document.createElement("canvas");
let ctx = can.getContext("2d");
can.width = 500;
can.height = 350;

let t = 0;
// 閉じタグ直前に要素を追加
document.body.appendChild(can);

// 地面定義 ===================
let perm = [];

while (perm.length < 255) {
  while (perm.includes(val = Math.floor(Math.random() * 255)));
  perm.push(val);
}

let lerp = (a, b, t) => a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2;

let noise = x => {
  x = x * 0.01% 255;
  return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
}

// プレイヤー =================
let player = new function() {
  this.x = can.width / 2;
  this.y = 0;
  this.ySpeed = 0;
  this.rot = 0;

  this.img = new Image();
  this.img.src = "img/moto.png";  //HTMLファイル基準パス

  this.draw = function() {
    let p1 = can.height - noise(t + this.x) * 0.25;

    if (p1 - 15 > this.y) {
      this.ySpeed -= 0.1;
    } else {
      this.y = p1 - 14;
      this.ySpeed = 0;
    }

    this.y -= this.ySpeed;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.drawImage(this.img, -15, -15, 30, 30);
    ctx.restore();
  }
}

// 画面描画処理 ===============
function loop() {

  t += 1;
  ctx.fillStyle = "#19f";
  ctx.fillRect(0, 0, can.width, can.height);

  ctx.fillStyle = "black";

  ctx.beginPath();
  
  ctx.moveTo(0, can.height);

  for (let i = 0; i < can.width; i++) {
    ctx.lineTo(i, can.height - noise(t + i) * 0.25);
  }

  ctx.lineTo(can.width, can.height);
  
  ctx.fill();
  
  player.draw();

  requestAnimationFrame(loop);
}

// ループ処理実行 =============
loop();