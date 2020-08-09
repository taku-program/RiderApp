// 初期化 =====================
let dialog = document.getElementById("dialog");
let can = document.createElement("canvas");
let ctx = can.getContext("2d");
can.width = 500;
can.height = 350;

let size = 14;
let t = 0;
let speed = 0;
let playing = true;
let k = {ArrowUp: 0, ArrowDown: 0, ArrowLeft: 0, ArrowRight: 0};
// 閉じタグ直前に要素を追加
document.body.appendChild(can);
can.style.zIndex = "0";

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
  this.rSpeed = 0;
  this.img = new Image();
  this.img.src = "img/moto.png";  //HTMLファイル基準パス

  this.draw = function() {
    let p1 = can.height - noise(t + this.x) * 0.25;
    let p2 = can.height - noise(t + 5 + this.x) * 0.25;

    let grounded = 0;

    if (p1 - size > this.y) {
      this.ySpeed += 0.1;
    } else {
      this.ySpeed -= this.y - (p1 - size);
      this.y = p1 - size;

      grounded = 1;
    }

    if (!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5){
      playing = false;
      this.rSpeed = 5;
      k.ArrowUp = 1;
      this.x -= speed * 5;
      // if (this.x < -size)gameContinue();
    }

    let angle = Math.atan2((p2 - size) - this.y, (this.x + 5) - this.x);

    this.y += this.ySpeed;

    if (grounded && playing) {
      this.rot -= (this.rot - angle) * 0.5;
      this.rSpeed = this.rSpeed - (angle - this.rot);
    }

    this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.1;
    this.rot -= this.rSpeed * 0.05;

    if(this.rot > Math.PI) this.rot = -Math.PI;
    if(this.rot < -Math.PI) this.rot = Math.PI;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.drawImage(this.img, -size, -size, 30, 30);
    ctx.restore();
  }
}

// 画面描画処理 ===============
function loop() {
  speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.01;
  t += 5 * speed + 1;
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

// キーボード処理 =============
onkeydown = d => k[d.key] = 1;
onkeyup = d => k[d.key] = 0;

// ループ処理実行 =============
loop();

// // コンテニュー処理 ===========
// function gameContinue() {
//   dialog.style.zIndex = "1";
//   dialog.style.display = "block";
//   dialog.style.display = "none";
// }