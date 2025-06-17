export function renderMeteoriteTable(meteorites) {
  const tbody = document.querySelector("#meteoriteTable tbody");
  tbody.innerHTML = "";

  if (!meteorites || meteorites.length === 0) {
    document.getElementById("tableInfo").style.display = "block";
    return;
  }

  document.getElementById("tableInfo").style.display = "none";

  meteorites.forEach(meteorite => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${meteorite.id || "N/A"}</td>
      <td>${meteorite.name || "Unknown"}</td>
      <td>${meteorite.year ? parseInt(meteorite.year) : "N/A"}</td>
      <td>${meteorite.recclass || "N/A"}</td>
    `;

    tbody.appendChild(row);
  });
}
export function updateSortIcons(currentSort) {
  const headers = document.querySelectorAll('#meteoriteTable th[data-sort-key]');

  headers.forEach((th) => {
    const key = th.dataset.sortKey;
    const label = th.getAttribute('aria-label')?.split(' ')[2] || th.textContent.split(' ')[0]; // Fallback para nome limpo

    // Limpa o conteúdo anterior
    th.textContent = label;

    // Se for o header atual, adiciona ícone
    if (key === currentSort.key) {
      const arrow = currentSort.direction === 'asc' ? ' ▲' : ' ▼';
      th.textContent += arrow;
    }
  });
}
