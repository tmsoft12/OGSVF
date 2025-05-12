import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import { Info } from "lucide-react";

const HistoryDetail: React.FC = () => {
  const { category } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (category) {
      fetchHistoryData(category);
    }
  }, [category]);

  const fetchHistoryData = async (category: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/history/${category}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Veri çekilirken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
           <div className="container mx-auto px-4 py-6 max-w-7xl">
          <Header title={`${category?.toUpperCase()} Maglumatlary`} />
        </div>
    );

  }

  if (!data) {
    return (
      <>
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <Header title={`${category?.toUpperCase()} Maglumatlary`} />
        </div>
        <div className="flex flex-col items-center  text-center text-gray-400">
          <Info size={48} className="mb-4" />
          <p className="text-xl">Maglumat Yok</p>
          <p className="mt-2">Bu bölüme degişli maglumat tapylmady.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-gray-800 rounded-lg p-6 shadow-md border border-gray-700/30">
        <Header title={`${category} Detayları`} />
      </div>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item: any, index: number) => (
            <div
              key={index}
              className="bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-200"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">{item.timestamp}</span>
              </div>
              <div className="text-xl font-semibold text-white">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </>
  );
};
    
export default HistoryDetail;
