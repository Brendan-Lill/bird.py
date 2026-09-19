from flask import Flask, render_template, request

app = Flask(__name__)



@app.route("/search", methods=["POST"])
def display_results():
    #the code added here will be used to get the data and send it to the frontend
    print(request.args.get('from'))
    print(request.args.get('to'))
    return render_template("search.html")



@app.route("/")
def home():
      return render_template("index.html")



if __name__ == "__main__":
    app.run(debug=True)
