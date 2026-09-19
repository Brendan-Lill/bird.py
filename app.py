import json
from datetime import datetime
from flask import Flask, render_template, request

app = Flask(__name__)


def load_flights():
    with open("flights.json", "r") as f:
        data = json.load(f)
    return data["data"]  # the actual list of flight records


def city_matches(user_input, flight_leg):
    """Match against airport name OR IATA code, case-insensitive."""
    if not user_input:
        return True
    user_input = user_input.strip().lower()
    return (
        user_input in flight_leg["airport"].lower()
        or user_input == flight_leg["iata"].lower()
    )


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/search", methods=["POST"])
def display_results():
    from_city = request.form.get("from_city", "")
    to_city = request.form.get("to_city", "")
    min_budget = request.form.get("min_budget", "")
    max_budget = request.form.get("max_budget", "")
    start_date = request.form.get("start_date", "")
    end_date = request.form.get("end_date", "")

    flights = load_flights()

    filtered = []
    for flight in flights:
        if not city_matches(from_city, flight["departure"]):
            continue
        if not city_matches(to_city, flight["arrival"]):
            continue

        price = flight["price"]["amount"]
        if min_budget and price < float(min_budget):
            continue
        if max_budget and price > float(max_budget):
            continue

        flight_date = flight["flight_date"]  # e.g. "2026-09-19"
        if start_date and flight_date < start_date:
            continue
        if end_date and flight_date > end_date:
            continue

        filtered.append(flight)

    return render_template(
        "search.html",
        from_city=from_city,
        to_city=to_city,
        results=filtered
    )


if __name__ == "__main__":
    app.run(debug=True)