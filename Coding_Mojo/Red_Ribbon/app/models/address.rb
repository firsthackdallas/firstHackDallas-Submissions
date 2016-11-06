class Address < ActiveRecord::Base
  belongs_to :service_provider
  validates :name, :address_1, :city, :state, :zip_code, presence: true
end
