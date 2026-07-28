// === Seleksi Elemen DOM ===
const kartu = document.querySelectorAll(".kartu-permainan");
const skor = document.querySelector("#skor");
const status = document.querySelector("#status");
const mulaiLagi = document.querySelector(".mulailagi");
const menang = document.querySelector("#win");
const kondisi = document.querySelector(".kondisi");
const tombolBantuan = document.querySelectorAll(".tombol");

// === State ===
let kartuTerpilih;
let Bom = acak(kartu.length);
let nilai = 0;
let win = 0;
let namaPlayer = "";
let highscore = 0;

// === Audio ===
const audioFlip = new Audio("../media/suara/flipcard.mp3");
const audioBom = new Audio("../media/suara/Bom.mp3");
const audioWin1 = new Audio("../media/suara/win1.mp3");
const audioWin2 = new Audio("../media/suara/win2.mp3");
const audioLose1 = new Audio("../media/suara/kalah1.mp3");
const audioLose2 = new Audio("../media/suara/kalah2.mp3");

function suaraFlip() {
  audioFlip.currentTime = 0;
  audioFlip.play();
}

function suaraBom() {
  audioBom.volume = 0.4;
  audioBom.currentTime = 0;
  audioBom.play();
}

function suaraMenang() {
  audioWin1.currentTime = 0;
  audioWin1.play();
  setTimeout(() => {
    audioWin2.currentTime = 0;
    audioWin2.play();
  }, 600);
}
function suaraKalah() {
  audioLose1.currentTime = 0;
  audioLose1.play();
  setTimeout(() => {
    audioLose2.currentTime = 0;
    audioLose2.play();
  }, 600);
}
// === Utility ===
function acak(panjang) {
  return Math.floor(Math.random() * panjang);
}

function onClass(elemen, ...kelas) {
  elemen.classList.add(...kelas);
}

function offClass(elemen, ...kelas) {
  elemen.classList.remove(...kelas);
}

function blinkKelas(elemen, kelas, durasi = 500) {
  onClass(elemen, kelas);
  setTimeout(() => offClass(elemen, kelas), durasi);
}

function tampilKondisi(pesanStatus, kelasStatus, pesanTombol) {
  onClass(kondisi, "muncul", kelasStatus);
  onClass(status, kelasStatus);
  status.textContent = pesanStatus;
  mulaiLagi.textContent = pesanTombol;
  onClass(mulaiLagi, "muncul");
}

// === Storage ===
function simpanData() {
  localStorage.setItem("darbom_nama", namaPlayer);
  localStorage.setItem("darbom_highscore", highscore);
}

function muatData() {
  namaPlayer = localStorage.getItem("darbom_nama") || "";
  highscore = parseInt(localStorage.getItem("darbom_highscore")) || 0;
}

// === Modal Nama ===
function buatModal() {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal-nama";
  modal.innerHTML = `
    <h2>Siapa Namamu?</h2>
    <input type="text" id="input-nama" placeholder="Masukkan nama..." maxlength="20" />
    <button id="tombol-mulai">Mulai Main</button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const inputNama = modal.querySelector("#input-nama");
  const tombolMulai = modal.querySelector("#tombol-mulai");

  inputNama.focus();

  function konfirmasiNama() {
    const nama = inputNama.value.trim();
    if (!nama) return;
    namaPlayer = nama || "Player";
    simpanData();
    document.body.removeChild(overlay);
    updateNama();
  }

  tombolMulai.addEventListener("click", konfirmasiNama);
  inputNama.addEventListener("keydown", (e) => {
    if (e.key === "Enter") konfirmasiNama();
  });
}

function updateNama() {
  const elNama = document.querySelector("#nama-player");
  if (elNama) elNama.textContent = namaPlayer || "Nama Anda";
}

function updateHighscore() {
  const elHighscore = document.querySelector("#highscore");
  if (elHighscore) elHighscore.textContent = highscore;
}

function updateSkor() {
  skor.textContent = nilai;
  simpanData();
}

function updateWin() {
  menang.textContent = win;
  simpanData();
}

// === Logika Permainan ===
function cekMenang() {
  const kartuBagus = document.querySelectorAll("[data-open]");
  return kartuBagus.length === kartu.length - 1;
}

function cekBom(elemen) {
  return elemen.getAttribute("data-i") === `kartu-${Bom + 1}`;
}

function iniBom(target) {
  suaraBom();
  setTimeout(() => {
    suaraKalah();
  }, 1000);
  target.style.backgroundImage = "url(../media/Bom.webp)";
  kartu.forEach((card) => onClass(card, "kunci"));
  nilai = nilai - 1;
  tampilKondisi("Yah Kamu Kalah", "kalah", "Coba Lagi");
}

function tampilKartu(target, indeks) {
  onClass(target, "flip");
  target.style.backgroundImage = `url(../media/kartu/${indeks + 1}.webp)`;
}

function tutupKartu(target) {
  offClass(target, "flip");
  target.style.backgroundImage = "url(../media/backcard.webp)";
}

function bukanBom(target, indeks) {
  tampilKartu(target, indeks);
  target.setAttribute("data-open", `op${indeks}`);
  nilai = nilai + 1;
  updateSkor();
  if (cekMenang()) {
    return "menang";
  }
}

function Menang() {
  suaraMenang();
  win = win + 1;
  if (nilai > highscore) {
    highscore = nilai;
    updateHighscore();
  }
  updateWin();
  tampilKondisi("Selamat Kamu Menang", "menang", "Mulai Lagi");
}

function reset() {
  kartu.forEach((card) => {
    offClass(card, "kunci", "flip");
    card.removeAttribute("data-open");
    card.style.backgroundImage = "url(../media/backcard.webp)";
  });
  offClass(status, "kalah", "menang");
  status.textContent = "";
  mulaiLagi.textContent = " ";
  offClass(mulaiLagi, "muncul");
  offClass(kondisi, "muncul", "kalah", "menang");
  Bom = acak(kartu.length);
  updateSkor();
}

// === Handler Kartu ===
function handleKlikKartu(e, indeks) {
  suaraFlip();
  onClass(e.target, "flip");
  setTimeout(() => {
    if (!cekBom(e.target)) {
      const winning = bukanBom(e.target, indeks);
      if (winning) Menang();
    } else {
      iniBom(e.target);
    }
    onClass(e.target, "kunci");
  }, 500);
}

function initKartu() {
  kartu.forEach((card, indeks) => {
    card.setAttribute("data-i", `kartu-${indeks + 1}`);
    card.addEventListener("click", (e) => handleKlikKartu(e, indeks));
  });
  updateSkor();
  updateWin();
}

// === Handler Bantuan ===
function cariKartuAman() {
  const belumBuka = document.querySelectorAll(
    ".kartu-permainan:not([data-open])",
  );
  const aman = [...belumBuka].filter((kT) => {
    const adaBom = cekBom(kT);
    console.log(adaBom + ` kartu-${Bom + 1}`);
    return !adaBom;
  });
  return aman[acak(aman.length)];
}

function handleLihat() {
  const belumBuka = document.querySelectorAll(
    ".kartu-permainan:not([data-open])",
  );
  belumBuka.forEach((card) => {
    const nomorKartu =
      parseInt(card.getAttribute("data-i").replace("kartu-", "")) - 1;
    onClass(card, "flip", "kunci");
    setTimeout(() => {
      if (cekBom(card)) {
        card.style.backgroundImage = "url(../media/Bom.webp)";
      } else {
        tampilKartu(card, nomorKartu);
      }
      setTimeout(() => {
        tutupKartu(card);
        offClass(card, "kunci");
      }, 1500);
    }, 500);
  });
}

function handleLihatBom() {
  const kartuBom = [...kartu].find(
    (card) => cekBom(card) && !card.hasAttribute("data-open"),
  );
  if (!kartuBom) return;
  onClass(kartuBom, "flip", "kunci");
  setTimeout(() => {
    kartuBom.style.backgroundImage = "url(../media/Bom.webp)";
    setTimeout(() => {
      tutupKartu(kartuBom);
      offClass(kartuBom, "kunci");
    }, 500);
  }, 500);
}

function handleKlue() {
  const bomIndex = Bom + 1;
  const barisBom = Math.ceil(bomIndex / 3);
  const kolomBom = bomIndex % 3 === 0 ? 3 : bomIndex % 3;
  const pakaiBaris = acak(2) === 0;

  const kandidat = pakaiBaris
    ? [bomIndex - 2, bomIndex - 1, bomIndex, bomIndex + 1, bomIndex + 2]
    : [bomIndex - 6, bomIndex - 3, bomIndex, bomIndex + 3, bomIndex + 6];

  kartu.forEach((card) => {
    const dataI = parseInt(card.getAttribute("data-i").replace("kartu-", ""));
    if (!kandidat.includes(dataI)) return;

    const baris = Math.ceil(dataI / 3);
    const kolom = dataI % 3 === 0 ? 3 : dataI % 3;

    const satuBaris = baris === barisBom;
    const satuKolom = kolom === kolomBom;

    if ((pakaiBaris && satuBaris) || (!pakaiBaris && satuKolom)) {
      blinkKelas(card, "help-blink");
    }
  });
}

function handleKlikBantuan(btn) {
  kartuTerpilih = cariKartuAman();
  if (btn.classList.contains("tanda") && kartuTerpilih) {
    blinkKelas(kartuTerpilih, "help-blink");
  }
  if (btn.classList.contains("lihat")) {
    handleLihatBom();
  }
  if (btn.classList.contains("kilat")) {
    handleLihat();
  }
  if (btn.classList.contains("klue")) {
    handleKlue();
  }
}

function initBantuan() {
  tombolBantuan.forEach((btn) => {
    btn.addEventListener("click", () => handleKlikBantuan(btn));
  });
}

// === Inisialisasi ===
function init() {
  muatData();
  initKartu();
  initBantuan();
  mulaiLagi.addEventListener("click", () => reset());
  updateSkor();
  updateWin();
  updateHighscore();
  if (!namaPlayer) {
    buatModal();
  } else {
    updateNama();
  }
}

init();
