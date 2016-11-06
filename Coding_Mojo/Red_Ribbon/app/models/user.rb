class User < ActiveRecord::Base
  has_secure_password

  validates :screen_name, :email, presence: true
end
