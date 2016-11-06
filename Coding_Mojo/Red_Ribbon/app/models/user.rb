class User < ActiveRecord::Base
  has_secure_password

  validates :screen_name, :email, :user_level, presence: true
end
