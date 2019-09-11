require_relative '../controllers/levels_controller.rb'

class Score < ApplicationRecord
  belongs_to :user
  belongs_to :level
  validates_numericality_of :score, greater_than_or_equal_to: 0
  validates :level_id, presence: true
  # validates_numericality_of :score, :only_integer
  validate :max_score_level

  def max_score_level
    if level_id.present?
      max_possible_score = LevelsController::target_count(level_id)
      if (score > max_possible_score)
        errors.add(:score, 'too big')
      end
    else
      errors.add(:level_id, 'missing')
    end
  end
end
