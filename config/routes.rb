# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  # namespace :api do
  post '/users', to: 'users#create'
  post '/login', to: 'auth#create'
  get '/users/show', to: 'users#show'
  get '/users/showfriends', to: 'users#show_friends'
  post '/users/search', to: 'users#search'
  post '/users/friends', to: 'user_friends#create'
  
  post '/levels', to:'levels#create'
  get '/levels', to:'levels#list'
  get '/levels/:id', to: 'levels#show'

  get '/scoreboard', to: 'scores#show'
  post '/scoreboard', to: 'scores#create'
  # end
end
