class AddScoreIntegerToScores < ActiveRecord::Migration[6.0]
  def change
    add_column( :scores, :score, :integer)
  end
end
