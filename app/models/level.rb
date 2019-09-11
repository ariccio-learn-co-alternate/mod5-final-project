class Level < ApplicationRecord
  has_many :score
  has_many :user, through: :score
  validates :level_name, presence: true
end
