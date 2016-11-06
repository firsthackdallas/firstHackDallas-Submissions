json.extract! service_provider, :id, :name, :description, :website, :hours, :created_at, :updated_at
json.url service_provider_url(service_provider, format: :json)