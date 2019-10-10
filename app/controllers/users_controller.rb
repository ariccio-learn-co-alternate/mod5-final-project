# frozen_string_literal: true

require_relative '../utils/errors.rb'

class UsersController < ApplicationController
  skip_before_action :authorized, only: [:create]

  include Errors

  def create
    @user = User.create!(user_params)
    token = encode_token(user_id: @user_id)
    render json: { jwt: token }, status: :created
  rescue ActiveRecord::RecordInvalid => e
    render json: {
      errors: create_activerecord_error('User info not valid!', e)
    }, status: :unauthorized
  end

  def show_friends
    @user = current_user
    friends = @user.get_friends
    # byebug
    render json: {
      users: friends
      }, status: :ok
  rescue ActiveRecord::RecordNotFound => e
      render json: {
        errors: create_activerecord_notfound_error('user somehow not found?', e)
      }, status: :bad_request
  rescue ActiveRecord::RecordInvalid => e
    render json: {
      errors: create_activerecord_error('User somehow not found.', e)
    }, status: :unauthorized
  end

  def show
    @user = current_user
    render json: {
      user_info: @user.as_json(only: [:username, :email]),
      user_scores: @user.my_scores
    }, status: :ok
  rescue ActiveRecord::RecordInvalid => e
    render json: {
      errors: create_activerecord_error('User somehow not found.', e)
    }, status: :unauthorized
  end

  def search
    users = User.where(username: user_search_params[:username]).where.not(id: current_user.id);
    if users == nil
      render json: {
        users: []
      }, status: :ok
      return
    end

    if users.length == 0
      render json: {
        users: []
      }, status: :ok
      return
    end
    render json: {
      users: users.each.map do |user|
        {
          user: user.username,
          user_id: user.id
        }
      end
    }, status: :ok
    # byebug
  end

  def user_params
    params.require(:user).permit(:username, :email, :password)
  end

  def user_search_params
    # byebug
    params.require(:user).permit(:username)
  end
end
