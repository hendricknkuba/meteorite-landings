let meteoriteData = [];

export async function fetchMeteoriteData() {
  try {
    const response = await fetch("https://data.nasa.gov/resource/y77d-th95.json");
    if (!response.ok) throw new Error("Erro na resposta da API");
    meteoriteData = await response.json();
  } catch (error) {
    console.warn("API falhou. Usando arquivo local:", error);
    const localResponse = await fetch("https://raw.githubusercontent.com/hendricknkuba/meteorite-landings/refs/heads/main/data/Meteorite_Landings.json");
    meteoriteData = await localResponse.json();
  }

  // Converter strings para tipos apropriados (ex: year como número)
  meteoriteData.forEach(m => {
    if (m.year) m.year = new Date(m.year).getFullYear();
    if (m.mass) m.mass = parseFloat(m.mass);
  });

  return meteoriteData;
}
