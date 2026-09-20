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
        return convert[city]
    else:
        return "error"



def timestamp_data_extract(time):
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    split = time.index('T')
    first_separator = time.index('-')
    second_separator = time.index('-', first_separator + 1)
    date = {}

    date["year"] = time[:first_separator]
    date["month"] = months[int(time[first_separator + 1: second_separator]) - 1]
    date["day"] = str(int(time[second_separator + 1: split]))

    first_separator = time.index(':')
    second_separator = time.index(':', first_separator + 1)

    date["hour"] = str(int(time[split + 1:first_separator]))
    date["minute"] = str(int(time[first_separator + 1: second_separator]))

    return date    


def date_encode(d):
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    date = {}

    first_separator = d.index('-')
    second_separator = d.index('-', first_separator + 1)

    date["year"] = str(int(d[:first_separator]))
    date["month"] = months[int(d[first_separator + 1: second_separator]) - 1]
    date["day"] = str(int(d[second_separator + 1:]))

    return date