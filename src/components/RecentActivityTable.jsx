function RecentActivityTable({ data }) {
  return (
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left font-medium text-gray-600">ID</th>
          <th className="px-4 py-2 text-left font-medium text-gray-600">Lesson Type</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((item) => (
          <tr key={item.id}>
            <td className="px-4 py-2">{item.id}</td>
            <td className="px-4 py-2">{item.type_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RecentActivityTable;
