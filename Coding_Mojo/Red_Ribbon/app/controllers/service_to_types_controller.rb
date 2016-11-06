class ServiceToTypesController < ApplicationController
  before_action :set_service_to_type, only: [:show, :edit, :update, :destroy]

  # GET /service_to_types
  # GET /service_to_types.json
  def index
    @service_to_types = ServiceToType.all
  end

  # GET /service_to_types/1
  # GET /service_to_types/1.json
  def show
  end

  # GET /service_to_types/new
  def new
    @service_to_type = ServiceToType.new
  end

  # GET /service_to_types/1/edit
  def edit
  end

  # POST /service_to_types
  # POST /service_to_types.json
  def create
    @service_to_type = ServiceToType.new(service_to_type_params)

    respond_to do |format|
      if @service_to_type.save
        format.html { redirect_to @service_to_type, notice: 'Service to type was successfully created.' }
        format.json { render :show, status: :created, location: @service_to_type }
      else
        format.html { render :new }
        format.json { render json: @service_to_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /service_to_types/1
  # PATCH/PUT /service_to_types/1.json
  def update
    respond_to do |format|
      if @service_to_type.update(service_to_type_params)
        format.html { redirect_to @service_to_type, notice: 'Service to type was successfully updated.' }
        format.json { render :show, status: :ok, location: @service_to_type }
      else
        format.html { render :edit }
        format.json { render json: @service_to_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /service_to_types/1
  # DELETE /service_to_types/1.json
  def destroy
    @service_to_type.destroy
    respond_to do |format|
      format.html { redirect_to service_to_types_url, notice: 'Service to type was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_service_to_type
      @service_to_type = ServiceToType.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def service_to_type_params
      params.require(:service_to_type).permit(:service_provider_id, :service_type_id)
    end
end
