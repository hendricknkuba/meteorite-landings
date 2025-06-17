import { fetchMeteoriteData } from "./dataHandler.js";
import { renderMeteoriteTable, updateSortIcons } from "./uiManager.js";
import { initMap } from "./map.js";

let allMeteorites = [];
let currentSort = { key: null, direction: 'asc' };
let currentDisplayedMeteorites = [];
let currentIndex = 0;
const batchSize = 100;

function renderBatch(data) {
  const slice = data.slice(currentIndex, currentIndex + batchSize);
  const tbody = document.querySelector("#meteoriteTable tbody");

  slice.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.id || ''}</td>
      <td>${item.name || ''}</td>
      <td>${item.year ? parseInt(item.year) : 'N/A'}</td>
      <td>${item.recclass || 'N/A'}</td>
    `;
    tbody.appendChild(tr);
  });

  currentIndex += batchSize;

  // Show and hide "Load More button"
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (currentIndex < data.length) {
    loadMoreBtn.style.display = "inline-block";
  } else {
    loadMoreBtn.style.display = "none";
  }
}

document.getElementById("loadMoreBtn").addEventListener("click", () => {
  renderBatch(currentDisplayedMeteorites);
  initMap(currentDisplayedMeteorites.slice(0, currentIndex));
});

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("loadingMessage").style.display = "block";
  try {
    const data = await fetchMeteoriteData();

    if (!data || data.length === 0) {
      throw new Error("No meteorite data available.");
    }

    allMeteorites = data;
    currentDisplayedMeteorites = [...allMeteorites];
    currentIndex = 0;

    // Clean table and display renderizar the first batch
    document.querySelector("#meteoriteTable tbody").innerHTML = "";
    renderBatch(currentDisplayedMeteorites);
    initMap(currentDisplayedMeteorites.slice(0, currentIndex));

    document.getElementById("loadingMessage").style.display = "none";
  } catch (error) {
    console.error("Failed to initialize app:", error);
    document.body.innerHTML = `
      <div style="padding: 2rem; color: red; text-align: center;">
        <h2>Could not load meteorite data.</h2>
        <p>Something went wrong. Please refresh the page or try again later.</p>
      </div>
    `;
    return;
  }

  // Filter by Year
  document.getElementById("filterYearBtn").addEventListener("click", () => {
    const minYear = parseInt(document.getElementById("minYear").value);
    const maxYear = parseInt(document.getElementById("maxYear").value);

    if (isNaN(minYear) || isNaN(maxYear)) {
      alert("Please enter valid numbers in both year fields.");
      return;
    }

    if (minYear > maxYear) {
      alert("Minimum year cannot be greater than maximum year.");
      return;
    }

    const filtered = allMeteorites.filter(m => {
      if (!m.year || isNaN(m.year)) return false;
      return m.year >= minYear && m.year <= maxYear;
    });

    currentDisplayedMeteorites = filtered;
    currentIndex = 0;

    document.querySelector("#meteoriteTable tbody").innerHTML = "";

    if (filtered.length === 0) {
      document.getElementById("tableInfo").style.display = "block";
      document.getElementById("tableInfo").textContent = `No meteorites found between ${minYear} and ${maxYear}.`;
      document.getElementById("loadMoreBtn").style.display = "none";
    } else {
      document.getElementById("tableInfo").style.display = "none";
      renderBatch(currentDisplayedMeteorites);
    }

    initMap(filtered.slice(0, currentIndex));
  });

  document.getElementById("resetFilterBtn").addEventListener("click", () => {
    document.getElementById("minYear").value = "";
    document.getElementById("maxYear").value = "";
    document.getElementById("tableInfo").style.display = "none";

    renderMeteoriteTable(allMeteorites);
    currentDisplayedMeteorites = [...allMeteorites];
    initMap(allMeteorites);
  });

  // Search by Name
  document.getElementById("searchNameBtn").addEventListener("click", () => {
    const searchTerm = document.getElementById("searchName").value.trim().toLowerCase();

    if (!searchTerm) {
      alert("Please enter a meteorite name to search.");
      return;
    }

    const result = allMeteorites.filter(m =>
      m.name && m.name.toLowerCase().includes(searchTerm)
    );

    if (result.length === 0) {
      document.getElementById("tableInfo").style.display = "block";
      document.getElementById("tableInfo").textContent = `No meteorites found with the name "${searchTerm}".`;
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

  // Sorting
  document.querySelectorAll("#meteoriteTable th[data-sort-key]").forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.sortKey;

      if (currentSort.key === key) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        currentSort.key = key;
        currentSort.direction = 'asc';
      }

      const sorted = sortMeteorites(currentDisplayedMeteorites, currentSort.key, currentSort.direction);
      currentDisplayedMeteorites = [...sorted];
      currentIndex = 0;
      document.querySelector("#meteoriteTable tbody").innerHTML = "";
      renderBatch(currentDisplayedMeteorites);
      updateSortIcons(currentSort);
      initMap(currentDisplayedMeteorites.slice(0, currentIndex));
    });
  });

  // Download filtered data
  document.getElementById("downloadDataBtn").addEventListener("click", () => {
    if (currentDisplayedMeteorites.length === 0) {
      alert("No data available to download.");
      return;
    }

    try {
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
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download file. Try again.");
    }
  });
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
      ? String(valA || '').localeCompare(String(valB || ''))
      : String(valB || '').localeCompare(String(valA || ''));
  });
}