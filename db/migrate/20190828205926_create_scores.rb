class CreateScores < ActiveRecord::Migration[6.0]
  def change
    create_table :scores do |t|
      t.references :user, index: {name: 'index_scores_on_user_id'}
      t.timestamps
    end
  end
end
