class CreateLevels < ActiveRecord::Migration[6.0]
  def change
    create_table :levels do |t|
      t.references :score, index: {name: 'index_levels_on_score_id'}
      t.timestamps
    end
  end
end
