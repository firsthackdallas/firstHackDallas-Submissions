require 'test_helper'

class ServiceToTypesControllerTest < ActionController::TestCase
  setup do
    @service_to_type = service_to_types(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:service_to_types)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create service_to_type" do
    assert_difference('ServiceToType.count') do
      post :create, service_to_type: { service_provider_id: @service_to_type.service_provider_id, service_type_id: @service_to_type.service_type_id }
    end

    assert_redirected_to service_to_type_path(assigns(:service_to_type))
  end

  test "should show service_to_type" do
    get :show, id: @service_to_type
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @service_to_type
    assert_response :success
  end

  test "should update service_to_type" do
    patch :update, id: @service_to_type, service_to_type: { service_provider_id: @service_to_type.service_provider_id, service_type_id: @service_to_type.service_type_id }
    assert_redirected_to service_to_type_path(assigns(:service_to_type))
  end

  test "should destroy service_to_type" do
    assert_difference('ServiceToType.count', -1) do
      delete :destroy, id: @service_to_type
    end

    assert_redirected_to service_to_types_path
  end
end
