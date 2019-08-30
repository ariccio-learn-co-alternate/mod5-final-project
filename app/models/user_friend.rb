class UserFriend < ApplicationRecord
  belongs_to :friend, class_name: 'User'
  # belongs_to :friend_right, class_name: 'User'
  # validates :friend_id
end
