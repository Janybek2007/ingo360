import React from 'react';

export const CompanyRate: React.FC = () => {
  const rateData = {
    count: 33,
  };

  return (
    <div className="h-[18.75rem] w-2/3 bg-white rounded-[1.25rem] p-6">
      <h1 className="text-lg font-semibold mb-4">Рейтинг компании</h1>
      <div className="flex items-center justify-center flex-col mt-2">
        <div className="text-4xl font-bold mt-2">{rateData.count}</div>
        <h3 className="text-center mt-2">Ваше место в рейтинге</h3>
      </div>
    </div>
  );
};
