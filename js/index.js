const kartu = document.querySelectorAll(".kartu-permainan");
const skor = document.querySelector("#skor");
const status = document.querySelector("#status");
const mulaiLagi = document.querySelector("#mulailagi");
const menang = document.querySelector("#win");
const kondisi = document.querySelector(".kondisi");
const tombolBantuan = document.querySelectorAll(".tombol");
let kartuTerpilih;
let Bom = acak(kartu.length);
let nilai = 0;
let win = 0;
function acak(panjang) {
  return Math.floor(Math.random() * panjang);
}
function iniBom(target) {
  target.style.backgroundImage = "url(../media/Bom.webp)";
  kartu.forEach((card) => (card.style.pointerEvents = "none"));
  nilai = Math.floor(nilai / 2);
  status.classList.add("kalah");
  kondisi.style.zIndex = "1";
  kondisi.style.opacity = "1";
  status.textContent = "Yah Kamu Kalah";
  mulaiLagi.textContent = "Coba Lagi";
  mulaiLagi.style.opacity = "1";
}

function bukanBom(target, indeks) {
  target.style.backgroundImage = `url(../media/kartu/${indeks + 1}.webp)`;
  target.setAttribute("data-open", `op${indeks}`);
  const kartuBagus = document.querySelectorAll("[data-open]");
  nilai = nilai + 1;
  skor.textContent = nilai;
  if (kartuBagus.length === kartu.length - 1) {
    return "menang";
  }
}
function reset() {
  kartu.forEach((card) => {
    card.style.pointerEvents = "auto";
    card.removeAttribute("data-open");
    card.style.backgroundImage = "url(../media/backcard.webp)";
    card.style.transform = "none";
  });
  status.classList.remove("kalah");
  status.classList.remove("menang");
  status.textContent = "";
  mulaiLagi.textContent = " ";
  mulaiLagi.style.opacity = "0";
  kondisi.style.zIndex = "-1";
  kondisi.style.opacity = "0";
  Bom = acak(kartu.length);
  nilai = 0;
  skor.textContent = nilai;
}
function Menang() {
  kondisi.style.zIndex = "1";
  kondisi.style.opacity = "1";
  status.classList.add("menang");
  status.textContent = "Selamat Kamu menang";
  mulaiLagi.textContent = "Mulai Lagi";
  mulaiLagi.style.opacity = "1";
  win = win + 1;
  menang.textContent = win;
}
mulaiLagi.addEventListener("click", () => reset());
kartu.forEach((card, indeks) => {
  card.setAttribute("data-i", `kartu-${indeks + 1}`);
  let winning;
  card.addEventListener("click", (e) => {
    e.target.style.transform = "rotateY(180deg)";
    setTimeout(() => {
      if (indeks === Bom) {
        iniBom(e.target);
      } else {
        winning = bukanBom(e.target, indeks);
        if (winning) {
          Menang();
        }
      }
    }, 500);
    e.target.style.pointerEvents = "none";
  });
  menang.textContent = win;
  skor.textContent = nilai;
});

tombolBantuan.forEach((btn, indeks) => {
  function cekTombol(tbl) {
    return btn.classList.contains(tbl);
  }

  btn.addEventListener("click", () => {
    const belumBuka = document.querySelectorAll(
      ".kartu-permainan:not([data-open])",
    );
    kartuTerpilih = [...belumBuka];
    kartuTerpilih = kartuTerpilih.filter((kT) => {
      const cekBom = kT.getAttribute("data-i");
      const bukanBom = cekBom !== `kartu-${Bom + 1}`;
      const iniBom = cekBom === `kartu-${Bom + 1}`;
      console.log(iniBom + ` kartu-${Bom + 1}`);
      return bukanBom;
    });
    const cekTerpilih = acak(kartuTerpilih.length);
    kartuTerpilih = kartuTerpilih[cekTerpilih];
    if (cekTombol("tanda")) {
      kartuTerpilih.classList.add("help-blink");
    }
  });
});
