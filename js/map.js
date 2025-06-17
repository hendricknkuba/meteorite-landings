// map.js
let map;

export async function initMap(meteoriteData = []) {
  // Carregar as bibliotecas necessárias
  const { Map, InfoWindow } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker")

  // Inicializar o mapa
  map = new Map(document.getElementById("map"), {
    zoom: 2,
    center: { lat: 0, lng: 0 },
    mapId: "DEMO_MAP_ID",
  });

  const infoWindow = new InfoWindow();
  // Criar marcadores dinâmicos para meteoritos com coordenadas válidas
  meteoriteData.forEach((meteorite) => {
    const lat = parseFloat(meteorite.reclat);
    const lng = parseFloat(meteorite.reclong);

    if (!isNaN(lat) && !isNaN(lng)) {
      const position = { lat, lng };

      const marker = new AdvancedMarkerElement({
        map,
        position,
        title: meteorite.name || "Unknown Meteorite",
      });

      const content = `
      <div style="font-family: Arial; font-size: 14px; line-height: 1.4;">
        <strong>${meteorite.name || "Unknown"}</strong><br/>
        <b>Year:</b> ${meteorite.year ? parseInt(meteorite.year) : "N/A"}<br/>
        <b>Class:</b> ${meteorite.recclass || "N/A"}<br/>
        <b>Mass:</b> ${meteorite.mass || "N/A"} g<br/>
        <b>Fall:</b> ${meteorite.fall || "N/A"}
      </div>
    `;

      // Usar addEventListener em vez de addListener com AdvancedMarkerElement
      marker.addListener("gmp-click", () => {
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
      });
    }
  });
}
