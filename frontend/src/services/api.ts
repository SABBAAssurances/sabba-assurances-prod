import axios from 'axios';
import { ApiResponse, EmailResponse, FormData, VehicleData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Configuration axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erreur API:', error);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Récupérer les informations d'un véhicule par plaque
  async getVehicleInfo(plaque: string): Promise<ApiResponse<VehicleData>> {
    try {
      const response = await apiClient.get(`/immatriculation?plaque=${encodeURIComponent(plaque)}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la récupération des informations du véhicule'
      };
    }
  },

  // Envoyer l'email de récapitulatif
  async sendEmailRecap(formData: FormData, vehicleData?: VehicleData): Promise<EmailResponse> {
    try {
      const response = await apiClient.post('/send-email-recap', {
        formData,
        vehicleData
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de l\'envoi de l\'email'
      };
    }
  },

  // Vérifier la santé du serveur
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response = await apiClient.get('/health');
      // Le backend renvoie {status: 'OK', message: '...'} sans propriété success
      // On doit adapter la réponse pour correspondre à notre interface
      return {
        success: response.data.status === 'OK',
        data: response.data,
        error: response.data.status !== 'OK' ? response.data.message : undefined
      };
    } catch (error: any) {
      return {
        success: false,
        error: 'Serveur indisponible'
      };
    }
  }
}; 