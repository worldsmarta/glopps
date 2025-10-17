import "../../Table.css";
import { fullProductAreaName } from "./Data";
export default function GdaLocalActionTable({
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
        <th onClick={() => handleSort(field, label)} title={`Sort by: ${label}`} style={{ cursor: 'pointer', position: 'relative' }}>
            {label}</th>
    );

    return (
        <div >
            <table className="table" >
                <thead>
                    <tr>
                        <th style={{ paddingLeft: '20px' }}></th>
                        {renderSortableHeader('prodarea', 'Prod. Area')}
                        {renderSortableHeader('gda', 'GDA')}
                        {renderSortableHeader('designation', 'Designation')}
                        {renderSortableHeader('consumer', 'Consumer')}
                        {renderSortableHeader('comp', 'Comp')}
                        {renderSortableHeader('lda', 'LDA')}
                        {renderSortableHeader('IntroDate', 'IntroDate')}
                        {renderSortableHeader('type', 'Type')}
                        {renderSortableHeader('qty', 'Qty')}
                        {renderSortableHeader('supcode', 'Sup.Code')}
                        {renderSortableHeader('orderfinal', 'Order Final')}
                        {renderSortableHeader('userid', 'User Id')}
                        {renderSortableHeader('chgdte', 'Chg Dte')}
                    </tr>
                </thead>

                <tbody>
                    {/* the first set of rows */}

                    {data.filter(row => row.IntroDate !== '' && row.userid !== '' && row.chgdte !== '').map(row => (
                        <tr key={row.id}>
                            <td className="center">
                                {row.type !== 'P' && ( <input type="radio" checked={selectedRadio === row.id} onChange={() => onRadioChange(row.id)}/> )}
                            </td>
                            <td title={fullProductAreaName(row.prodarea)}>{row.prodarea}</td> <td>{row.gda}</td><td>{row.designation}</td> <td>{row.consumer}</td> 
                            <td>{row.comp}</td><td>{row.lda}</td><td>{row.IntroDate}</td>
                            <td>{row.type}</td> <td>{row.qty}</td> <td>{row.supcode}</td> <td>{row.orderfinal}</td>
                            <td style={{ textDecoration: 'underline', cursor: 'pointer', color: '#1e4f91' }} 
                            onClick={() => row.userid && onUserClick(row.userid)}>{row.userid}</td>
                            <td>{row.chgdte}</td>
                        </tr>
                    ))}

                    {/* GDA/Add Consumers to add */}
                    {data.some(row => row.IntroDate === '' && row.userid === '' && row.chgdte === '' && row.consumer!=='') && (
                        <tr className="section-label">
                            <td colSpan={14}  style={{ fontWeight: 'bold' }}>GDA/Add Consumers to add:</td>
                        </tr>
                    )}                  
                    {data.filter(row => row.IntroDate === '' && row.userid === '' && row.chgdte === ''  && row.consumer!=='').map(row => (
                        <tr key={row.id}>
                            <td className="center">
                                <input type="checkbox" checked={selectedCheckboxes.includes(row.id)} onChange={() => handleCheckboxChange(row.id)} />
                            </td>
                            <td title={fullProductAreaName(row.prodarea)}>{row.prodarea}</td> <td>{row.gda}</td><td>{row.designation}</td> <td>{row.consumer}</td> <td>{row.comp}</td><td>{row.lda}</td><td>{row.IntroDate}</td>
                            <td>{row.type}</td> <td>{row.qty}</td> <td>{row.supcode}</td> <td>{row.orderfinal}</td><td >{row.userid}</td> <td>{row.chgdte}</td>
                        </tr>
                    ))}

                      {/* GDA/LDA to update*/}
                    {data.some(row => row.IntroDate === '' && row.userid === '' && row.chgdte === '' && row.consumer==='') && (
                        <tr className="section-label">
                            <td colSpan={14}  style={{ fontWeight: 'bold' }}>GDA/LDA to update:</td>
                        </tr>
                    )}                  
                    {data.filter(row => row.IntroDate === '' && row.userid === '' && row.chgdte === '' && row.consumer==='').map(row => (
                        <tr key={row.id}>
                            <td className="center">
                                 <input type="radio" checked={selectedRadio === row.id} onChange={() => onRadioChange(row.id)} />
                            </td>
                            <td title={fullProductAreaName(row.prodarea)}>{row.prodarea}</td> <td>{row.gda}</td><td>{row.designation}</td> <td>{row.consumer}</td> <td>{row.comp}</td><td>{row.lda}</td><td>{row.IntroDate}</td>
                            <td>{row.type}</td> <td>{row.qty}</td> <td>{row.supcode}</td> <td>{row.orderfinal}</td><td >{row.userid}</td> <td>{row.chgdte}</td>
                        </tr>
                    ))}

                </tbody>

            </table>
        </div>

    );
}