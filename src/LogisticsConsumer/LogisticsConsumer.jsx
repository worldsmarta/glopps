import { useState, useEffect, useRef } from 'react';
import './LogisticsConsumer.css';
import LogisticsConsumerTable from './LogisticsConsumerTable';
import { getMarketConsumers, getLogisticsData, getAvailablePrefixes } from './Data';
import { Link } from 'react-router';

export default function LogisticsConsumer() {
  useEffect(() => {
    document.title = "MDM Logistics Consumer";
  }, []);

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
  const nameRef = useRef(null);
  const designationRef = useRef(null);
  const [isNameTruncated, setIsNameTruncated] = useState(false);
  const [isDesignationTruncated, setIsDesignationTruncated] = useState(false);
  const [sortMessage, setSortMessage] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);




  useEffect(() => {
    if (partInputRef.current) partInputRef.current.focus();
  }, []);

  useEffect(() => {
    // Reset state when partNumber or prefix changes
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

  // ✅ Detect text overflow for tooltip dynamically
  useEffect(() => {
    if (nameRef.current) {
      setIsNameTruncated(nameRef.current.scrollWidth > nameRef.current.clientWidth);
    }
    if (designationRef.current) {
      setIsDesignationTruncated(designationRef.current.scrollWidth > designationRef.current.clientWidth);
    }
  }, [marketConsumerDetails]);

  // ✅ Handle Search
  const handleSearch = async () => {
    setErrorMessage('');

    if (!partNumber.trim()) {
      setErrorMessage('Part Id is required');
      return;
    }

    // Get all prefixes for entered part number
    const availablePrefixes = getAvailablePrefixes(partNumber);

    if (availablePrefixes.length === 0) {
      setErrorMessage('PART ID MISSING IN GLOPPS');
      clearTableAndOptions();
      return;
    }

    // Auto-fill prefix if only one exists
    let currentPrefix = prefix.trim();
    if (!currentPrefix && availablePrefixes.length === 1) {
      currentPrefix = availablePrefixes[0];
      setPrefix(currentPrefix);
    }

    // Show available prefixes if user didn't enter prefix
    if (!currentPrefix) {
      setErrorMessage(`PART PREFIX: ${availablePrefixes.join(' ')}`);
      clearTableAndOptions();
      return;
    }

    // Fetch market consumers
    const consumers = await getMarketConsumers(partNumber, currentPrefix);
    if (!consumers || consumers.length === 0) {
      setErrorMessage('PART ID IS MISSING');
      clearTableAndOptions();
      return;
    }

    // Populate dropdown
    setMarketOptions([{ id: '', label: '' }, ...consumers]);

    // If no market consumer is selected yet → show message
    if (!pendingMarketConsumer.trim()) {
      setErrorMessage('Select Market Consumer');
      return;
    }

    // Extract consumer details
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

    // Fetch logistics table data
    const consumerId = parts[0];
    const data = await getLogisticsData(partNumber, currentPrefix, consumerId);
    setSelectedCheckboxes([]);
    setSelectedRadio(null);
    setTableData(data);
  };

  const clearTableAndOptions = () => {
    setMarketOptions([]);
    setMarketConsumerDetails({ id: '', gda: '', productArea: '', designation: '', name: '' });
    setTableData([]);
  };

  const handleMarketConsumerClick = (label) => {
    setSelectedMarketConsumer(label);
    setPendingMarketConsumer(label);
    setIsMarketDropdownOpen(false);
    setErrorMessage('');
    setSelectedCheckboxes([]);
    setSelectedRadio(null);
    setTableData([]);
    setSortField(null);       // Reset sort field
    setSortMessage('');       // ✅ Reset sort message also

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
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10).replace(/-/g, ''); // 'YYYYMMDD'
    const userId = 'A510468';

    const updated = tableData.map(row => {
      if (selectedCheckboxes.includes(row.id)) {
        return {
          ...row,
          auto: 'N',
          resp: userId,
          date: formattedDate
        };
      }
      return row;
    });

    setTableData(updated);
    setSelectedCheckboxes([]);
    setSortMessage('UPDATE DONE');
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
    setSortMessage('UPDATE DONE');
  };


  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setDeleteTarget(null);
  };

  const handleClear = () => {
    setPartNumber('');
    setPrefix('');
    clearTableAndOptions();
    setSelectedMarketConsumer('');
    setPendingMarketConsumer('');
    setSelectedCheckboxes([]);
    setSelectedRadio(null);
    setErrorMessage('');
    setSortField('');
    setSortMessage('');

    if (partInputRef.current) partInputRef.current.focus();
  };

  const selectedRadioConsumer = tableData.find(c => c.id === selectedRadio);
  const isDeleteEnabled = selectedRadioConsumer?.auto === 'N';

  const handleSort = (field, label) => {
    const isSameField = sortField === field;
    const newDirection = isSameField && sortDirection === 'asc' ? 'desc' : 'asc';

    setSortField(field);
    setSortDirection(newDirection);

    const sorted = [...tableData];
    const existing = sorted.filter(row => row.auto === 'Y' || row.auto === 'N');
    const toAdd = sorted.filter(row => row.auto === '');

    const compare = (a, b) => {
      const aVal = a[field] ?? '';
      const bVal = b[field] ?? '';
      if (aVal < bVal) return newDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return newDirection === 'asc' ? 1 : -1;
      return 0;
    };

    const sortedExisting = [...existing].sort(compare);
    const sortedToAdd = [...toAdd].sort(compare);

    setTableData([...sortedExisting, ...sortedToAdd]);
    setSortMessage(`Sort By: ${label} in ${newDirection === 'asc' ? 'Ascending' : 'Descending'} Order`);
  };

  const getUserDetails = (userId) => {
    if (userId === 'A510468') {
      return {
        id: 'A510468',
        name: 'SMARTA DEY',
        company: 'VOLVO GROUP INDIA PRIVATE LTD',
        office: '',
        department: '',
        telephone: '',
        email: 'smarta.dey@volvo.com'
      };
    } else {
      return {
        id: userId,
        name: '',
        company: '',
        office: '',
        department: '',
        telephone: '',
        email: ''
      };
    }
  };

  const handleUserClick = (userId) => {
    const userInfo = getUserDetails(userId);
    setSelectedUserInfo(userInfo);
    setUserDialogOpen(true);
  };


  return (
    <div className="background">
      <div className="center-content">
        {/* Header */}
        <div className="form-container" style={{ justifyContent: 'space-between' }}>
          <Link to="/"><button className="button-primary">Home</button></Link>
          <p className="title">MDM Logistics Consumer</p>
          <button className="button-primary">User Manual</button>
        </div>

        {/* Error Banner */}
        <div className="error-banner form-container">
          {errorMessage
            ? errorMessage
            : sortMessage
              ? <span style={{ color: 'black', fontWeight: 'bold' }}>{sortMessage}</span>
              : <span className="error-placeholder">.</span>
          }
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

        {/* Market Consumer Info */}
        <div className="form-container" style={{
          fontSize: '14px', fontWeight: 'bold', display: 'flex', flexDirection: 'row',
          marginTop: '10px', marginBottom: '10px', alignItems: 'center', justifyContent: 'flex-start'
        }}>
          <p style={{ margin: 0, whiteSpace: 'nowrap' }}>Name:</p>
          <p ref={nameRef} style={{
            flex: '1 1 200px', maxWidth: '300px', marginLeft: '5px', marginRight: '10px',
            fontWeight: '500', height: '34px', lineHeight: '34px', overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }} title={isNameTruncated ? marketConsumerDetails.name : ''}>
            {marketConsumerDetails.name || '\u00A0'}
          </p>

          <p style={{ margin: 0, whiteSpace: 'nowrap' }}>Market Consumer ID:</p>
          <p style={{ width: '40px', flexShrink: 0, marginLeft: '5px', marginRight: '10px', fontWeight: '500', lineHeight: '34px' }}>
            {marketConsumerDetails.id}
          </p>

          <p style={{ margin: 0, whiteSpace: 'nowrap' }}>Product Area:</p>
          <p style={{ width: '60px', flexShrink: 0, marginLeft: '5px', marginRight: '20px', fontWeight: '500', lineHeight: '34px' }}>
            {marketConsumerDetails.productArea}
          </p>

          <p style={{ margin: 0, whiteSpace: 'nowrap' }}>GDA:</p>
          <p style={{ width: '20px', flexShrink: 0, marginLeft: '5px', marginRight: '10px', fontWeight: '500', lineHeight: '34px' }}>
            {marketConsumerDetails.gda}
          </p>

          <p style={{ margin: 0, whiteSpace: 'nowrap' }}>Designation:</p>
          <p ref={designationRef} style={{
            flex: '1 1 100px', maxWidth: '100px', marginLeft: '5px', marginRight: '10px',
            fontWeight: '500', height: '34px', lineHeight: '34px', overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }} title={isDesignationTruncated ? marketConsumerDetails.designation : ''}>
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

        {/* Table */}
        <LogisticsConsumerTable
          data={tableData}
          selectedCheckboxes={selectedCheckboxes}
          selectedRadio={selectedRadio}
          onCheckboxChange={handleCheckboxSelection}
          onRadioChange={handleRadioSelection}
          onSort={handleSort}
          onUserClick={handleUserClick}
          sortField={sortField}
          setSortField={setSortField}
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

        {/* user id info box */}
        {userDialogOpen && selectedUserInfo && (
          <div className="modal-overlay">
            <div className="modal-box2" style={{ fontWeight: 'normal' }}>
              <p style={{ textAlign: 'center', fontSize: '16px', marginBottom: '10px' }}><strong>User ID Information</strong></p>
              <p style={{ fontWeight: 'normal' }}><strong>User Id:</strong> {selectedUserInfo.id}</p>
              <p><strong>User Name:</strong> {selectedUserInfo.name}</p>
              <p><strong>Company:</strong> {selectedUserInfo.company}</p>
              <p><strong>Office:</strong> {selectedUserInfo.office}</p>
              <p><strong>Department:</strong> {selectedUserInfo.department}</p>
              <p><strong>Telephone:</strong> {selectedUserInfo.telephone}</p>
              <p><strong>Email:</strong> {selectedUserInfo.email}</p>
              <div className="modal-actions">
                <button className="button-primary" onClick={() => setUserDialogOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
