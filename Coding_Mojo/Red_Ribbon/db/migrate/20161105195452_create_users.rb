class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :screen_name
      t.string :email
      t.string :password_digest
      t.integer :user_level

      t.timestamps null: false
    end
  end
end
