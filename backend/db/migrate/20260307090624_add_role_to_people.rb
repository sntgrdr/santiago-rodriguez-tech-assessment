class AddRoleToPeople < ActiveRecord::Migration[7.2]
  def change
    add_column :people, :role, :integer, default: 0, null: false
  end
end
