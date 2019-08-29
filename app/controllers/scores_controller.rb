# frozen_string_literal: true

require_relative '../utils/errors.rb'

class ScoresController < ApplicationController

  def create
    begin
      @score = Score.create!(score_create_params)
      render json: {
        score: @score.score
      }, status: :ok
    rescue ActiveRecord::RecordInvalid => invalid
      render json: {
        errors: create_activerecord_error("score not valid!", invalid)
      }, status: :unauthorized
    end
  end

  def update
    begin
      @user = current_user
      byebug
      update_params = score_update_params
      @level = Score.find_by(id: update_params.score_id)
      byebug
    rescue ActiveRecord::RecordNotFound => notFound
      render json: {
        errors: create_activerecord_error("level not found!", notFound)
      }, status: :bad_request
    end
  end

  def show
    @ordered = Score.all.order("score DESC")
    # byebug
    render json: {
      scores: @ordered.each.map{|score| {user: score.user.username, score: score.score, level: score.level.id} } 
    }, status: :ok
  end

  def score_create_params
    params.require(:score).permit(:user, :level, :score)
  end

  def score_update_params
    params.require(:score).permit(:score_id)
  end

end