class ServiceType < ActiveRecord::Base
	has_many :service_providers, through: :service_to_type
	validates :name, presence: true
end
