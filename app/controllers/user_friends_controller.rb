# frozen_string_literal: true

require_relative '../utils/errors.rb'

class UserFriendsController < ApplicationController
  def create
    @new_friend = UserFriend.create!(user_id: current_user.id, friend_id: user_friends_params[:friend_id])
    byebug
  end

  def user_friends_params
    params.require(:user).permit(:friend_id)
  end

end