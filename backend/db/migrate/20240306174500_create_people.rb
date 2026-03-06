class CreatePeople < ActiveRecord::Migration[7.2]
  def change
    create_table :people do |t|
      t.string :email, null: false
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :phone
      t.string :company

      t.timestamps null: false
    end

    # Add indexes for customer management
    add_index :people, :email, unique: true
    add_index :people, [ :first_name, :last_name ]
  end
end
