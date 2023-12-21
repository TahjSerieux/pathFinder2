from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import googlemaps
import random
import time

# Initialize Google Maps Client
gmaps = googlemaps.Client(key='AIzaSyBEXWNMZk04AR8ivjwnzrmkax0CVsUX8oQ')

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3001"}})


def getPlaces(formatedRequest, gmapsObject):
    result = gmapsObject.places(** formatedRequest)
        # if('next_page_token' in x):
        #    time.sleep(2)
        #    formatedRequest['page_token'] = x['next_page_token']
        #    x = gmapsObject.places(**formatedRequest)
        #    result['result'].append(x['result'])

    return result

def get_photo_html(photo_details):
    reference = photo_details[0]['photo_reference']
    link = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=600' + '&photo_reference=' + reference + '&key=AIzaSyBEXWNMZk04AR8ivjwnzrmkax0CVsUX8oQ'
    return link
@cross_origin()
@app.route('/find_endpoint', methods=["POST"])
def API_Endpoint():
    if request.method == 'OPTIONS':
        return ('', 204)

    x = {'results': []}

    lat = request.json['cordinates'][0]
    lng = request.json['cordinates'][1]
    radius = request.json['radius']
    location_bias = 'circle:' + str(radius) + '@' + str(lat) + "," + str(lng)

    API_request = {
        'INPUT': request.json['keywords'],
        'input_type': 'textquery',
        'fields': ['types', 'rating', 'business_status', 'geometry/location/lng', 'geometry/location/lat',
                   'user_ratings_total', 'photos', 'formatted_address', 'name', 'place_id', 'price_level', ],
        'location_bias': location_bias
    }

    for INPUT in API_request['INPUT']:
        params = {
            'input': INPUT,
            'input_type': 'textquery',
            'fields': API_request['fields'],
            'location_bias': API_request['location_bias']
        }
        result = gmaps.find_place(**params)
        if result['status'] != "OK":
            rec = {}
        else:
            rec = {
                'name': result['candidates'][0]['name'],
                'lat': result['candidates'][0]['geometry']['location']['lat'],
                'lng': result['candidates'][0]['geometry']['location']['lng'],
                'placeID': result['candidates'][0]['place_id'],
                'photos': get_photo_html(result['candidates'][0]['photos']),
                'atributes': result['candidates'][0]['types'],
                'rating': result['candidates'][0]['rating'],
                'user_rating_total': result['candidates'][0]['user_ratings_total'],
                'address': result['candidates'][0]['formatted_address']
            }

        x['results'].append(rec)

    return jsonify(x)

# @app.route('/POI', methods=["POST"])
# def find_POI():
#   keywords = request.json["keywords"]
#   # keywords = ["Cafe","Convenience Store", "Restaurant"]
#   # will hold all the recomendations
#   poi = []
  
#   for cordinate in request.json["cordinates"]:
#     params = {
#         'query': keywords,
#         'location': cordinate, 
#         'radius': 1000 ,   # to be made adaptive
#         'open_now': True
#     }
#     recomendation = gmaps.places(**params)
#     choice = random.randrange(len(recomendation['results']) - 1)
#     poi.append({ 
#         'name': recomendation['results'][choice]['name'],
#         'lat': recomendation['results'][choice]['geometry']['location']['lat'], 
#         'lng': recomendation['results'][choice]['geometry']['location']['lng'],
#         'placeID': recomendation['results'][choice]['place_id'],
#         'atributes': recomendation['results'][choice]['types'],
#         'icon': recomendation['results'][choice]['icon'],
#         'photo': recomendation['results'][choice]['photos'],
#         'rating': recomendation['results'][choice]['rating'],
#         'user_rating_total': recomendation['results'][choice]['user_ratings_total'],
#         'address': recomendation['results'][choice]['formatted_address'],
#         'price_level': recomendation['results'][choice]['price_level']
#     }) 

#   return jsonify(poi)


@app.route('/POI', methods=["POST"])
def randomRec():
  keywords = request.json["keywords"]
#  radius = 1000 # make paramterized
  radius = request.json["radius"]
  origin = float(request.json["cordinates"]) # We need them to specify a starting point
  price_max = request.json['max_price']
  price_min = request.json['min_price']
  
  params =  {
    'query' : keywords,
    'location' : origin,
    'radius' : radius,
    'open_now': True
  }

  #add optional request (min and max price)
  if price_max:
    params['max_price'] = price_max
  else:
    params['max_price'] = None

  if price_min:
    params['min_price'] = price_min
  else:
    params['min_price'] = None

  # why pick one for another?
  result = getPlaces(params, gmaps)
  randomNum = random.randrange(len(result['results']) - 1)  

  poi ={    # fetching stable results
      'name': result['results'][randomNum]['name'],
      'lat': result['results'][randomNum]['geometry']['location']['lat'], 
      'lng': result['results'][randomNum]['geometry']['location']['lng'], 
      'placeID': result['results'][randomNum]['place_id'],
      'atributes': result['results'][randomNum]['types'],
      'icon': result['results'][randomNum]['icon'],
      'rating': result['results'][randomNum]['rating'],
      'user_rating_total': result['results'][randomNum]['user_ratings_total'],
      'address': result['results'][randomNum]['formatted_address'],
  }

  #checking unstable results
  price = result['results'][randomNum]['price_level']
  if price:
    poi['price_level'] = price
  else: 
    poi['price_level'] = None #sentinal value

  photos = result['results'][randomNum]['photos']
  if photos:
    poi['photos'] = photos
  else:
    poi['photos'] = None #use None 

  return jsonify(poi)

if __name__ == '__main__':
    app.run(debug=True, port=3002)
