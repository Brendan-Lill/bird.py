const HIDE_CANCELLED = true;
 
const AIRCRAFT_NAMES = {
    A320: "Airbus A320",
    A20N: "Airbus A320neo",
    A321: "Airbus A321",
    A333: "Airbus A330-300",
    A359: "Airbus A350-900",
    BCS3: "Airbus A220-300",
    B738: "Boeing 737-800",
    B38M: "Boeing 737 MAX 8",
    B77W: "Boeing 777-300ER",
    B788: "Boeing 787-8",
    B789: "Boeing 787-9",
    E75L: "Embraer E175",
};
 
// Airline IATA code -> website where the customer can book
const AIRLINE_SITES = {
    UA: "https://www.united.com",
    AA: "https://www.aa.com",
    DL: "https://www.delta.com",
    AS: "https://www.alaskaair.com",
    B6: "https://www.jetblue.com",
    WN: "https://www.southwest.com",
    AC: "https://www.aircanada.com",
    BA: "https://www.britishairways.com",
    LH: "https://www.lufthansa.com",
    AF: "https://www.airfrance.com",
    KL: "https://www.klm.com",
    EK: "https://www.emirates.com",
    QR: "https://www.qatarairways.com",
    SQ: "https://www.singaporeair.com",
    NH: "https://www.ana.co.jp/en/us/",
};
 
// ---- sorting ---------------------------------------------------------------
// Keys match the <option> values of the "Sort results by" menu on the search page.
 
const tripPrice = (t) => t.price?.amount ?? Infinity;
const legMinutes = (leg) => (new Date(leg.arrival.scheduled) - new Date(leg.departure.scheduled)) / 60000;
const tripMinutes = (t) => legMinutes(t.initial_flight) + legMinutes(t.return_flight); // both flights
 
const SORT_OPTIONS = {
    price_low: { label: "Price: low to high",       compare: (a, b) => tripPrice(a) - tripPrice(b) },
    duration:  { label: "Flight time: low to high", compare: (a, b) => tripMinutes(a) - tripMinutes(b) },
    airline:   { label: "Airline (A–Z)",            compare: (a, b) => a.initial_flight.airline.name.localeCompare(b.initial_flight.airline.name) },
};
 
// Returns the trips in the chosen order (cheapest first is used to break ties)
function sortTrips(trips, key) {
    const option = SORT_OPTIONS[key] || SORT_OPTIONS.price_low;
    const sorted = [...trips].sort((a, b) => option.compare(a, b) || tripPrice(a) - tripPrice(b));
    return { label: option.label, trips: sorted };
}
 
// ---- helpers ---------------------------------------------------------------
 
// Escape text before putting it into HTML
function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[ch]));
}
 
function titleCase(text) {
    return String(text ?? "").replace(/\b\w/g, (c) => c.toUpperCase());
}
 
function formatMoney(price) {
    if (!price || price.amount == null) return "—";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: price.currency || "USD",
        maximumFractionDigits: 0,
    }).format(price.amount);
}
 
// Times in the data are UTC; show them in each airport's own timezone.
function fmtTime(iso, timeZone) {
    return new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" }).format(new Date(iso));
}
 
function fmtDate(iso, timeZone, opts = { weekday: "short", month: "short", day: "numeric" }) {
    return new Intl.DateTimeFormat("en-US", { timeZone, ...opts }).format(new Date(iso));
}
 
function fmtMinutes(totalMinutes) {
    const mins = Math.round(totalMinutes);
    return `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, "0")}m`;
}
 
function fmtDuration(depIso, arrIso) {
    return fmtMinutes((new Date(arrIso) - new Date(depIso)) / 60000);
}
 
// ---- rendering -------------------------------------------------------------
 
// One end of a flight (departure or arrival): scheduled time, date, airport, terminal/gate
function renderEnd(point, side) {
    const details = [
        point.terminal && `Terminal ${point.terminal}`,
        point.gate && `Gate ${point.gate}`,
    ].filter(Boolean).join(" · ");
 
    return `
        <div class="leg-end leg-end-${side}">
            <div class="leg-time">${esc(fmtTime(point.scheduled, point.timezone))}</div>
            <div class="leg-date">${esc(fmtDate(point.scheduled, point.timezone))}</div>
            <div class="leg-code">${esc(point.iata)}</div>
            <div class="leg-airport">${esc(point.airport)}</div>
            ${details ? `<div class="leg-details">${esc(details)}</div>` : ""}
        </div>`;
}
 
function renderLeg(leg, label) {
    const { departure: dep, arrival: arr } = leg;
    const aircraft = leg.aircraft ? (AIRCRAFT_NAMES[leg.aircraft.icao] || leg.aircraft.icao) : null;
    const codeshare = leg.flight.codeshared;
 
    const notes = [];
    if (aircraft) notes.push(aircraft);
    if (codeshare) {
        notes.push(`Codeshare with ${titleCase(codeshare.airline_name)} ${String(codeshare.flight_iata).toUpperCase()}`);
    }
 
    return `
        <section class="leg">
            <div class="leg-top">
                <span class="leg-label">${esc(label)}</span>
                <span class="leg-airline">${esc(leg.airline.name)} · ${esc(leg.flight.iata)}</span>
            </div>
            <div class="leg-route">
                ${renderEnd(dep, "departure")}
                <div class="leg-middle">
                    <span class="leg-duration">${esc(fmtDuration(dep.scheduled, arr.scheduled))}</span>
                    <span class="leg-line"></span>
                </div>
                ${renderEnd(arr, "arrival")}
            </div>
            ${notes.length ? `<div class="leg-notes">${notes.map((n) => `<span>${esc(n)}</span>`).join("")}</div>` : ""}
        </section>`;
}
 
function renderBookButton(airline) {
    const url = AIRLINE_SITES[airline.iata];
    if (!url) return "";
    return `
        <footer class="trip-footer">
            <a class="book-button" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Book with ${esc(airline.name)}</a>
        </footer>`;
}
 
function renderTrip(trip) {
    const out = trip.initial_flight;
    const back = trip.return_flight;
    const short = { month: "short", day: "numeric" };
    const dates = `${fmtDate(out.departure.scheduled, out.departure.timezone, short)} – ` +
                  `${fmtDate(back.departure.scheduled, back.departure.timezone, short)}`;
 
    return `
        <article class="trip">
            <header class="trip-header">
                <div>
                    <h2 class="trip-route">${esc(out.departure.iata)} ⇄ ${esc(out.arrival.iata)}</h2>
                    <p class="trip-sub">${esc(out.departure.airport)} ⇄ ${esc(out.arrival.airport)}</p>
                    <p class="trip-dates">${esc(dates)} · ${esc(out.airline.name)} · ${esc(fmtMinutes(tripMinutes(trip)))} total flight time</p>
                </div>
                <div class="trip-price">${esc(formatMoney(trip.price))}<span>round trip · economy</span></div>
            </header>
            ${renderLeg(out, "Outbound")}
            ${renderLeg(back, "Return")}
            ${renderBookButton(out.airline)}
        </article>`;
}
 
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("results");
    const all = Array.isArray(flightData) ? flightData : (flightData?.data ?? []);
    const available = HIDE_CANCELLED
        ? all.filter((t) => t.initial_flight.flight_status !== "cancelled" && t.return_flight.flight_status !== "cancelled")
        : all;
 
    if (!available.length) {
        container.innerHTML = '<p class="results-empty">No flights found.</p>';
        return;
    }
 
    // `sortBy` is defined in the HTML template; fall back to cheapest first if it's missing
    const { label, trips } = sortTrips(available, typeof sortBy !== "undefined" ? sortBy : "price_low");
 
    container.innerHTML =
        `<p class="results-count">${trips.length} trip${trips.length === 1 ? "" : "s"} found · sorted by ${esc(label)}</p>` +
        trips.map(renderTrip).join("");
});