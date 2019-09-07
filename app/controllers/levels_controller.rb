# frozen_string_literal: true

require_relative '../utils/errors.rb'
LEVEL_ONE_MAP_STRING =
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
'################################';

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
    render json: {
      map: @@MAPS[map][:map],
      map_id: @@MAPS[map][:id]
    }, status: :ok
  end

  def levels_params
    params.require(:id)
  end
end