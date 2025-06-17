let map;

export async function initMap(meteoriteData = []) {
  try {
    // Load Google Maps
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // Initialize map
    map = new Map(document.getElementById("map"), {
      zoom: 2,
      center: { lat: 0, lng: 0 },
      mapId: "DEMO_MAP_ID",
    });

    const infoWindow = new InfoWindow();

    meteoriteData.forEach((meteorite) => {
      const lat = parseFloat(meteorite.reclat);
      const lng = parseFloat(meteorite.reclong);

      if (isNaN(lat) || isNaN(lng)) return; // Ignore invalid datas

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

      // Display InfoWindows
      marker.addListener("gmp-click", () => {
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
      });
    });

  } catch (error) {
    console.error("Erro ao carregar o mapa:", error);
    const mapContainer = document.getElementById("map");
    if (mapContainer) {
      mapContainer.innerHTML = `
        <div style="color: red; padding: 1rem; text-align: center;">
          <p>Não foi possível carregar o mapa.</p>
          <p>Verifique sua conexão ou tente novamente mais tarde.</p>
        </div>
      `;
    }
  }
}
