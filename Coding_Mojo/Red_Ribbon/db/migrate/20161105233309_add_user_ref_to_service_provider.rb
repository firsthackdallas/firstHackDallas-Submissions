class AddUserRefToServiceProvider < ActiveRecord::Migration
  def change
    add_reference :service_providers, :user, index: true, foreign_key: true
  end
end
