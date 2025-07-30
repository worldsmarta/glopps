import { useState, useEffect, useRef } from 'react';
import './LogisticsConsumer.css';
import LogisticsConsumerTable from './LogisticsConsumerTable';
import { getMarketConsumers, getLogisticsData, getAvailablePrefixes } from './Data';
import { Link } from 'react-router';

export default function LogisticsConsumer() {
  const [partNumber, setPartNumber] = useState('');
  const [prefix, setPrefix] = useState('');
  const [marketOptions, setMarketOptions] = useState([]);
  const [selectedMarketConsumer, setSelectedMarketConsumer] = useState('');
  const [pendingMarketConsumer, setPendingMarketConsumer] = useState('');
  const [marketConsumerDetails, setMarketConsumerDetails] = useState({
    id: '',
    gda: '',
    productArea: '',
    designation: '',
    name: ''
  });
  const [tableData, setTableData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false);
  const [isGotoDropdownOpen, setIsGotoDropdownOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const partInputRef = useRef(null);

  useEffect(() => {
    if (partInputRef.current) partInputRef.current.focus();
  }, []);

  useEffect(() => {
    setSelectedMarketConsumer('');
    setPendingMarketConsumer('');
    setMarketOptions([]);
    setMarketConsumerDetails({ id: '', gda: '', productArea: '', designation: '', name: '' });
    setTableData([]);
    setSelectedCheckboxes([]);
    setSelectedRadio(null);
    setErrorMessage('');
  }, [partNumber, prefix]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.custom-dropdown') && !event.target.closest('.goto-dropdown')) {
        setIsMarketDropdownOpen(false);
        setIsGotoDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = async () => {
  setErrorMessage('');

  if (!partNumber.trim()) {
    setErrorMessage('Part Id is required');
    return;
  }

  // ✅ If prefix is empty OR key doesn't exist → show PART ID IS MISSING
  const key = `${partNumber}|${prefix}`;
  const consumers = await getMarketConsumers(partNumber, prefix);

  if (!prefix.trim() || !consumers || consumers.length === 0) {
    setErrorMessage('PART ID IS MISSING');
    setMarketOptions([]);
    setMarketConsumerDetails({ id: '', gda: '', productArea: '', designation: '', name: '' });
    setTableData([]);
    return;
  }

  // ✅ Populate dropdown options
  setMarketOptions([{ id: '', label: '' }, ...consumers]);

  if (!pendingMarketConsumer.trim()) {
    setErrorMessage('Select Market Consumer');
    return;
  }

  // ✅ Extract name
  const selectedObj = consumers.find(c => c.label === pendingMarketConsumer);
  const nameValue = selectedObj?.name || '';

  const parts = pendingMarketConsumer.split(' - ');
  setMarketConsumerDetails({
    id: parts[0] || '',
    productArea: parts[1] || '',
    gda: parts[2] || '',
    designation: parts[3] || '',
    name: nameValue
  });

  // ✅ Load table data
  const consumerId = parts[0];
  const data = await getLogisticsData(partNumber, prefix, consumerId);
  setSelectedCheckboxes([]);
  setSelectedRadio(null);
  setTableData(data);
};


  const handleMarketConsumerClick = (label) => {
    setSelectedMarketConsumer(label);
    setPendingMarketConsumer(label);
    setIsMarketDropdownOpen(false);
    setErrorMessage('');
    setSelectedCheckboxes([]);
    setSelectedRadio(null);
    setTableData([]);
  };

  const handleCheckboxSelection = (selected) => {
    setSelectedCheckboxes(selected);
    setSelectedRadio(null);
  };

  const handleRadioSelection = (id) => {
    setSelectedRadio(id);
    setSelectedCheckboxes([]);
  };

  const handleAddConsumer = () => {
    const updated = tableData.map(row =>
      selectedCheckboxes.includes(row.id) ? { ...row, auto: 'N' } : row
    );
    setTableData(updated);
    setSelectedCheckboxes([]);
  };

  const handleDeleteClick = () => {
    if (selectedRadio) {
      setDeleteTarget(selectedRadio);
      setShowDeleteDialog(true);
    }
  };

  const confirmDelete = () => {
    const updated = tableData.map(row =>
      row.id === deleteTarget ? { ...row, auto: '' } : row
    );
    setTableData(updated);
    setSelectedRadio(null);
    setShowDeleteDialog(false);
    setDeleteTarget(null);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setDeleteTarget(null);
  };

  const handleClear = () => {
    setPartNumber('');
    setPrefix('');
    setMarketOptions([]);
    setSelectedMarketConsumer('');
    setPendingMarketConsumer('');
    setMarketConsumerDetails({ id: '', gda: '', productArea: '', designation: '', name: '' });
    setTableData([]);
    setSelectedCheckboxes([]);
    setSelectedRadio(null);
    setErrorMessage('');
    if (partInputRef.current) partInputRef.current.focus();
  };

  const selectedRadioConsumer = tableData.find(c => c.id === selectedRadio);
  const isDeleteEnabled = selectedRadioConsumer?.auto === 'N';

  return (
    <div className="background">
      <div className="center-content">
        <div className="form-container" style={{ justifyContent: 'space-between' }}>
          <Link to="/"><button className="button-primary">Home</button></Link>
          <p className="title">MDM Logistics Consumer</p>
          <button className="button-primary">User Manual</button>
        </div>

        <div className="error-banner form-container">
          {errorMessage ? errorMessage : <span className="error-placeholder">.</span>}
        </div>

        {/* Input Fields */}
        <div className="form-container">
          <div className="form-row">
            <label className="input-label">Part Id:</label>
            <input type="text" className="input-field" ref={partInputRef} value={partNumber} onChange={(e) => setPartNumber(e.target.value)} />
            <input type="text" className="input-field" style={{ width: '50px', marginRight: '30px' }} value={prefix} onChange={(e) => setPrefix(e.target.value)} />

            <label className="input-label">Market Consumer:</label>
            <div className={`custom-dropdown ${isMarketDropdownOpen ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setIsMarketDropdownOpen(prev => !prev); setIsGotoDropdownOpen(false); }}>
              <div className="selected">{selectedMarketConsumer || ' '}<span className="dropdown-arrow">▼</span></div>
              {isMarketDropdownOpen && marketOptions.length > 0 && (
                <ul className="dropdown-options">
                  {marketOptions.map((opt, i) => (
                    <li key={i} onClick={(e) => { e.stopPropagation(); handleMarketConsumerClick(opt.label); }}>
                      {opt.label || '\u00A0'}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

       

{/* ✅ Response Fields (Aligned & Stable) */}
<div className="form-container" style={{
  fontSize: '14px',
  fontWeight: 'bold',
  display: 'flex',
  flexDirection: 'row',
  marginTop: '10px',
  marginBottom: '10px',
  alignItems: 'center',
  justifyContent: 'flex-start'
}}>
  <p style={{ margin: 0, whiteSpace: 'nowrap' }}>Name:</p>
  <p style={{
    flex: '1 1 200px',
    maxWidth: '300px',
    marginLeft: '5px',
    marginRight: '10px',
    fontWeight: '500',
    height: '34px',
    lineHeight: '34px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }} title={marketConsumerDetails.name}>
    {marketConsumerDetails.name || '\u00A0'}
  </p>

  <p style={{ margin: 0, whiteSpace: 'nowrap' }}>Market Consumer ID:</p>
  <p style={{ width: '40px', flexShrink: 0, marginLeft: '5px', marginRight: '10px', fontWeight: '500', lineHeight: '34px' }}>
    {marketConsumerDetails.id}
  </p>

  {/* ✅ Product Area moved before GDA */}
  <p style={{ margin: 0, whiteSpace: 'nowrap' }}>Product Area:</p>
  <p style={{ width: '60px', flexShrink: 0, marginLeft: '5px', marginRight: '20px', fontWeight: '500', lineHeight: '34px' }}>
    {marketConsumerDetails.productArea}
  </p>

  <p style={{ margin: 0, whiteSpace: 'nowrap' }}>GDA:</p>
  <p style={{ width: '20px', flexShrink: 0, marginLeft: '5px', marginRight: '10px', fontWeight: '500', lineHeight: '34px' }}>
    {marketConsumerDetails.gda}
  </p>

  <p style={{ margin: 0, whiteSpace: 'nowrap' }}>Designation:</p>
  <p style={{
    flex: '1 1 100px',
    maxWidth: '100px',
    marginLeft: '5px',
    marginRight: '10px',
    fontWeight: '500',
    height: '34px',
    lineHeight: '34px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }} title={marketConsumerDetails.designation}>
    {marketConsumerDetails.designation || '\u00A0'}
  </p>
</div>


        {/* Action Buttons */}
        <div className="form-container" style={{ justifyContent: 'space-between', marginTop: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <button className="button-primary" onClick={handleSearch}>Search</button>
            <button className="button-primary" style={{ margin: '0px 20px' }} disabled={selectedCheckboxes.length === 0} onClick={handleAddConsumer}>Add Consumer</button>
            <button className="button-primary" disabled={!isDeleteEnabled} onClick={handleDeleteClick}>Delete</button>
          </div>

          <div className={`goto-dropdown ${isGotoDropdownOpen ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setIsGotoDropdownOpen(prev => !prev); setIsMarketDropdownOpen(false); }}>
            <div className="goto-button"><span>Go To</span><span className="goto-arrow">▼</span></div>
            {isGotoDropdownOpen && (
              <ul className="goto-options">
                <li>Global Part Info</li>
                <li>GDA Local Action</li>
              </ul>
            )}
          </div>

          <button className="button-primary" onClick={handleClear}>Clear</button>
        </div>

        {/* Table Component */}
        <LogisticsConsumerTable
          data={tableData}
          selectedCheckboxes={selectedCheckboxes}
          selectedRadio={selectedRadio}
          onCheckboxChange={handleCheckboxSelection}
          onRadioChange={handleRadioSelection}
        />

        {/* Delete Modal */}
        {showDeleteDialog && (
          <div className="modal-overlay">
            <div className="modal-box">
              <p>Do you want to delete?</p>
              <div className="modal-actions">
                <button className="button-primary" onClick={confirmDelete}>OK</button>
                <button className="button-secondary" onClick={cancelDelete} style={{ fontWeight: 'bold' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
