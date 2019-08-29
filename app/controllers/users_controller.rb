# frozen_string_literal: true

require_relative '../utils/errors.rb'

class UsersController < ApplicationController
  skip_before_action :authorized, only: [:create]

  include Errors

  def create
    begin
      @user = User.create!(user_params)
      token = encode_token(user_id: @user_id)
      render json: { jwt: token }, status: :created
    rescue ActiveRecord::RecordInvalid => invalid
      render json: {
        errors: create_activerecord_error("User info not valid!", invalid)
      }, status: :unauthorized
    end
  end

  def show
    begin
      @user = current_user
      # byebug
      render json: @user.as_json(only: [:username, :email])
    rescue ActiveRecord::RecordInvalid => invalid
      render json: {
        errors: create_activerecord_error("User somehow not found.", invalid)
      }, status: :unauthorized
    end
  end

  def user_params
    params.require(:user).permit(:username, :email, :password)
  end
end