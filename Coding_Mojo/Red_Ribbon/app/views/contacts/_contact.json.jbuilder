json.extract! contact, :id, :service_provider_id, :name, :phone, :email, :created_at, :updated_at
json.url contact_url(contact, format: :json)