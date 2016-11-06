class SessionsController < ApplicationController
  def create
    @user = User.find_by(email: users_params[:email])
    if @user && @user.authenticate(:password)
      session[:user_id] = @user.id
      redirect_to '/users'
    else
      flash[:message] = "Wrong user name or password"
      redirect_to '/'
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to '/'
  end

  private

  def users_params
    params.require(:users).permit(:email, :password)
  end
end
