# frozen_string_literal: true

require_relative '../utils/errors.rb'

class ScoresController < ApplicationController
  def create
    @score = Score.create!(score_create_params)
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
    byebug
  rescue ActiveRecord::RecordNotFound => e
    render json: {
      errors: create_activerecord_error('level not found!', e)
    }, status: :bad_request
  end

  def show
    @ordered = Score.all.order('score DESC')
    render json: {
      scores: @ordered.each.map do |score|
        {
          user: score.user.username,
          user_id: score.user.id,
          score: score.score,
          level: score.level.id
        }
      end
    }, status: :ok
  end

  def score_create_params
    params.require(:score).permit(:user, :level, :score)
  end

  def score_update_params
    params.require(:score).permit(:score_id)
  end
end
