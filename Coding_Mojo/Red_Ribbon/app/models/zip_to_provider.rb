class ZipToProvider < ActiveRecord::Base
  belongs_to :zip
  belongs_to :service_provider
end
