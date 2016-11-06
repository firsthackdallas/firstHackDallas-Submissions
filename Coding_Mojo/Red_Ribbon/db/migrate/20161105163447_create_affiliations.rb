class CreateAffiliations < ActiveRecord::Migration
  def change
    create_table :affiliations do |t|
      t.references :service_provider, index: true, foreign_key: true
      t.string :affiliation

      t.timestamps null: false
    end
  end
end
