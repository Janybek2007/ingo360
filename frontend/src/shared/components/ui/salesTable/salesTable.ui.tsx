import React from 'react';

interface TableRow {
  place: number;
  company: string;
  sales: number;
  status: string;
  lapseTime: string;
  approval: string;
}

const generateRandomData = (count: number): TableRow[] => {
  const companies = [
    'Google',
    'Apple',
    'Microsoft',
    'Amazon',
    'Tesla',
    'Meta',
    'Adobe',
    'Samsung',
    'Nike',
    'Coca-Cola',
  ];
  const statuses = ['Active', 'Pending', 'Inactive', 'Completed'];
  const approvals = ['Approved', 'Rejected', 'Pending'];

  return Array.from({ length: count }, (_, i) => ({
    place: i + 1,
    company: companies[Math.floor(Math.random() * companies.length)],
    sales: Math.floor(Math.random() * 10000),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    lapseTime: `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
    approval: approvals[Math.floor(Math.random() * approvals.length)],
  }));
};

export const SalesTable: React.FC<{ rowsCount?: number }> = ({
  rowsCount = 5,
}) => {
  const data = generateRandomData(rowsCount);

  return (
    <div className="bg-white rounded-[13px] p-4 m-5 shadow-md w-full">
      <table className="w-full text-left border-collapse h-auto">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="px-4 py-2">Место</th>
            <th className="px-4 py-2">Компания</th>
            <th className="px-4 py-2">Сумма продаж</th>
            <th className="px-4 py-2">Статус</th>
            <th className="px-4 py-2">Lapse Time</th>
            <th className="px-4 py-2">Approval</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-400">
          {data.map(row => (
            <tr
              key={row.place}
              className="hover:bg-gray-100 transition-colors border border-gray-200 rounded-[20px]"
            >
              <td className="px-4 py-4">{row.place}</td>
              <td className="px-4 py-4">{row.company}</td>
              <td className="px-4 py-4">{row.sales.toLocaleString()}</td>
              <td className="px-4 py-4">{row.status}</td>
              <td className="px-4 py-4">{row.lapseTime}</td>
              <td className="px-4 py-4">{row.approval}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
