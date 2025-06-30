let tshirtImg = new Image();
tshirtImg.crossOrigin = "anonymous";
tshirtImg.src = 'https://i.imgur.com/20UlCw0.png'; // Default putih
tshirtImg.onload = function () {
  draw(); // Panggil pertama kali saat gambar sudah siap
};

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let img = null;
let imgX = 125, imgY = 160;
let imgWidth = 205, imgHeight = 300;
let scale = 1;
let rotation = 0;
let isDragging = false;
let offsetX, offsetY;

const shirtColorSelect = document.getElementById('shirtColor');
let shirtColor = shirtColorSelect.value;

// Update warna kaos jika diganti
shirtColorSelect.addEventListener('change', () => {
  const color = shirtColorSelect.value;

  const colorMap = {
    white: 'https://i.imgur.com/20UlCw0.png',
    black: 'https://i.imgur.com/eEoQ167.png',
    red: 'https://i.imgur.com/L5UakIc.png',
    blue: 'https://i.imgur.com/1W1AQZe.png',
    green: 'https://i.imgur.com/eysCuVA.png'
  };

  tshirtImg.src = colorMap[color];
  tshirtImg.onload = draw; // pastikan gambar selesai dulu sebelum draw
});



// Upload gambar desain
document.getElementById('upload').addEventListener('change', function (e) {
  const reader = new FileReader();
  reader.onload = function (event) {
    img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      reset();
      draw();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

function draw() {
  if (!tshirtImg.complete) return; // tunggu gambar siap

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tshirtImg, 0, 0, canvas.width, canvas.height);

  if (img) {
    ctx.save();
    ctx.translate(imgX + (imgWidth * scale) / 2, imgY + (imgHeight * scale) / 2);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.drawImage(img, -(imgWidth * scale) / 2, -(imgHeight * scale) / 2, imgWidth * scale, imgHeight * scale);
    ctx.restore();
  }
}


// Drag gambar
canvas.addEventListener('mousedown', function (e) {
  const rect = canvas.getBoundingClientRect();
  offsetX = e.clientX - rect.left - imgX;
  offsetY = e.clientY - rect.top - imgY;
  isDragging = true;
});

canvas.addEventListener('mousemove', function (e) {
  if (isDragging && img) {
    const rect = canvas.getBoundingClientRect();
    imgX = e.clientX - rect.left - offsetX;
    imgY = e.clientY - rect.top - offsetY;
    draw();
  }
});

canvas.addEventListener('mouseup', () => isDragging = false);
canvas.addEventListener('mouseleave', () => isDragging = false);

// 👆 Tambahan: dukungan layar sentuh untuk HP
canvas.addEventListener('touchstart', function(e) {
  if (!img) return;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  offsetX = touch.clientX - rect.left - imgX;
  offsetY = touch.clientY - rect.top - imgY;
  isDragging = true;
});

canvas.addEventListener('touchmove', function(e) {
  if (!isDragging || !img) return;
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  imgX = touch.clientX - rect.left - offsetX;
  imgY = touch.clientY - rect.top - offsetY;
  draw();
}, { passive: false });

canvas.addEventListener('touchend', function(e) {
  isDragging = false;
});

canvas.addEventListener('touchcancel', function(e) {
  isDragging = false;
});


// Zoom gambar dengan scroll
canvas.addEventListener('wheel', function (e) {
  e.preventDefault();
  if (e.deltaY < 0) zoomIn();
  else zoomOut();
});

function zoomIn() {
  scale += 0.1;
  draw();
}

function zoomOut() {
  scale = Math.max(0.1, scale - 0.1);
  draw();
}

function rotate() {
  rotation += 15;
  draw();
}

function reset() {
  imgX = 125;
  imgY = 160;
  imgWidth = 205;
  imgHeight = 300;
  scale = 1;
  rotation = 0;
  draw();
}

function screenshotDesign() {
  try {
    draw(); // pastikan canvas digambar ulang
    const dataURL = canvas.toDataURL("image/png");

    if (!dataURL || dataURL.length < 1000) {
      alert("Gagal mengambil screenshot. Pastikan gambar kaos dan desain sudah termuat dengan benar.");
      return;
    }

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = "desain-kaos.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    alert("Screenshot gagal: " + e.message);
  }
}


function updateWhatsAppLink() {
  const message = encodeURIComponent(
    "Halo, saya ingin pesan kaos custom.\n\n" +
    "Berikut ini informasi saya:\n" +
    "Nama: [Tulis nama Anda]\n" +
    "Alamat lengkap: [Tulis alamat lengkap Anda]\n" +
    "Email: [Email Anda]\n" +
    "Nomor HP: [Nomor Anda]\n" +
    "Saya juga akan kirim bukti transfer & desain dalam pesan ini.\n\n" +
    "💳 Info Transfer:\n" +
    "Bank: SeaBank\n" +
    "No. Rekening: 901253844232\n" +
    "Atas Nama: RYAN FENDI WARDANA\n"
  );
  const waURL = "https://wa.me/6285601817789?text=" + message;
  document.getElementById('waButton').href = waURL;
}

updateWhatsAppLink(); // panggil sekali saat semua siap

// Tambahan: dukungan layar sentuh untuk drag gambar di canvas
let lastTouchX = 0;
let lastTouchY = 0;

canvas.addEventListener('touchstart', function(e) {
  if (img) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    lastTouchX = touch.clientX - rect.left;
    lastTouchY = touch.clientY - rect.top;
    isDragging = true;
    offsetX = lastTouchX - imgX;
    offsetY = lastTouchY - imgY;
  }
});

canvas.addEventListener('touchmove', function(e) {
  if (isDragging && img) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    imgX = touch.clientX - rect.left - offsetX;
    imgY = touch.clientY - rect.top - offsetY;
    draw();
  }
}, { passive: false });

canvas.addEventListener('touchend', function(e) {
  isDragging = false;
});
