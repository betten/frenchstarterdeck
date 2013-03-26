require 'sinatra'

set :haml, :format => :html5

get '/' do
  haml :index
end

post '/generate' do
  attachment "frenchstarterdeck.txt"
  params[:word].map { |w| "#{w[1]["word"]},#{w[1]["french"]},#{w[1]["english"]}\r\n" unless w[1].nil? }
end
