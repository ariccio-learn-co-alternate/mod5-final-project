# frozen_string_literal: true

require_relative '../utils/errors.rb'

KEY_PATH = Rails.root.join('config', 'keys', 'private_key.key')

def encode_with_jwt(payload)
  key = IO.binread(KEY_PATH)
  if key.nil? || key.empty?
    raise StandardError
  end

  JWT.encode(payload, key)
end

def decode_with_jwt(payload)
  key = IO.binread(KEY_PATH)
  if key.nil? || key.empty?
    puts "Check your key file in #{KEY_PATH}"
    raise StandardError
  end
  JWT.decode(payload, key, true, algorithm: 'HS256')
end

class ApplicationController < ActionController::API
  # https://learn.co/tracks/module-4-web-development-immersive-2-1/auth/jwt-auth-in-rails/jwt-auth-rails
  before_action :authorized

  include Errors

  def encode_token(payload)
    encode_with_jwt(payload)
  end

  def auth_header
    # { Authorization: 'Bearer <token>' }
    # byebug
    request.headers['Authorization']
  end

  def decoded_token
    if auth_header
      token = auth_header.split(' ')[1]
      # header: { 'Authorization': 'Bearer <token>' }
      decode_with_jwt(token)
    else
      raise Error
    end
  end

  def current_user
    if decoded_token
      begin
        # byebug
        user_id = decoded_token[0]['user_id']
        @user = User.find(user_id)
        return @user
      rescue JWT::DecodeError => e
        render json: {
          errors: create_jwt_error('something went wrong with parsing the JWT', e)
        }
      rescue ActiveRecord::RecordNotFound => e
        render json: {
          errors: create_activerecord_notfound_error('user_id not found while looking up from decoded_token!', e)
        }
      end
    else
      render json: {
        errors: create_missing_auth_header('hmmm, decoded_token is falsy')
      }
    end
  end

  def logged_in?
    !!current_user
  end

  def authorized
    if !(logged_in?)
      render json: {
        errors: create_error('Please log in', :unauthorized.to_s),
        status: :unauthorized
      }
    end
  end
end
