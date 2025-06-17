import { fetchMeteoriteData } from "./dataHandler.js";
import { renderMeteoriteTable } from "./uiManager.js";
import { initMap } from "./map.js";
import { updateSortIcons } from "./uiManager.js";

let allMeteorites = [];
let currentSort = { key: null, direction: 'asc' };
let currentDisplayedMeteorites = [];

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchMeteoriteData();

  const meteorites = data.slice(0, 100);

  allMeteorites = meteorites;

  renderMeteoriteTable(meteorites);
  currentDisplayedMeteorites = [...meteorites];
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
    currentDisplayedMeteorites = [...filtered];
    initMap(filtered);

  });

  document.getElementById("resetFilterBtn").addEventListener("click", () => {
    document.getElementById("minYear").value = "";
    document.getElementById("maxYear").value = "";

    renderMeteoriteTable(allMeteorites);
    currentDisplayedMeteorites = [...allMeteorites];
    initMap(allMeteorites);
  });

  document.getElementById("searchNameBtn").addEventListener("click", () => {
    const searchTerm = document.getElementById("searchName").value.trim().toLowerCase();

    if (!searchTerm) {
      alert("Digite um nome para busca.");
      return;
    }

    const result = allMeteorites.filter((m) =>
      m.name && m.name.toLowerCase().includes(searchTerm)
    );

    if (result.length === 0) {
      document.getElementById("tableInfo").style.display = "block";
      document.getElementById("tableInfo").textContent = `Nenhum meteorito encontrado com o nome "${searchTerm}".`;
    } else {
      document.getElementById("tableInfo").style.display = "none";
    }

    renderMeteoriteTable(result);
    currentDisplayedMeteorites = [...result];
    initMap(result);
  });

  document.getElementById("resetSearchBtn").addEventListener("click", () => {
    document.getElementById("searchName").value = "";
    document.getElementById("tableInfo").style.display = "none";
    renderMeteoriteTable(allMeteorites);
    currentDisplayedMeteorites = [...allMeteorites];
    initMap(allMeteorites);
  });
  // Continua o fluxo: render map, render table, etc.
});

function sortMeteorites(data, key, direction = 'asc') {
  return data.slice().sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (!isNaN(parseFloat(valA)) && !isNaN(parseFloat(valB))) {
      return direction === 'asc'
        ? parseFloat(valA) - parseFloat(valB)
        : parseFloat(valB) - parseFloat(valA);
    }

    return direction === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });
}

document.querySelectorAll("#meteoriteTable th[data-sort-key]").forEach((th) => {
  th.addEventListener('click', () => {
    const key = th.dataset.sortKey;

    if (currentSort.key === key) {
      // Toggle direction
      currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.key = key;
      currentSort.direction = 'asc';
    }

    const sorted = sortMeteorites(allMeteorites, currentSort.key, currentSort.direction);
    renderMeteoriteTable(sorted);
    currentDisplayedMeteorites = [...sorted];
    updateSortIcons(currentSort);
  });
});

document.getElementById("downloadDataBtn").addEventListener("click", () => {
  if (currentDisplayedMeteorites.length === 0) {
    alert("Nenhum dado disponível para download.");
    return;
  }

  const jsonString = JSON.stringify(currentDisplayedMeteorites, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  const timestamp = new Date().toISOString().split("T")[0];
  a.href = url;
  a.download = `meteorites_filtered_${timestamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

