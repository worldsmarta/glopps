import "./LogisticsConsumerTable.css";

export default function LogisticsConsumerTable({
  data, selectedCheckboxes, selectedRadio, onCheckboxChange, onRadioChange, onSort, onUserClick, setSortField }) {

  //checks if checkbox is selected or not
  const handleCheckboxChange = (id) => {
    const updated = selectedCheckboxes.includes(id) ? selectedCheckboxes.filter(item => item !== id) : [...selectedCheckboxes, id];
    onCheckboxChange(updated);
  };

  //handles the sorting function
  const handleSort = (field, label) => {
    setSortField(label);
    onSort(field, label);
  };

  //sorting based on columns
  const renderSortableHeader = (field, label) => (
    <th onClick={() => handleSort(field, label)} title={`Sort by: ${label}`} style={{ cursor: 'pointer', position: 'relative' }}>{label}</th>
  );

  return (
    <div className="table-container">
      <table className="logistics-table">
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
          {/* the rows above Logistics Consumer to Add */}

           {/* data.filter(row => row.auto === 'Y' || row.auto === 'N') filters the data array to get only the rows where the auto flag is 'Y' or 'N'. 
          It then uses .map() to iterate over these filtered rows and render a table row for each one. */}
          {data.filter(row => row.auto === 'Y' || row.auto === 'N').map(row => (
            <tr key={row.id}>
              <td className="center">
                <input type="radio" name="consumer" checked={selectedRadio === row.id} onChange={() => onRadioChange(row.id)}/>
              </td>
              <td>{row.id}</td>
              <td>{row.designation}</td>
              <td>{row.city}</td>
              <td>{row.auto}</td>
              <td style={{ textDecoration: 'underline', cursor: 'pointer', color: '#1e4f91' }} onClick={() => row.resp && onUserClick(row.resp)}>
                {row.resp}
              </td>
              <td>{row.date}</td>
            </tr>
          ))}


          {/* rows below Logistics Consumer To Add */}

          {/* data.some(row => row.auto === '') checks if any row in the data array has an empty auto flag. If this condition is true, 
          it renders a table row with a bold label "Logistics Consumers to add:" spanning all seven columns (colSpan="7"). */}
          {data.some(row => row.auto === '') && (
            <tr className="section-label">
              <td colSpan="7" style={{ fontWeight: 'bold' }}>Logistics Consumers to add:</td>
            </tr>
          )}

          {/* data.filter(row => row.auto === '') filters the data array to get only the rows where the auto flag is an empty string. 
          It then uses .map() to iterate over these filtered rows and render a table row for each one. */}
          {data.filter(row => row.auto === '').map(row => (
            <tr key={row.id}>
              <td className="center">
                <input type="checkbox" checked={selectedCheckboxes.includes(row.id)} onChange={() => handleCheckboxChange(row.id)}/>
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
