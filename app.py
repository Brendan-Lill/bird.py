from flask import Flask, render_template, request
from utils import *
import json


app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/search", methods=["POST"])
def display_results():
    from_city = request.form.get("from_city", "")
    to_city = request.form.get("to_city", "")
    min_budget = request.form.get("min_budget", "")
    max_budget = request.form.get("max_budget", "")
    start_date = request.form.get("start_date", "")
    end_date = request.form.get("end_date", "")

    if min_budget == "":
        min_budget = "0"

    if max_budget == "":
        max_budget = "9999"



    print(f"From: {from_city} | To: {to_city} | Budget: ${min_budget}-${max_budget} | Timeframe: {start_date} to {end_date}")

    results = {
        "message": f"Searching flights from {from_city} to {to_city}, budget ${min_budget}-${max_budget}, {start_date} to {end_date}"
    }

    #print(date_encode(start_date))

    flights = {}
    with open('data/flights.json', 'r') as file:
        flights = json.load(file)


    found_flights = []
    start_code = cityToCode(from_city)
    end_code = cityToCode(to_city)

    for flight in flights['data']:
        if from_city != "" and flight['departure']['iata'] != start_code:
            continue

        if to_city != "" and flight['arrival']['iata'] != end_code:
            continue

        if int(flight['price']['amount']) < int(min_budget) or int(flight['price']['amount']) > int(max_budget):
            continue


        flight_date = {}
        user_date = {}

        if start_date != "":
            flight_date = timestamp_data_extract(flight['departure']['scheduled'])
            user_date = date_encode(start_date)

        if start_date != "":
            if flight_date['year'] != user_date['year'] or flight_date['month'] != user_date['month'] or flight_date['day'] != user_date['day']:
                continue

        

        found_flights.append(flight)
    

    print(len(found_flights))
    return render_template("search.html", found_flights=found_flights)



if __name__ == "__main__":
    app.run(debug=True)