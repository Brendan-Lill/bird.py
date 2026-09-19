import re

def cityToCode(city):
    city = city.lower()
    city = re.sub(r'[^A-Za-z0-9]', '', city)

    convert = {
        "sanfransico" : "SFO",
        "losangeles" : "LAX",
        "seattle" : "SEA",
        "lasvegas" : "LAS",
        "denver" : "DEN",
        "dallas" : "DFW",
        "chicago" : "ORD",
        "atlanta" : "ATL",
        "miami" : "MIA",
        "newyork" : "JFK",
        "newark" : "EWR",
        "boston" : "BOS",
        "toronto" : "YYZ",
        "london" : "LHR",
        "paris" : "CDG",
        "frankfurt" : "FRA",
        "amsterdam" : "AMS",
        "dubai" : "DXB",
        "doha" : "DOH",
        "singapore" : "SIN",
        "tokyo" : "NRT"
    }

    if(city in convert):
        return convert["city"]
    else:
        return "error"