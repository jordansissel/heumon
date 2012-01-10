require "sinatra"

# TODO(sissel): make this for iPhone/android or whatever.
before :agent => /.*/ do
  @layout = :"layout-mobile"
end

get "/" do
  haml :index, :layout => (@layout or :layout)
end
