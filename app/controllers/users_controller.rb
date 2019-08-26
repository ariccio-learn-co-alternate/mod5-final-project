# frozen_string_literal: true

require_relative '../utils/errors.rb'


class UsersController < ApplicationController
  skip_before_action :authorized, only: [:create]

  def create
    begin
      @user = User.create!(user_params)
      token = encode_token(user_id: @user_id)
      render json: {
        jwt: token
      }, status: :created
    rescue ActiveRecord::RecordInvalid => invalid
      render json: {
        errors: create_error("User info not valid!", invalid.record.errors)
      }, status: :unauthorized
    end
  end

  def user_params
    params.require(:user).permit(:username, :email, :password)
  end
end