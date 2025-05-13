import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL; // Artık .env'den alınıyor

export const getPhoneNumber = async (): Promise<string> => {
  try {
    interface PhoneResponse {
      phoneNumber: string;
    }

    const response = await axios.get<PhoneResponse>(`${apiUrl}/phone`);
    return response.data.phoneNumber;
  } catch (error) {
    throw new Error('Telefon numarası alınamadı');
  }
};


export const updatePhoneNumber = async (phoneNumber: string): Promise<void> => {
  try {
    await axios.post(`${apiUrl}/updatePhone`, { phoneNumber });
  } catch (error) {
    throw new Error('Telefon numarası güncellenemedi');
  }
};
