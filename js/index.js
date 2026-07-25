const kartu = document.querySelectorAll(".kartu-permainan");
const skor = document.querySelector("#skor");
console.log(kartu);
const Bom = Math.floor(Math.random() * kartu.length);
let nilai = 0;
function iniBom(target) {
  target.style.backgroundImage = "url(../media/Bom.webp)";
  nilai = Math.floor(nilai / 2);
}

function bukanBom(target, indeks) {
  target.style.backgroundImage = `url(../media/kartu/${indeks}.webp)`;
  nilai = nilai + 1;
}

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
