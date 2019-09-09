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
    my_friends = UserFriend.where(user_id: id)
    friends_mapped = []
    my_friends.map do |friend|
      # This is currently broken mostly. Something is wrong with creating friends.
      # byebug
      friends_mapped << User.find(friend.friend_id).as_json(only: [:username, :email]) unless friend.friend_id == id
      # User.find(friend.friend_id).as_json(only: [:username, :email]) unless friend.friend_id == id
    end
    # byebug
    friends_mapped.filter!{|f| f != nil}
    # byebug
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
    my_friends = UserFriend.where(user_id: id)
    score_friends = my_friends.map do |friend|
      # byebug
      Score.where('user_id = ?', friend.user_id)
    end
    score_friends_flat = score_friends.flatten
    score_friends_clean = score_friends_flat.filter do |score|
      score.score != 0
    end
    # byebug
    ordered_scores = score_friends_clean.sort_by{|score_friend| score_friend.score }.reverse.first(10)
    # byebug
    # puts "\n\n\tNOTIMPL\n\n"
    ordered_scores
  end
end