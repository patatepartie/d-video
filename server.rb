db = Mongo::MongoClient.new(settings.db_host, settings.db_port).db(settings.db_name)

get '/api/media' do
  content_type :json

  allMediaInJson(db)
end

def allMediaInJson(db)
  db["media"].find.sort(:title).to_a.map {|medium| replace_bson_id(medium)}.to_json
end

def valid_medium_attributes(key)
  ["title", "selected"].include?(key)
end

post '/api/media' do
  request.body.rewind
  posted_data = JSON.parse(request.body.read)

  bson_id = db["media"].insert(posted_data.select {|key, value| valid_medium_attributes(key)})

  created_http_response(bson_id)
end

put '/api/media/:id' do
  request.body.rewind
  posted_data = JSON.parse(request.body.read)
  bson_id = to_bson_id(params[:id])

  attributes = posted_data.select {|key, value| valid_medium_attributes(key) }
  db["media"].update({"_id" => bson_id}, attributes)

  updated_http_response(bson_id, attributes)
end

delete '/api/media/:id' do
  db["media"].remove("_id" => to_bson_id(params[:id]))

  204
end

get '/*' do
  puts params[:splat]
  haml :index, locals: {media: allMediaInJson(db)}
end

def created_http_response(id)
  content_type :json

  headers = {"Location" => url("/api/media/#{id}")}
  [201, headers, {id: id.to_s}.to_json]
end

def updated_http_response(id, attributes)
  content_type :json

  headers = {"Location" => url("/api/media/#{id}")}
  [200, headers, attributes.to_json]
end

def to_bson_id(id)
  BSON::ObjectId.from_string(id)
end

def replace_bson_id(obj)
  obj.merge({id: obj['_id'].to_s}).reject {|key, value| key == '_id'}
end
