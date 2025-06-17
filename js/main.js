import { fetchMeteoriteData } from "./dataHandler.js";
import { renderMeteoriteTable } from "./uiManager.js";
import { initMap } from "./map.js";

let allMeteorites = [];

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchMeteoriteData();

  const meteorites = data.slice(0, 100);

  allMeteorites = meteorites;

  renderMeteoriteTable(meteorites);
  initMap(meteorites);

  document.getElementById("filterYearBtn").addEventListener("click", () => {
    const minYear = parseInt(document.getElementById("minYear").value);
    const maxYear = parseInt(document.getElementById("maxYear").value);

    if (isNaN(minYear) || isNaN(maxYear)) {
      alert("Preencha os dois campos de ano corretamente.");
      return;
    }

    if (minYear > maxYear) {
      alert("Ano minimo nao pode ser maior que o ano maximo.");
      return;
    }

    const filtered = allMeteorites.filter((m) => {
      const rawYear = m.year;
      const year = parseInt(rawYear);
      return !isNaN(year) && year >= minYear && year <= maxYear;
    });

    renderMeteoriteTable(filtered);
    initMap(filtered);

  });

  document.getElementById("resetFilterBtn").addEventListener("click", () => {
    document.getElementById("minYear").value = "";
    document.getElementById("maxYear").value = "";

    renderMeteoriteTable(allMeteorites);
    initMap(allMeteorites);
  });
  // Continua o fluxo: render map, render table, etc.
});
