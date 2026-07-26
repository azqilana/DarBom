const kartu = document.querySelectorAll(".kartu-permainan");
const skor = document.querySelector("#skor");
const status = document.querySelector("#status");
const mulaiLagi = document.querySelector("#mulailagi");
console.log(kartu);
const Bom = Math.floor(Math.random() * kartu.length);
let nilai = 0;
function iniBom(target) {
  target.style.backgroundImage = "url(../media/Bom.webp)";
  kartu.forEach((card) => (card.style.pointerEvents = "none"));
  nilai = Math.floor(nilai / 2);
  status.classList.add("kalah");
  status.textContent = "Yah Kamu Kalah";
  mulaiLagi.textContent = "Coba Lagi";
  mulaiLagi.style.opacity = "1";
}

function bukanBom(target, indeks) {
  target.style.backgroundImage = `url(../media/kartu/${indeks}.webp)`;
  target.setAttribute("data-open", `op${indeks}`);
  const kartuBagus = document.querySelectorAll("[data-open]");
  nilai = nilai + 1;
  if (kartuBagus.length === kartu.length - 1) {
    status.classList.add("menang");
    status.textContent = "Selamat Kamu menang";
    mulaiLagi.textContent = "Mulai Lagi";
    mulaiLagi.style.opacity = "1";
  }
}
mulaiLagi.addEventListener("click", (e) => {
  location.reload();
});
kartu.forEach((card, indeks) => {
  card.addEventListener("click", (e) => {
    if (indeks === Bom) {
      iniBom(e.target);
    } else {
      bukanBom(e.target, indeks);
    }
    e.target.style.pointerEvents = "none";
    skor.textContent = nilai;
  });
});
