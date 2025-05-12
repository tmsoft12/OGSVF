import React, { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { getPhoneNumber, updatePhoneNumber } from "./api/phone";

const PhoneNumberChange: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const number = await getPhoneNumber();
        setPhoneNumber(number);
      } catch (error) {
        setError("Telefon belgisi alnyp bilinmedi.");
      }
    };

    fetchPhoneNumber();
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setProgress(50);

    try {
      await updatePhoneNumber(phoneNumber);
      setProgress(100);
      setSuccessMessage("Telefon belgiňiz üstünlikli täzelendi!");
    } catch (error) {
      setError("Telefon belgini täzeläp bolmady.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-gray-800/90 rounded-lg p-6 shadow-md border border-gray-700/30">
      {/* Başlyk */}
      <div className="flex items-center mb-4">
        <div className="mr-3 p-2 bg-blue-600/20 rounded-full">
          <Phone size={20} className="text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Telefon Belgisi</h3>
          <p className="text-sm text-gray-400">
            Täze telefon belgiňizi giriziň
          </p>
        </div>
      </div>

      {/* Forma */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm text-gray-300 mb-1">
            Telefon
          </label>
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className="w-full p-2 bg-gray-700/50 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 placeholder-gray-400 text-sm"
            placeholder="+993 65 123456"
            aria-describedby="phone-error"
            disabled={isSubmitting}
          />
        </div>
        <div className="mt-2 bg-gray-700/50 rounded-md flex  items-center">
          <svg
            className="w-5 h-5 text-yellow-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
          </svg>
          <p className="mt-2 text-sm text-white-900">
            Üns beriň! Bu ýere girizen telefon belgiňiz, serwer otagynda howp ýüze çykanda SMS habarnama ibermek üçin ulanylýar.
          </p>
        </div>
        <br />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          disabled={isSubmitting}
          aria-label={isSubmitting ? "Täzelenýär..." : "Täzele"}
        >
          {isSubmitting ? "Täzelenýär..." : "Täzele"}
        </button>
      </form>

      {/* Progres bar */}
      {isSubmitting && (
        <div className="mt-4 text-center">
          <div className="text-sm font-medium text-gray-300">Ýüklenýär...</div>
          <div className="mt-2 w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Habarnamalar */}
      {error && (
        <div
          className="mt-4 p-2 bg-red-500/10 text-red-400 rounded-md flex items-center text-sm"
          id="phone-error"
          role="alert"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}
      {successMessage && (
        <div
          className="mt-4 p-2 bg-green-500/10 text-green-400 rounded-md flex items-center text-sm"
          role="alert"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default PhoneNumberChange;
