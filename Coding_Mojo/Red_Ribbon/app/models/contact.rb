class Contact < ActiveRecord::Base
  belongs_to :service_provider
  validates :name, presence: true

end
