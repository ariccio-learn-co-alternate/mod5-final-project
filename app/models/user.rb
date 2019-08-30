# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password
  validates :username, presence: true
  validates :email, presence: true, uniqueness: true
  validates :password_digest, presence: true
  has_many :score
  has_many :level, through: :score
  has_many :friend, foreign_key: :friend_id, class_name: 'UserFriend'
  # has_many

  def friend_scores
    # byebug
    puts "\n\n\tNOTIMPL\n\n"
  end
end