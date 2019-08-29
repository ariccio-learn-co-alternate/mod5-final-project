# frozen_string_literal: true

Rails.application.routes.draw do
    # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  # namespace :api do
    post "/users", to: "users#create"
    post "/login", to: "auth#create"
    get '/users/show', to: 'users#show'

    get '/scoreboard', to: 'scores#show'
  # end
end
