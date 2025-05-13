import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const getPhoneNumber = async (): Promise<string> => {
  try {
    interface PhoneResponse {
      phoneNumber: string;
    }

    const response = await axios.get<PhoneResponse>(`${apiUrl}/phone`, {
      withCredentials: true,
    });

    return response.data.phoneNumber;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    }
    throw new Error('Telefon numarası alınamadı');
  }
};

export const updatePhoneNumber = async (phoneNumber: string): Promise<void> => {
  try {
    await axios.post(
      `${apiUrl}/updatePhone`,
      { phoneNumber },
      {
        withCredentials: true,
      }
    );
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    }
    throw new Error('Telefon numarası güncellenemedi');
  }
};
