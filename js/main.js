import { fetchMeteoriteData } from "./dataHandler.js";
import { renderMeteoriteTable } from "./uiManager.js";
import { initMap } from "./map.js"; 

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchMeteoriteData();

  const meteorites = data.slice(0, 100);

  renderMeteoriteTable(meteorites);
  initMap(meteorites);
  // Continua o fluxo: render map, render table, etc.
});
