import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import { Info } from "lucide-react";

const HistoryDetail: React.FC = () => {
  const { category } = useParams();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasPrev, setHasPrev] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const limit = 10; // Sayfa başına 10 veri
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // category → topic eşleme
  const mapCategoryToTopic = (category: string): string | null => {
    switch (category.toLowerCase()) {
      case "door":
        return "topic/door";
      case "fire":
        return "topic/fire";
      case "motion":
        return "topic/motion";
      case "temperature":
        return "topic/temprature";
      case "humidity":
        return "topic/humintity";
      default:
        return null;
    }
  };

  // Değerlerin dönüşüm fonksiyonu
  const formatValue = (category: string, value: string): string => {
    if (category === "door") {
      return value === "1" ? "Açyk" : "Yapyk";
    }
    if (category === "fire") {
      return value === "1" ? "Yangyn Bar" : "Yangyn Yok";
    }
    if (category === "motion") {
      return value === "1" ? "Hereket Bar" : "Hereket Yok";
    }
    if (category === "temperature") {
      return `${value} °C`;
    }
    if (category === "humidity") {
      return `${value} %`;
    }
    return value;
  };

  useEffect(() => {
    if (category) {
      fetchHistoryData(category, page);
    }
  }, [category, page]);

  const fetchHistoryData = async (category: string, page: number) => {
    if (!category) {
      setData([]);
      setLoading(false);
      return;
    }

    const topic = mapCategoryToTopic(category);
    if (!topic) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}/events/topic?topic=${encodeURIComponent(topic)}&page=${page}&limit=${limit}`
        );

      if (!response.ok) {
        throw new Error(`API isteği başarısız oldu: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result.data);
      setTotalCount(result.totalCount);
      setHasPrev(result.hasPrev);
      setHasNext(result.hasNext);
    } catch (error) {
      console.error("Veri çekilirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= Math.ceil(totalCount / limit)) {
      setPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Header title={`${category?.toUpperCase()} Maglumatlary`} />
        <p className="text-gray-400 mt-4">Ýüklenýär...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Header title={`${category?.toUpperCase()} Maglumatlary`} />
        <div className="flex flex-col items-center text-center text-gray-400">
          <Info size={48} className="mb-4" />
          <p className="text-xl">Maglumat Yok</p>
          <p className="mt-2">Bu bölüme degişli maglumat tapylmady.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <Header title={`${category?.toUpperCase()} Maglumatlary`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {data.map((item: any, index: number) => (
          <div
            key={index}
            className="bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-200"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">{item.timestamp}</span>
            </div>
            <div className="text-xl font-semibold text-white">
              {category ? formatValue(category, item.value) : item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={!hasPrev}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md ${!hasPrev ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Öňki
        </button>
        <span className="text-gray-600">
          Sayfa {page} / {Math.ceil(totalCount / limit)}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasNext}
          className={`px-4 py-2 bg-blue-500 text-white rounded-md ${!hasNext ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Soňky
        </button>
      </div>
    </div>
  );
};

export default HistoryDetail;
