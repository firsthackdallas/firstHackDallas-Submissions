class ZipToProvidersController < ApplicationController
  before_action :set_zip_to_provider, only: [:show, :edit, :update, :destroy]

  # GET /zip_to_providers
  # GET /zip_to_providers.json
  def index
    @zip_to_providers = ZipToProvider.all
  end

  # GET /zip_to_providers/1
  # GET /zip_to_providers/1.json
  def show
  end

  # GET /zip_to_providers/new
  def new
    @zip_to_provider = ZipToProvider.new
  end

  # GET /zip_to_providers/1/edit
  def edit
  end

  # POST /zip_to_providers
  # POST /zip_to_providers.json
  def create
    @zip_to_provider = ZipToProvider.new(zip_to_provider_params)

    respond_to do |format|
      if @zip_to_provider.save
        format.html { redirect_to @zip_to_provider, notice: 'Zip to provider was successfully created.' }
        format.json { render :show, status: :created, location: @zip_to_provider }
      else
        format.html { render :new }
        format.json { render json: @zip_to_provider.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /zip_to_providers/1
  # PATCH/PUT /zip_to_providers/1.json
  def update
    respond_to do |format|
      if @zip_to_provider.update(zip_to_provider_params)
        format.html { redirect_to @zip_to_provider, notice: 'Zip to provider was successfully updated.' }
        format.json { render :show, status: :ok, location: @zip_to_provider }
      else
        format.html { render :edit }
        format.json { render json: @zip_to_provider.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /zip_to_providers/1
  # DELETE /zip_to_providers/1.json
  def destroy
    @zip_to_provider.destroy
    respond_to do |format|
      format.html { redirect_to zip_to_providers_url, notice: 'Zip to provider was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_zip_to_provider
      @zip_to_provider = ZipToProvider.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def zip_to_provider_params
      params.require(:zip_to_provider).permit(:zip_id, :service_provider_id)
    end
end
