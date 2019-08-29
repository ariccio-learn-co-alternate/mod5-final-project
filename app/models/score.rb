class Score < ApplicationRecord
  belongs_to :user
  belongs_to :level
  validates_numericality_of :score, greater_than_or_equal_to: 0
  # validates_numericality_of :score, :only_integer
end
