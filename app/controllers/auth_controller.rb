# frozen_string_literal: true

require_relative '../utils/errors.rb'
# I am literally pulling this whole file from my mod 4 project.

class AuthController < ApplicationController
  skip_before_action :authorized, only: [:create]

  def create
    @user = User.find_by(email: user_login_params[:username])
    #User#authenticate comes from BCrypt
    if @user && @user.authenticate(user_login_params[:password])
      # encode token comes from ApplicationController
      token = encode_token({ user_id: @user.id })
      render json: { username: @user.email, jwt: token }, status: :accepted
    else
      render json: {
        errors: create_error('Invalid username or password!', :not_acceptable.to_s)
      }, status: :unauthorized
    end
  end
 
  private
 
  def user_login_params
    # params { user: {username: 'Chandler Bing', password: 'hi' } }
    params.require(:user).permit(:username, :password)
  end
end