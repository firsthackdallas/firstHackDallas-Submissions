class CreateServiceProviders < ActiveRecord::Migration
  def change
    create_table :service_providers do |t|
      t.string :name
      t.text :description
      t.string :website
      t.text :hours

      t.timestamps null: false
    end
  end
end
