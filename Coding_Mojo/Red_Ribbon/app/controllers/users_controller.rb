class UsersController < ApplicationController
  before_action :get_user, only: [:index, :show, :edit]

      def index
        if session[:user_id] == nil
          flash[:message] = ["You must log in to do that"]
          redirect_to :root
        elsif session[:user_id]
          render 'users/index'
        end
      end

      def show
        @user = User.find(params[:id])
      end
  
      def new
        @user = User.new
      end

      def create
        @user = User.new(user_params)
        if @user.save
            User.find(@user.id).update(user_level: 1)
            session[:user_id] = @user.id
            #session[:user] = {id:@user.id, user_level: @user.user_level }
            redirect_to "/users"
        else
            flash[:message] = @user.errors.full_messages
            redirect_to "/users/new"
        end
      end

      def edit
        @user = User.find(params[:id])
      end

      def update
        @user = User.find(params[:id])
        if @user.update_attributes(user_params)
              redirect_to "/users"
        else 
              flash[:message] = @user.errors.full_messages
              redirect_to "/users/#{@user.id}/edit"
        end
      end

      private
      def get_user
        @user = User.find(session[:user_id])
      end

      def user_params
        params.require(:users).permit(:screen_name, :email, :password, :password_confirmation)
      end

end 