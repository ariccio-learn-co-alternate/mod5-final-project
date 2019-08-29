class AddLevelsToScoresAndRemoveScoreFromLevels < ActiveRecord::Migration[6.0]
  def change
    add_reference(:scores, :level, foreign_key: {to_table: :levels})
    remove_column(:levels, :score)
  end
end
