class AddNameToLevels < ActiveRecord::Migration[6.0]
  def change
    add_column :levels, :level_name, :string
  end
end
