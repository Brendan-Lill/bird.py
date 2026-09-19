from flask import Flask, render_template, request

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/search", methods=["POST"])
def display_results():
    from_city = request.form.get("from_city", "")
    to_city = request.form.get("to_city", "")
    max_budget = request.form.get("max_budget", "")
    start_date = request.form.get("start_date", "")
    end_date = request.form.get("end_date", "")

    print(f"From: {from_city} | To: {to_city} | Max Budget: ${max_budget} | Timeframe: {start_date} to {end_date}")

    results = {
        "message": f"Searching flights from {from_city} to {to_city}, under ${max_budget}, {start_date} to {end_date}"
    }

    return render_template("search.html", results=results)


def home():
    return render_template("index.html")


def hello():
    return "hello"


if __name__ == "__main__":
    app.run(debug=True)