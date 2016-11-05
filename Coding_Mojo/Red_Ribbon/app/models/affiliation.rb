class Affiliation < ActiveRecord::Base
  belongs_to :service_provider
  validates :affiliation, presence: true
end
