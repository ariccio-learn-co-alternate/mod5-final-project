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
end