# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password
  validates :username, presence: true
  validates :email, presence: true, uniqueness: true
  validates :password_digest, presence: true
  has_many :score
  has_many :level, through: :score
end