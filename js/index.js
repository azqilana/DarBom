const kartu = document.querySelectorAll(".kartu-permainan");
const skor = document.querySelector("#skor");
const status = document.querySelector("#status");
const mulaiLagi = document.querySelector("#mulailagi");
const menang = document.querySelector("#win");
const kondisi = document.querySelector(".kondisi");
console.log(kartu);
let Bom = acak();
let nilai = 0;
let win = 0;
function acak() {
  return Math.floor(Math.random() * kartu.length);
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
  if (kartuBagus.length === kartu.length - 1) {
    kondisi.style.zIndex = "1";
    kondisi.style.opacity = "1";
    status.classList.add("menang");
    status.textContent = "Selamat Kamu menang";
    mulaiLagi.textContent = "Mulai Lagi";
    mulaiLagi.style.opacity = "1";
    win = win + 1;
  }
}
function reset() {
  kartu.forEach((card) => {
    card.style.pointerEvents = "auto";
    card.removeAttribute("data-open");
    card.style.backgroundImage = "url(../media/backcard.webp)";
  });
  status.classList.remove("kalah");
  status.classList.remove("menang");
  status.textContent = "";
  mulaiLagi.textContent = " ";
  mulaiLagi.style.opacity = "0";
  kondisi.style.zIndex = "-1";
  kondisi.style.opacity = "0";
  Bom = acak();
  nilai = 0;
  skor.textContent = nilai;
}
mulaiLagi.addEventListener("click", () => reset());
kartu.forEach((card, indeks) => {
  card.addEventListener("click", (e) => {
    if (indeks === Bom) {
      iniBom(e.target);
    } else {
      bukanBom(e.target, indeks);
    }
    e.target.style.pointerEvents = "none";
    skor.textContent = nilai;
    menang.textContent = win;
  });
});
