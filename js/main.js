import { fetchMeteoriteData } from "./dataHandler.js";

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchMeteoriteData();
  console.log("CHEGANDO AQUI");
  // Continua o fluxo: render map, render table, etc.
});
