import "./LogisticsConsumerTable.css";

export default function LogisticsConsumerTable({ data, selectedCheckboxes, selectedRadio, onCheckboxChange, onRadioChange }) {
  const existing = data.filter(row => row.auto === 'Y' || row.auto === 'N');
  const toAdd = data.filter(row => row.auto === '');

  const handleCheckboxChange = (id) => {
    const updated = selectedCheckboxes.includes(id)
      ? selectedCheckboxes.filter(item => item !== id)
      : [...selectedCheckboxes, id];
    onCheckboxChange(updated); // clears radio in parent
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <table className="modern-table">
        <thead>
          <tr>
            <th></th>
            <th>Logistics Consumer ID:</th>
            <th>Designation:</th>
            <th>City Code:</th>
            <th>Auto Flag:</th>
            <th>Resp. Change:</th>
            <th>Change Date:</th>
          </tr>
        </thead>
        <tbody>
          {/* Existing Consumers */}
          {existing.map(row => (
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
              <td>{row.resp}</td>
              <td>{row.date}</td>
            </tr>
          ))}

          {/* Label */}
          {toAdd.length > 0 && (
            <tr className="section-label">
              <td colSpan="7">Logistics Consumers to add:</td>
            </tr>
          )}

          {/* Consumers to Add */}
          {toAdd.map(row => (
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
