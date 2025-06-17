export function renderMeteoriteTable(data) {
  const tbody = document.querySelector("#meteoriteTable tbody");
  tbody.innerHTML = ""; // limpa de uma vez

  const fragment = document.createDocumentFragment();

  data.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.year ? parseInt(item.year) : "N/A"}</td>
      <td>${item.recclass || "N/A"}</td>
    `;
    fragment.appendChild(tr);
  });

  tbody.appendChild(fragment);

  const infoMsg = document.getElementById("tableInfo");
  infoMsg.style.display = data.length === 0 ? "block" : "none";
}


export function updateSortIcons(currentSort) {
  const headers = document.querySelectorAll('#meteoriteTable th[data-sort-key]');
  if (!headers.length) {
    console.warn("Cabeçalhos da tabela não encontrados.");
    return;
  }

  headers.forEach((th) => {
    const key = th.dataset.sortKey;
    const label = th.getAttribute('aria-label')?.split(' ')[2] || th.textContent.split(' ')[0];

    th.textContent = label;

    if (currentSort && key === currentSort.key) {
      const arrow = currentSort.direction === 'asc' ? ' ▲' : ' ▼';
      th.textContent += arrow;
    }
  });
}
