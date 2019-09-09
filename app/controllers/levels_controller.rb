# frozen_string_literal: true

require_relative '../utils/errors.rb'
LEVEL_ONE_MAP_STRING = {
  map_str:
    '################################' +
    '#                              #' +
    '#              #######         #' +
    '#   #              #           #' +
    '#   #         ##           #   #' +
    '#            #   #             #' +
    '#           #                  #' +
    '#          #      ##           #' +
    '#                          #   #' +
    '#          ##  ######          #' +
    '#          #        #          #' +
    '#          ###   #  #          #' +
    '#          #        #          #' +
    '#           #######            #' +
    '#                              #' +
    '#                              #' +
    '#                              #' +
    '#        #        ###          #' +
    '#         #                    #' +
    '#          #                   #' +
    '#    #      #                  #' +
    '#            #                 #' +
    '#             #                #' +
    '#       #      #               #' +
    '#        ##   ###              #' +
    '#                #             #' +
    '#                 #  #         #' +
    '#                  #           #' +
    '#    ##             #          #' +
    '#                    #         #' +
    '#                              #' +
    '################################',
    targets: [
      {
        x: 10,
        y: 8,
        angle: Math::PI/4
      },
      {
        x: 5,
        y: 6,
        angle: Math::PI/2
      },
      {
        x: 8,
        y: 8,
        angle: Math::PI/2
      },
      {
        x: 22,
        y: 14,
        angle: Math::PI/4
      },
      {
        x: 26,
        y: 17,
        angle: Math::PI/4
      },
      {
        x: 29,
        y: 2,
        angle: Math::PI/4
      },
      {
        x: 11,
        y: 15,
        angle: Math::PI/4
      },
      {
        x: 12,
        y: 14,
        angle: Math::PI/4
      },
      {
        x: 20,
        y: 25,
        angle: Math::PI/4
      }
    ]
}
class LevelsController < ApplicationController
  @@MAPS = [
    {
      name: 'one',
      id: '1',
      map: LEVEL_ONE_MAP_STRING
    }
  ]

  def show
    id = levels_params
    # byebug
    map = @@MAPS.find_index{|this_map| this_map[:id] == id }
    if map == nil
      render json: {
        errors: create_error('Map not found', "map #{levels_params[:id]} not found")
      }, status: :not_acceptable
    end
    # byebug
    render json: {
      map: @@MAPS[map][:map][:map_str],
      map_id: @@MAPS[map][:id],
      targets: @@MAPS[map][:map][:targets]
    }, status: :ok
  end

  def list
    maps = @@MAPS.map do |map|
      {
        name: map[:name],
        id: map[:id]
      }
    end
    render json: {
      maps: maps
    }, status: :ok

  end

  # def create
  #   @user = current_user
  #   byebug
  # end

  # def create_levels_params
  #   params.require(:level).permit(:score, :level_id)
  # end

  def levels_params
    params.require(:id)
  end
end