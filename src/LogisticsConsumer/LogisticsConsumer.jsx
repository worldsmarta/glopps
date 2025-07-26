import { useState, useEffect, useRef } from 'react';
import './LogisticsConsumer.css';
import LogisticsConsumerTable from './LogisticsConsumerTable';
import { getMarketConsumers, getLogisticsData, getAvailablePrefixes } from './Data';
import {Link} from 'react-router';

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
    designation: ''
  });
  const [tableData, setTableData] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState(null);

  // ✅ New states for modal
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const partInputRef = useRef(null);
  useEffect(() => { if (partInputRef.current) partInputRef.current.focus(); }, []);

  useEffect(() => {
    setSelectedMarketConsumer('');
    setPendingMarketConsumer('');
    setMarketOptions([]);
    setMarketConsumerDetails({ id: '', gda: '', productArea: '', designation: '' });
    setTableData([]);
    setSelectedCheckboxes([]);
    setSelectedRadio(null);
    setErrorMessage('');
  }, [partNumber, prefix]);

  const handleSearch = async () => {
    setErrorMessage('');
    if (!partNumber.trim()) {
      setErrorMessage('Part Id is required');
      return;
    }
    if (!prefix.trim()) {
      const prefixes = getAvailablePrefixes(partNumber);
      setErrorMessage(prefixes.length ? `Part Prefix : ${prefixes.join(' ')}` : 'Part Prefix not found for given Part Id');
      return;
    }
    const consumers = await getMarketConsumers(partNumber, prefix);
    setMarketOptions([{ id: '', label: '' }, ...consumers]);
    if (!pendingMarketConsumer.trim()) {
      setErrorMessage('Select Market Consumer');
      return;
    }
    const parts = pendingMarketConsumer.split(' - ');
    setMarketConsumerDetails({
      id: parts[0] || '',
      gda: parts[1] || '',
      productArea: parts[2] || '',
      designation: parts[3] || ''
    });
    const consumerId = parts[0];
    const data = await getLogisticsData(partNumber, prefix, consumerId);
    setSelectedCheckboxes([]);
    setSelectedRadio(null);
    setTableData(data);
  };

  const handleMarketConsumerClick = (label) => {
    setSelectedMarketConsumer(label);
    setPendingMarketConsumer(label);
    setIsDropdownOpen(false);
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

  // ✅ Open delete modal
  const handleDeleteClick = () => {
    if (selectedRadio) {
      setDeleteTarget(selectedRadio);
      setShowDeleteDialog(true);
    }
  };

  // ✅ Confirm delete
  const confirmDelete = () => {
    const updated = tableData.map(row =>
      row.id === deleteTarget ? { ...row, auto: '' } : row
    );
    setTableData(updated);
    setSelectedRadio(null);
    setShowDeleteDialog(false);
    setDeleteTarget(null);
  };

  // ✅ Cancel delete
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
    setMarketConsumerDetails({ id: '', gda: '', productArea: '', designation: '' });
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
          <button className="button-primary">Home</button>
          <p className="title">MDM Logistics Consumer</p>
          <button className="button-primary">User Manual</button>
        </div>

        {/* ✅ Error Message (Fixed height to prevent layout shift) */}
        <div className="error-banner form-container">
          {errorMessage ? errorMessage : <span className="error-placeholder">.</span>}
        </div>


        <div className="form-container">
          <div className="form-row">
            <label className="input-label">Part Id:</label>
            <input type="text" className="input-field" ref={partInputRef}
              value={partNumber} onChange={(e) => setPartNumber(e.target.value)} />
            <input type="text" className="input-field" style={{ width: '50px', marginRight: '30px' }}
              value={prefix} onChange={(e) => setPrefix(e.target.value)} />

            <label className="input-label">Market Consumer:</label>
            <div className="custom-dropdown"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}>
              <div className="selected">{selectedMarketConsumer || ' '}<span className="dropdown-arrow">▼</span></div>
              {isDropdownOpen && marketOptions.length > 0 && (
                <ul className="dropdown-options">
                  {marketOptions.map((opt, i) => (
                    <li key={i} onClick={() => handleMarketConsumerClick(opt.label)}>
                      {opt.label || '\u00A0'}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="form-container" style={{
          fontSize: '14px', fontWeight: 'bold', display: 'flex',
          flexDirection: 'row', marginTop: '30px', marginBottom: '20px'
        }}>
          <p>Name:</p> <p style={{ width: '80px' }}></p>
          <p>Market Consumer ID:</p><p style={{ width: '40px', marginLeft: '5px', marginRight: '20px', fontWeight: '500' }}>{marketConsumerDetails.id}</p>
          <p>GDA:</p><p style={{ width: '60px', marginLeft: '5px', marginRight: '20px', fontWeight: '500' }}>{marketConsumerDetails.gda}</p>
          <p>Product Area:</p><p style={{ width: '50px', marginLeft: '5px', marginRight: '20px', fontWeight: '500' }}>{marketConsumerDetails.productArea}</p>
          <p>Designation:</p><p style={{ width: '50px', marginLeft: '5px', marginRight: '20px', fontWeight: '500' }}>{marketConsumerDetails.designation}</p>
        </div>

        <div className="form-container" style={{ justifyContent: 'space-between', marginTop: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <button className="button-primary" onClick={handleSearch}>Search</button>
            <button className="button-primary" style={{ margin: '0px 20px' }}
              disabled={selectedCheckboxes.length === 0} onClick={handleAddConsumer}>Add Consumer</button>
            <button className="button-primary" disabled={!isDeleteEnabled} onClick={handleDeleteClick}>Delete</button>
          </div>
          <div className="goto-dropdown" onMouseEnter={() => setIsDropdownOpen('goto')} onMouseLeave={() => setIsDropdownOpen(false)}>
            <div className="goto-button">
              <span>Go To</span>
              <span className="goto-arrow">▼</span>
            </div>
            {isDropdownOpen === 'goto' && (
              <ul className="goto-options">
                <li>Global Part Info</li>
                <li>GDA Local Action</li>
              </ul>
            )}
          </div>

          <button className="button-primary" onClick={handleClear}>Clear</button>
        </div>

        <LogisticsConsumerTable
          data={tableData}
          selectedCheckboxes={selectedCheckboxes}
          selectedRadio={selectedRadio}
          onCheckboxChange={handleCheckboxSelection}
          onRadioChange={handleRadioSelection}
        />

        {/* ✅ Delete Confirmation Modal */}
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
