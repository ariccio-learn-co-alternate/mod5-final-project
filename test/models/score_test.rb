require 'test_helper'

class ScoreTest < ActiveSupport::TestCase
  test 'cannot create empty score' do
    assert_raise ActiveRecord::RecordInvalid do
      Score.create!()
    end
  end

  test 'cannot create negative score' do
    assert_raise ActiveRecord::RecordInvalid do
      Score.create!(user_id: 1, score: -1, level_id: 1)
    end
  end

  test 'cannot create giant score' do
    assert_raise ActiveRecord::RecordInvalid do
      Score.create!(user_id: 1, score: 10000, level_id: 1)
    end
  end

  test 'cannot create score without level' do
    assert_raise ActiveRecord::RecordInvalid do
      Score.create!(user_id: 1, score: 5)
    end
  end

  test 'cannot create score without user' do
    assert_raise ActiveRecord::RecordInvalid do
      Score.create!(score: 5, level_id: 1)
    end
  end
end
