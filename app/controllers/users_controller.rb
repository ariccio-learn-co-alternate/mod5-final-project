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

  def show
    @user = current_user
    # byebug
    render json: @user.as_json(only: [:username, :email])
  rescue ActiveRecord::RecordInvalid => e
    render json: {
      errors: create_activerecord_error('User somehow not found.', e)
    }, status: :unauthorized
  end

  def search
    # byebug
    users = User.where(username: user_search_params[:username]).where.not(id: current_user.id);
    # users.filter!
    # byebug
    if users == nil
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
    }
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
