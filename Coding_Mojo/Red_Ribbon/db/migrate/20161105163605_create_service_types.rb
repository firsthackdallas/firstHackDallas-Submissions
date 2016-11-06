class CreateServiceTypes < ActiveRecord::Migration
  def change
    create_table :service_types do |t|
      t.string :name
      t.text :description

      t.timestamps null: false
    end
  end
end
