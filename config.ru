require 'rubygems'
require 'bundler'

Bundler.require

configure :development do
	set :db_host, 'dev.patatepartie.fr'
	set :db_port, 27017
	set :db_name, "dvideo"

	enable :logging
end

require './server.rb'

run Sinatra::Application