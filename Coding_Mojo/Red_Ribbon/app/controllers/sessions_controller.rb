class SessionsController < ApplicationController
  def create
    @user = User.find_by(users_params[:email])
    if @user && @user.authenticate(:password)
      session[:user_id] = @user.id
      redirect '/users'
    else
      flash[:errors] = "Wrong user name or password"
      redirect '/'
    end
  end

  def destroy
    session[:user_id] = nil
    redirect '/'
  end

  private

  def users_params
    params.require(:users).permit(:email, :password)
  end
end
