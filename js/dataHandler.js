let meteoriteData = [];

export async function fetchMeteoriteData() {
  try {
    const response = await fetch("https://data.nasa.gov/resource/y77d-th95.json");
    if (!response.ok) throw new Error("Main API response was not OK.");

    meteoriteData = await response.json();
    console.info("Meteorite data successfully loaded from main API.");
  } catch (error) {
    console.warn("Failed to load from main API. Attempting to fetch local data…", error);

    try {
      const localResponse = await fetch("https://raw.githubusercontent.com/hendricknkuba/meteorite-landings/refs/heads/main/data/Meteorite_Landings.json");
      if (!localResponse.ok) throw new Error("Local data file response was not OK.");

      meteoriteData = await localResponse.json();
      console.info("Meteorite data successfully loaded from local backup.");
    } catch (localError) {
      console.error("Failed to load local data as well:", localError);
      // Show error message on the page
      document.body.innerHTML = `
        <div style="padding: 2rem; color: red; text-align: center;">
          <h2>Failed to load meteorite data.</h2>
          <p>Please check your internet connection or try again later.</p>
        </div>
      `;
      return []; // return empty array to avoid app crash
    }
  }

  // Filter and normalize valid meteorite entries
  meteoriteData = meteoriteData.filter((m) => {
    const hasCoords = !isNaN(parseFloat(m.reclat)) && !isNaN(parseFloat(m.reclong));
    const validYear = m.year && !isNaN(parseInt(m.year));
    const validId = m.id && m.name;

    return hasCoords && validYear && validId;
  });

  meteoriteData.forEach(m => {
    m.year = parseInt(m.year);
    m.mass = parseFloat(m.mass) || null;
    m.reclat = parseFloat(m.reclat);
    m.reclong = parseFloat(m.reclong);
  });

  return meteoriteData;
}
