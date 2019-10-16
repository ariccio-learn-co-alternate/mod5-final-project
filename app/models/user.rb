# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password
  validates :username, presence: true, uniqueness: true
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
    sorted_score = Score.find_by(user_id: id).sort_by{|s| s.score}.reverse
    sorted_score.each.map do |single_score|
      single_score.as_json(only: [:level_id, :score])
    end
  end

  def friend_scores
    # byebug
    my_friends = UserFriend.where(user_id: id)
    score_friends = my_friends.map do |friend|
      # byebug
      Score.where('user_id = ?', friend.friend_id)
    end
    score_friends_flat = score_friends.flatten
    score_friends_clean_with_self = score_friends_flat.filter do |score|
      score.score != 0
    end
    score_friends_clean = score_friends_clean_with_self.filter do |score|
      score.user_id != id
    end
    # byebug
    ordered_scores = score_friends_clean.sort_by{|score_friend| score_friend.score }.reverse.first(20)
    
    # Score id: 22, user_id: 7, created_at: "2019-09-09 19:36:58", updated_at: "2019-09-09 19:36:58", score: 5, level_id: 1
    # puts "\n\n\tNOTIMPL\n\n"
    ordered_scores_with_names = ordered_scores.map do |ordered_score|
      {
        id: ordered_score.id,
        user_id: ordered_score.user_id,
        username: User.find(ordered_score.user_id).username,
        time: ordered_score.updated_at,
        score: ordered_score.score,
        level_id: ordered_score.level_id
      }
    end
    # byebug
    ordered_scores_with_names
  end
end