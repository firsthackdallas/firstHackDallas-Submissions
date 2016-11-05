class CreateServicesFolloweds < ActiveRecord::Migration
  def change
    create_table :services_followeds do |t|
      t.references :user, index: true, foreign_key: true
      t.references :service_provider, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
