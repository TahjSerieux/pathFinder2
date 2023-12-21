from flask import Flask 
from flask import jsonify
from flask import request
from flask import blueprints
import random
import time 
from flask_cors import CORS


#stuff for Google maps
import googlemaps
gmaps = googlemaps.Client(key='AIzaSyBEXWNMZk04AR8ivjwnzrmkax0CVsUX8oQ')

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3001"}})





def get_photo_html(photo_details):
    reference = photo_details[0]['photo_reference']
    link = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=600' + '&photo_reference=' + reference + '&key=AIzaSyBEXWNMZk04AR8ivjwnzrmkax0CVsUX8oQ'
    return link

# def get3(formatedRequest,gmapsObject):
#     result = gmapsObject.places(** formatedRequest)
#     if(result['next_page_token']):
#         time.sleep(2)
#         formatedRequest['page_token'] = result['next_page_token']
#         x = gmapsObject.places(** formatedRequest)
#         result['results'].extend(x['results'])
#         if(x['next_page_token']):
#             time.sleep(2)
#             formatedRequest['page_token'] = x['next_page_token']
#             x = gmapsObject.places(** formatedRequest)
#             result['results'].extend(x['results'])
#     return result

# use get instead for a catch block



@app.route('/EndPoint_Finder', methods = ["POST"])
def API_Endpoint():
  x = request.json 
  print(x)
  keywords = x['keywords']
  radius = x['radius']
  cordinates = x['cordinates']
  location_bias = locationbias = 'circle:' + str(radius) + '@' + str(cordinates['lat']) + ',' + str(cordinates['lng']) #the format


  if ('min_price' in x) and ('min_price' in x): 
    min_price = x['min_price']
    max_price = x['max_price']
  else:
    min_price = None
    max_price = None

  poi = {'results': [], 'status': ""}

  for INPUT in keywords:
    query = {
      'input': INPUT,
      'input_type' : 'textquery',
      'fields' : ['types', 'rating', 'geometry/location/lng', 'geometry/location/lat', 'user_ratings_total', 'photos', 'formatted_address', 'name', 'place_id','price_level',],
      'location_bias' : location_bias,
    }
    result = gmaps.find_place(**query)

    if result['status'] == "OK":
      add = {
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
    poi['results'].append(add)
  ################################333

  if(len(poi['results']) == 0):
    poi['status'] = "ZERO_RESULTS"
  elif(len(keywords) > len(poi['results'])):
    poi['status'] = "FEWER_RESULTS"
  else:
    poi['status'] = "OK"

  return jsonify(poi)







@app.route('/WayPoint_Finder', methods = ["POST"])
def API_wayPoint():
  x = request.json 
  keywords = x['keywords']
  radius = x['radius']
  cordinates = x['cordinates']

  if ('min_price' in x) and ('min_price' in x): 
    min_price = x['min_price']
    max_price = x['max_price']
  else:
    min_price = None
    max_price = None


  poi = {'results' : [], 'status' : ''}

  #change to work with new format!
  for cordinate in request.json["cordinates"]:
    location = [cordinate['lat'], cordinate['lng']]
    params = {
       'query' : keywords,
       'location' : cordinate,
       'radius' : radius,
       'open_now': True,
       'min_price': min_price,
       'max_price': max_price
    }
    result = gmaps.places(**params)
    if(result['status'] == "OK"):
      randomNum = random.randrange(len(result)-1)
      add = {
          'name': result['results'][randomNum]['name'],
          'lat': result['results'][randomNum]['geometry']['location']['lat'], 
          'lng': result['results'][randomNum]['geometry']['location']['lng'], 
          'placeID': result['results'][randomNum]['place_id'],
          'atributes': result['results'][randomNum]['types'],
          'icon': result['results'][randomNum]['icon'],
          'photo': get_photo_html(result['results'][randomNum]['photos']),
          'rating': result['results'][randomNum]['rating'],
          'user_rating_total': result['results'][randomNum]['user_ratings_total'],
          'address': result['results'][randomNum]['formatted_address'],
          'price_level': result['results'][randomNum]['price_level']
      }
      poi['results'].append(add)

  if(len(poi['results']) == 0):
    poi['status'] = "ZERO_RESULTS"
  elif(len(keywords) > len(poi['results'])):
    poi['status'] = "FEWER_RESULTS"
  else:
    poi['status'] = "OK"

  
  return jsonify(poi)




if __name__ == '__main__':
  app.run(debug=True, port=3002)
