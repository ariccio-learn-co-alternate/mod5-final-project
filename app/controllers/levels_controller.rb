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
    map = @@MAPS.find_index{|map| map[:id] == id }
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