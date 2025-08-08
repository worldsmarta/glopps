import "./LogisticsConsumerTable.css";

export default function LogisticsConsumerTable({
  data,
  selectedCheckboxes,
  selectedRadio,
  onCheckboxChange,
  onRadioChange,
  onSort,
  onUserClick,
  sortField,
  setSortField
}) {
  const handleCheckboxChange = (id) => {
    const updated = selectedCheckboxes.includes(id)
      ? selectedCheckboxes.filter(item => item !== id)
      : [...selectedCheckboxes, id];
    onCheckboxChange(updated);
  };

  const handleSort = (field, label) => {
    setSortField(label);  // ✅ update parent state
    onSort(field, label);
  };

  const renderSortableHeader = (field, label) => (
    <th
      onClick={() => handleSort(field, label)}
      title={`Sort by: ${label}`}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      {label}
    </th>
  );

  return (
    <div style={{ marginTop: '20px' }}>
      <table className="modern-table">
        <thead>
          <tr>
            <th></th>
            {renderSortableHeader('id', 'Logistics Consumer ID')}
            {renderSortableHeader('designation', 'Designation')}
            {renderSortableHeader('city', 'City Code')}
            {renderSortableHeader('auto', 'Auto Flag')}
            {renderSortableHeader('resp', 'Resp. Change')}
            {renderSortableHeader('date', 'Change Date')}
          </tr>
        </thead>
        <tbody>
          {/* Existing */}
          {data.filter(row => row.auto === 'Y' || row.auto === 'N').map(row => (
            <tr key={row.id}>
              <td className="center">
                <input
                  type="radio"
                  name="consumer"
                  checked={selectedRadio === row.id}
                  onChange={() => onRadioChange(row.id)}
                />
              </td>
              <td>{row.id}</td>
              <td>{row.designation}</td>
              <td>{row.city}</td>
              <td>{row.auto}</td>
              <td
                style={{ textDecoration:'underline', cursor: 'pointer', color:'#1e4f91' }}
                onClick={() => row.resp && onUserClick(row.resp)}
              >
                {row.resp}
              </td>
              <td>{row.date}</td>
            </tr>
          ))}

          {/* To Add */}
          {data.some(row => row.auto === '') && (
            <tr className="section-label">
              <td colSpan="7" style={{ fontWeight: 'bold' }}>Logistics Consumers to add:</td>
            </tr>
          )}

          {data.filter(row => row.auto === '').map(row => (
            <tr key={row.id}>
              <td className="center">
                <input
                  type="checkbox"
                  checked={selectedCheckboxes.includes(row.id)}
                  onChange={() => handleCheckboxChange(row.id)}
                />
              </td>
              <td>{row.id}</td>
              <td>{row.designation}</td>
              <td>{row.city}</td>
              <td>{row.auto}</td>
              <td>{row.resp}</td>
              <td>{row.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
