# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20161105233309) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "addresses", force: :cascade do |t|
    t.string   "name"
    t.string   "address_1"
    t.string   "address_2"
    t.string   "city"
    t.string   "state"
    t.string   "zip_code"
    t.integer  "service_provider_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
  end

  add_index "addresses", ["service_provider_id"], name: "index_addresses_on_service_provider_id", using: :btree

  create_table "affiliations", force: :cascade do |t|
    t.integer  "service_provider_id"
    t.string   "affiliation"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
  end

  add_index "affiliations", ["service_provider_id"], name: "index_affiliations_on_service_provider_id", using: :btree

  create_table "contacts", force: :cascade do |t|
    t.integer  "service_provider_id"
    t.string   "name"
    t.string   "phone"
    t.string   "email"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
  end

  add_index "contacts", ["service_provider_id"], name: "index_contacts_on_service_provider_id", using: :btree

  create_table "service_providers", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.string   "website"
    t.text     "hours"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.integer  "user_id"
  end

  add_index "service_providers", ["user_id"], name: "index_service_providers_on_user_id", using: :btree

  create_table "service_to_types", force: :cascade do |t|
    t.integer  "service_provider_id"
    t.integer  "service_type_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
  end

  add_index "service_to_types", ["service_provider_id"], name: "index_service_to_types_on_service_provider_id", using: :btree
  add_index "service_to_types", ["service_type_id"], name: "index_service_to_types_on_service_type_id", using: :btree

  create_table "service_types", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "services_followeds", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "service_provider_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
  end

  add_index "services_followeds", ["service_provider_id"], name: "index_services_followeds_on_service_provider_id", using: :btree
  add_index "services_followeds", ["user_id"], name: "index_services_followeds_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "screen_name"
    t.string   "email"
    t.string   "password_digest"
    t.integer  "user_level"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  create_table "zip_to_providers", force: :cascade do |t|
    t.integer  "zip_id"
    t.integer  "service_provider_id"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
  end

  add_index "zip_to_providers", ["service_provider_id"], name: "index_zip_to_providers_on_service_provider_id", using: :btree
  add_index "zip_to_providers", ["zip_id"], name: "index_zip_to_providers_on_zip_id", using: :btree

  create_table "zips", force: :cascade do |t|
    t.string   "zip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "addresses", "service_providers"
  add_foreign_key "affiliations", "service_providers"
  add_foreign_key "contacts", "service_providers"
  add_foreign_key "service_providers", "users"
  add_foreign_key "service_to_types", "service_providers"
  add_foreign_key "service_to_types", "service_types"
  add_foreign_key "services_followeds", "service_providers"
  add_foreign_key "services_followeds", "users"
  add_foreign_key "zip_to_providers", "service_providers"
  add_foreign_key "zip_to_providers", "zips"
end
