require 'test_helper'

class ZipToProvidersControllerTest < ActionController::TestCase
  setup do
    @zip_to_provider = zip_to_providers(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:zip_to_providers)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create zip_to_provider" do
    assert_difference('ZipToProvider.count') do
      post :create, zip_to_provider: { service_provider_id: @zip_to_provider.service_provider_id, zip_id: @zip_to_provider.zip_id }
    end

    assert_redirected_to zip_to_provider_path(assigns(:zip_to_provider))
  end

  test "should show zip_to_provider" do
    get :show, id: @zip_to_provider
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @zip_to_provider
    assert_response :success
  end

  test "should update zip_to_provider" do
    patch :update, id: @zip_to_provider, zip_to_provider: { service_provider_id: @zip_to_provider.service_provider_id, zip_id: @zip_to_provider.zip_id }
    assert_redirected_to zip_to_provider_path(assigns(:zip_to_provider))
  end

  test "should destroy zip_to_provider" do
    assert_difference('ZipToProvider.count', -1) do
      delete :destroy, id: @zip_to_provider
    end

    assert_redirected_to zip_to_providers_path
  end
end
