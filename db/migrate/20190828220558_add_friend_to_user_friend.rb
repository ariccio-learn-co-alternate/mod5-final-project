class AddFriendToUserFriend < ActiveRecord::Migration[6.0]
  def change
    add_reference(:user_friends, :friend, foreign_key: {to_table: :users})
  end
end
