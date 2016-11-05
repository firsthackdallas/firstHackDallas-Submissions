class CreateZipToProviders < ActiveRecord::Migration
  def change
    create_table :zip_to_providers do |t|
      t.references :zip, index: true, foreign_key: true
      t.references :service_provider, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
