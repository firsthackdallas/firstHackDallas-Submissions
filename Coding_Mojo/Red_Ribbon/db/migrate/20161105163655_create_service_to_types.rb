class CreateServiceToTypes < ActiveRecord::Migration
  def change
    create_table :service_to_types do |t|
      t.references :service_provider, index: true, foreign_key: true
      t.references :service_type, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
