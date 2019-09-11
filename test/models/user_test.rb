# frozen_string_literal: true

require "test_helper"

class UserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
  test 'has at least a user' do
    assert !(User.all.empty?)
    assert_not_nil User.first.username
  end

  test 'cannot create a totally empty user' do
    assert_raise ActiveRecord::RecordInvalid do
      User.create!()
    end
  end

  test 'cannot create a user without a username' do
    assert_raise ActiveRecord::RecordInvalid do
      User.create!(username: nil, password: 'f', email: 'f')
    end
    assert_raise ActiveRecord::RecordInvalid do
      User.create!(password: 'f', email: 'f')
    end
  end

  test 'cannot create a user without a password' do
    assert_raise ActiveRecord::RecordInvalid do
      User.create!(username: 'f', password: nil, email: 'f')
    end
    assert_raise ActiveRecord::RecordInvalid do
      User.create!(username: 'f', email: 'f')
    end
  end

  test 'cannot duplicate emails' do
    assert_raise ActiveRecord::RecordInvalid do
      User.create!(username: 'f', email: 'firstUser@icloud.com', password: 'f')
    end
  end

  test 'cannot duplicate usernames' do
    assert_raise ActiveRecord::RecordInvalid do
      User.create!(username: 'FirstUser', email: 'f', password: 'f')
    end
  end
  
end