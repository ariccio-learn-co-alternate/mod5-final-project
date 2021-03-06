# frozen_string_literal: true

require_relative '../utils/errors.rb'
def top_ten_all(ordered)
  ordered.each.map do |score|
    {
      user: score.user.username,
      user_id: score.user.id,
      score: score.score,
      level: score.level.id,
      time: score.updated_at
    }
  end
end

class ScoresController < ApplicationController
  def create
    @user = current_user
    @params_strong = score_create_params
    @all_params = {
      user_id: current_user.id,
      score: @params_strong[:score],
      level_id: @params_strong[:level_id]
    }
    # byebug
    @score = Score.create!(@all_params)
    # byebug
    render json: {
      score: @score.score
    }, status: :ok
  rescue ActiveRecord::RecordInvalid => e
    render json: {
      errors: create_activerecord_error('score not valid!', e)
    }, status: :unauthorized
  end

  def update
    @user = current_user
    update_params = score_update_params
    @level = Score.find_by(id: update_params.score_id)
    # byebug
  rescue ActiveRecord::RecordNotFound => e
    render json: {
      errors: create_activerecord_notfound_error('level not found!', e)
    }, status: :bad_request
  end

  def user_top_ten
    current_user.friend_scores
  end

  def show
    @ordered = Score.all.order('score DESC').limit(10)
    render json: {
      scores_top_ten_all: top_ten_all(@ordered),
      scores_friend_top_ten: user_top_ten
    }, status: :ok
  end

  def score_create_params
    params.require(:score).permit(:level_id, :score)
  end

  def score_update_params
    params.require(:score).permit(:score_id)
  end
end
