from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")



@app.route("/search", methods="POST")
def display_results():
    #the code added here will be used to get the data and send it to the frontend
    return render_template("search.html")


if __name__ == "__main__":
    app.run(debug=True)