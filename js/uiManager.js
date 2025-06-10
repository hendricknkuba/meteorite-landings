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
      <td>${meteorite.year ? new Date(meteorite.year).getFullYear() : "N/A"}</td>
      <td>${meteorite.recclass || "N/A"}</td>
    `;

    tbody.appendChild(row);
  });
}