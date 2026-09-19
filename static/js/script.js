const airports = [
  { name: "Amsterdam Schiphol", code: "AMS" },
  { name: "Boston Logan International", code: "BOS" },
  { name: "Charles de Gaulle Airport (Paris)", code: "CDG" },
  { name: "Chicago O'Hare International", code: "ORD" },
  { name: "Dallas/Fort Worth International", code: "DFW" },
  { name: "Denver International", code: "DEN" },
  { name: "Dubai International", code: "DXB" },
  { name: "Frankfurt Airport", code: "FRA" },
  { name: "Hamad International (Doha)", code: "DOH" },
  { name: "Harry Reid International (Las Vegas)", code: "LAS" },
  { name: "Hartsfield-Jackson Atlanta International", code: "ATL" },
  { name: "Heathrow Airport (London)", code: "LHR" },
  { name: "John F. Kennedy International (New York)", code: "JFK" },
  { name: "Los Angeles International", code: "LAX" },
  { name: "Miami International", code: "MIA" },
  { name: "Narita International (Tokyo)", code: "NRT" },
  { name: "Newark Liberty International", code: "EWR" },
  { name: "San Francisco International", code: "SFO" },
  { name: "Seattle-Tacoma International", code: "SEA" },
  { name: "Singapore Changi", code: "SIN" },
  { name: "Toronto Pearson International", code: "YYZ" },
  { name: "Washington Dulles International", code: "IAD" }
];

function setupAutocomplete(inputId, listId) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);
  let highlightedIndex = -1;

  function renderList(items) {
    list.innerHTML = "";
    if (items.length === 0) {
      list.classList.remove("active");
      return;
    }
    items.forEach((airport, index) => {
      const item = document.createElement("div");
      item.className = "autocomplete-item";
      item.innerHTML = `<span class="code">${airport.code}</span>${airport.name}`;
      item.addEventListener("click", () => {
        input.value = `${airport.name} (${airport.code})`;
        list.classList.remove("active");
      });
      list.appendChild(item);
    });
    list.classList.add("active");
    highlightedIndex = -1;
  }

  function filterAirports(query) {
    const q = query.trim().toLowerCase();
    if (!q) return airports;
    return airports.filter(a =>
      a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q)
    );
  }

  // Show full list on focus/click
  input.addEventListener("focus", () => {
    renderList(filterAirports(input.value));
  });

  // Filter as user types
  input.addEventListener("input", () => {
    renderList(filterAirports(input.value));
  });

  // Keyboard navigation
  input.addEventListener("keydown", (e) => {
    const items = list.querySelectorAll(".autocomplete-item");
    if (!list.classList.contains("active") || items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      highlightedIndex = (highlightedIndex + 1) % items.length;
      items.forEach((item, i) => item.classList.toggle("highlighted", i === highlightedIndex));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      highlightedIndex = (highlightedIndex - 1 + items.length) % items.length;
      items.forEach((item, i) => item.classList.toggle("highlighted", i === highlightedIndex));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      items[highlightedIndex].click();
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !list.contains(e.target)) {
      list.classList.remove("active");
    }
  });
}

setupAutocomplete("filter1", "filter1List");
setupAutocomplete("filter2", "filter2List");

const searchBtn = document.getElementById("search");
const city1 = document.getElementById("filter1");
const city2 = document.getElementById("filter2");
const date1 = document.getElementById("startDate");
const date2 = document.getElementById("endDate");

const fields = [city1, city2, date1, date2];

function checkFields() {
    if(city1.value !== '' && city2.value !== '' && (date1.value !== '' || date.valu !== '')){
        searchBtn.style.backgroundColor = "#2fbfad";
        searchBtn.disabled = false;
    }
}

fields.forEach(field => {
  if (field) {
    field.addEventListener("input", checkFields);
  }
});