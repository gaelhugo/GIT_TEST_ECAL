const scene = document.querySelector(".scene");
const cercleNet = document.querySelector(".net");

scene.addEventListener("mousemove", function (evenement) {
  const cadre = scene.getBoundingClientRect();
  const x = evenement.clientX - cadre.left;
  const y = evenement.clientY - cadre.top;

  cercleNet.style.setProperty("--x", x + "px");
  cercleNet.style.setProperty("--y", y + "px");
});

scene.addEventListener("mouseleave", function () {
  cercleNet.style.setProperty("--x", "-9999px");
  cercleNet.style.setProperty("--y", "-9999px");
});
