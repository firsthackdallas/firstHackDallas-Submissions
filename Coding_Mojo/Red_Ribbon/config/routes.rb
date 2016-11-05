Rails.application.routes.draw do
  get 'pages' => 'pages#index'
  root 'pages#index'

  resources :service_to_types
  resources :service_types
  resources :affiliations
  resources :contacts
  resources :zip_to_providers
  resources :zips
  resources :addresses
  resources :service_providers


end
