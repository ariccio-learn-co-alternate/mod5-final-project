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

  def user_params
    params.require(:user).permit(:username, :email, :password)
  end
end
