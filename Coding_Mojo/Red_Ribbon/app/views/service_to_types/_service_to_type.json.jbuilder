json.extract! service_to_type, :id, :service_provider_id, :service_type_id, :created_at, :updated_at
json.url service_to_type_url(service_to_type, format: :json)