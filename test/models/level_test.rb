require 'test_helper'

class LevelTest < ActiveSupport::TestCase
  test 'cannot create empty level' do
    assert_raise ActiveRecord::RecordInvalid do 
      Level.create!()
    end
  end
end
