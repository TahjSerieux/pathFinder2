
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
#         'radius': 1000    # to be made adaptive
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

# # basic recomendation function, the top three
# # how to deal with locations along the way, a way of picking some place (use some mid point or at random)?

# #
# # @app.route('/POI', methods=["POST"])
# # def find_POI():
# #   # getting all the paramters from the fetch request, the get() arguments should match here and the java state objects properties.


# #     cordinate = (float(request.json['lat']), float(request.json['lng']))
# #     keywords = request.json['keywords']

# # #   return 'Done', 201
# # #  return jsonify({"cordinate": cordinate, "keywords": keywords})
# # #   Hard encodede for the moment
# #     params = {
# #        'query': keywords,
# #        'location': cordinate,
# #        'radius': 1000
# #     }

# #     recomendation = gmaps.places(**params)

# #     choice = random.randrange(len(recomendation['results']) - 1)

# #     poi = {'name': recomendation['results'][choice]['name'],
# #       'lat': recomendation['results'][choice]['geometry']['location']['lat'], 
# #       'lng': recomendation['results'][choice]['geometry']['location']['lng'],
# #       'placeID': recomendation['results'][choice]['place_id']}  


# # #    return jsonify({'cordinate': cordinate, 'keywords': keywords})
# #     return jsonify(poi)

#     # call the gmaps route
#     # create the querry to call the API


# if __name__ == '__main__':
#   app.run(debug=True, port=5000)
