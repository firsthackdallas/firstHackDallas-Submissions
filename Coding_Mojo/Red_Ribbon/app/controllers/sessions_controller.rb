class SessionsController < ApplicationController
  def create
    @user = User.find_by(users_params[:email])
    if @user && @user.authenticate(:password)

    end
  end

  private

  def users_params
    params.require(:users).permit(:email, :password)
  end
end
