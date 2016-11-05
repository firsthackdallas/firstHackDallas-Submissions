class ServiceProvider < ActiveRecord::Base
	has_many :addresses
	has_many :contacts
	has_many :zips_covered, through: :zip_to_provider, source: :zips
	has_one :affiliation
	has_many :service_types, through: :service_to_type

	validates :name, :description, presence: true
end
