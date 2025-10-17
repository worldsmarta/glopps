import "../../Table.css";

export default function HazardousJobQueueTable({
    data, selectedCheckboxes, selectedRadio, onCheckboxChange, onRadioChange, onSort, setSortField }) {

    const handleCheckboxChange = (id) => {
        const updated = selectedCheckboxes.includes(id) ? selectedCheckboxes.filter(item => item !== id) : [...selectedCheckboxes, id];
        onCheckboxChange(updated);
    };

    const handleSort = (field, label) => {
        setSortField(label);
        onSort(field, label);
    };

    const renderSortableHeader = (field, label) => (
        <th onClick={() => handleSort(field, label)} title={`Sort by: ${label}`} style={{ cursor: 'pointer', position: 'relative' }}>
            {label}
        </th>
    );

    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th style={{ paddingLeft: '20px' }}></th>
                        {renderSortableHeader('partId', 'Part Id')}
                        {renderSortableHeader('description', 'Description')}
                        {renderSortableHeader('dangerousCode', 'Dangerous Code')}
                        {renderSortableHeader('introDate', 'IntroDate')}
                        {renderSortableHeader('jobDate', 'JobO Date')}
                        {renderSortableHeader('psuNumber', 'PSU')}
                    </tr>
                </thead>

                <tbody>
                    {data.map(row => (
                        <tr key={row.id}>
                            <td className="center">
                                <input 
                                    type="radio" 
                                    checked={selectedRadio === row.id} 
                                    onChange={() => onRadioChange(row.id)} 
                                />
                            </td>
                            <td style={{ textDecoration: 'underline', cursor: 'pointer', color: '#1e4f91' }}>
                                {row.partId}
                            </td>
                            <td>{row.description}</td>
                            <td>{row.dangerousCode}</td>
                            <td>{row.introDate}</td>
                            <td>{row.jobDate}</td>
                            <td style={{ textDecoration: 'underline', cursor: 'pointer', color: '#1e4f91' }}>
                                {row.psuNumber}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}