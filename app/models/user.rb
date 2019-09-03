# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password
  validates :username, presence: true
  validates :email, presence: true, uniqueness: true
  validates :password_digest, presence: true
  has_many :score
  has_many :level, through: :score
  has_many :friend, -> {distinct}, foreign_key: :friend_id, class_name: 'UserFriend'
  # has_many

  def get_friends
    # byebug
    friends_mapped = friend.map do |friend|
      byebug
      User.find(friend.id).as_json(only: [:username, :email]) unless friend.id == id
    end
    friends_mapped.filter!{|f| f != nil}
    friends_mapped
  end

  def my_scores
    # byebug
    score.each.map do |single_score|
      single_score.as_json(only: [:level_id, :score])
    end
  end

  def friend_scores
    # byebug
    puts "\n\n\tNOTIMPL\n\n"
  end
end