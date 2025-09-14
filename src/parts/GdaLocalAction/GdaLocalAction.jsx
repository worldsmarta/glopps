import { useEffect, useRef, useState } from 'react';
import '../../App.css';
import { productArea, gdaDatabase, getAvailablePrefixes, getResponseFieldsData, getGdaData } from './Data';
import './GdaLocalAction.css';
import GdaLocalActionTable from './GdaLocalActionTable';
import Goto from '../../Goto';

export default function GdaLocalAction() {

  //fields common to all screens
  const partNumberRef = useRef(null);
  const prefixRef = useRef(null);
  const [partNumber, setPartNumber] = useState('');
  const [prefix, setPrefix] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [sortMessage, setSortMessage] = useState('');
  const [name, setName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [isGotoEnabled, setIsGotoEnabled] = useState(false);
  const [isGotoDropdownOpen, setIsGotoDropdownOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState(null)
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);


  //fields unique to gda local action 
  const productAreaRef = useRef(null);
  const showPusersRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProductArea, setSelectedProductArea] = useState('');
  const [partStageVersion, setPartStageVersion] = useState('');
  const [brandMark, setBrandMark] = useState('');
  const [showPusers, setShowPusers] = useState(false);

  // Set document title
  useEffect(() => {
    document.title = 'GDA Local Action';
  }, []);

  // Focus on part number input on load
  useEffect(() => {
    if (partNumberRef.current) partNumberRef.current.focus();
  }, []);

  // Handle click outside to close product area dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.productarea-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setTableData([]);
    setSelectedCheckboxes([]);
    setSelectedRadio(null);
    setErrorMessage('');
    setSortMessage('');
    setBrandMark(''); setName(''); setPartStageVersion('');
  }, [partNumber, prefix]);

  const handleProductAreaSelect = (area) => {
    setSelectedProductArea(area);
    setIsDropdownOpen(false);
  };

  const handleTabNavigation = (e, current) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault(); // Prevent default tab behavior
      if (current === 'partNumber') {
        prefixRef.current?.focus();
      } else if (current === 'prefix') {
        productAreaRef.current?.focus();
      } else if (current === 'productArea') {
        showPusersRef.current?.focus();
      } else if (current === 'showPusers') {
        if (partNumberRef.current) partNumberRef.current.focus();
      }
    }
  };

const handleSearch = async () => {
   setErrorMessage(''); // Clear previous errors at the start
    setIsGotoEnabled(true);
  console.log('Starting handleSearch with:', {
    partNumber,
    prefix,
    selectedProductArea,
    showPusers
  });

  // Get available prefixes
  const availablePrefixes = getAvailablePrefixes(partNumber);
  console.log('Available prefixes:', availablePrefixes);

  if (availablePrefixes.length === 0) {
    console.log('No prefixes found for partNumber:', partNumber);
    setErrorMessage('PART ID MISSING IN GLOPPS');
      partNumberRef.current?.focus();
      
    return;
  }

  if (availablePrefixes.length === 1) {
    setPrefix(availablePrefixes[0]);
    console.log('Single prefix:', availablePrefixes[0]);
    await fetchAndSetData(partNumber, availablePrefixes[0], selectedProductArea, showPusers);
    return;
  }

  if (availablePrefixes.length > 1 && !prefix.trim()) {
    console.log('Multiple prefixes available, but prefix not entered:', availablePrefixes);
     setErrorMessage(`PART PREFIX: ${availablePrefixes.join(' ')}`);
      prefixRef.current?.focus();
    return;
  }

  if (prefix.trim()) {
    console.log('Using entered prefix:', prefix);
    await fetchAndSetData(partNumber, prefix, selectedProductArea, showPusers);
  }
};

const fetchAndSetData = async (partNumber, prefix, selectedProductArea, showPusers) => {
  console.log('Fetching response fields data for:', { partNumber, prefix });
  const responseData = await getResponseFieldsData(partNumber, prefix);
  console.log('Response data:', responseData);

  setName(responseData.name);
  setPartStageVersion(responseData.partStageVersion);
  setBrandMark(responseData.brandMark);

  console.log('Calling getGdaData with:', { partNumber, prefix, selectedProductArea, showPusers });
  const tableData = await getGdaData(partNumber, prefix, selectedProductArea, showPusers);
  console.log('Filtered table data:', tableData);
  setTableData(tableData);
};
  const handleClear = () => {
    setPartNumber('');
    setPrefix('');
    setSelectedProductArea('');
    setErrorMessage('');
    setName('');
    setBrandMark('');
    setPartStageVersion('');
    setSelectedCheckboxes([]);
    setSelectedRadio(null);
    setTableData([]);
    setIsGotoDropdownOpen(false);
    setIsGotoEnabled(false);
    setShowPusers(false);
    if (partNumberRef.current) partNumberRef.current.focus();
  };

  //handles the checkbox selection (here we ensure that when we select the checkbox or checkboxes then if any radio button was selected previously it is unselected)
  const handleCheckboxSelection = (selected) => {
    setSelectedCheckboxes(selected);
    setSelectedRadio(null); //radio is unselected\
    setSortMessage(" ");
  };

  //handles the radio selection (here we ensure that when we select the radio button then if any checkboxes was selected previously it is unselected)
  const handleRadioSelection = (id) => {
    setSelectedRadio(id);
    setSelectedCheckboxes([]); //checkboxes is unselected
    setSortMessage(" ");
  };


  const handleGdaAddConsumer = () => {
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10).replace(/-/g, ''); // 'YYYYMMDD'
    const userId = 'A510468';
    const updated = tableData.map(row => {
      if (selectedCheckboxes.includes(row.id)) {
        return {
          ...row,
          IntroDate: formattedDate,
          chgdte: formattedDate,
          userid: userId
        };
      }
      return row;
    });

    setTableData(updated);
    setSelectedCheckboxes([]);
    setSortMessage('UPDATE DONE');
  };

  //when we click on delete button
  const handleDeleteClick = () => {
    if (selectedRadio) {
      setDeleteTarget(selectedRadio); //sets the ID which row the user wants to delete
      setShowDeleteDialog(true); //shows dialog box
    }
  };

  //to handle when we click OK on the delete dialog box
  const confirmDelete = () => {
    //the deleted row moves to row with checkboxes and autoflag,resp,date is set to empty
    const updated = tableData.map(row => row.id === deleteTarget ? { ...row, IntroDate: '', chgdte: '', userid: '' } : row);
    setTableData(updated);
    setSelectedRadio(null);
    setShowDeleteDialog(false);
    setDeleteTarget(null);
    setSortMessage('UPDATE DONE');
  };

  //to handle when we click Cancel on the delete dialog box
  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setDeleteTarget(null);
  };

  const isDeleteEnabled = tableData.find(c => c.id === selectedRadio);

  //this handles the sort based on columns
  const handleSort = (field, label) => {
    const isSameField = sortField === field;   // Check if we're sorting by the same column again
    const newDirection = isSameField && sortDirection === 'asc' ? 'desc' : 'asc';
    // Toggle sort direction: if same column and currently ascending, switch to descending; otherwise ascending

    setSortField(field);          // Update the current sort field(column)
    setSortDirection(newDirection);  // Update the sort direction

    // const sorted = [...tableData];  // Make a copy of the table data so we don't mutate the original directly

    // Separate rows into 3 groups:

    //top rows
    const existing = tableData.filter(row => row.IntroDate !== '' && row.userid !== '' && row.chgdte !== '');

    //GDA/Consumers to add
    const gdaconsumerstoadd = tableData.filter(row => row.IntroDate === '' && row.userid === '' && row.chgdte === '' && row.consumer !== '');

    //GDA/LDA to update
    const gdaldatoupdate = tableData.filter(row => row.IntroDate === '' && row.userid === '' && row.chgdte === '' && row.consumer === '');

    // Comparison function to sort by the specified field and direction(ascending or descending)
    const compare = (a, b) => {
      // Get the value of the selected field from the first row (a).If it's null or undefined, replace it with an empty string.
      const aVal = a[field] ?? '';//If a[field] is null or undefined, use '' (empty string). Otherwise, use the actual value of a[field].

      // Get the value of the selected field from the second row (b).If it's null or undefined, replace it with an empty string.
      const bVal = b[field] ?? '';

      // If aVal comes before bVal in alphabetical/numeric order
      if (aVal < bVal)
        // If sorting ascending, a should come first (-1). If sorting descending, a should come after b (1).
        return newDirection === 'asc' ? -1 : 1;

      // If aVal comes after bVal in alphabetical/numeric order
      if (aVal > bVal)
        // If sorting ascending, a should come after b (1). If sorting descending, a should come first (-1).
        return newDirection === 'asc' ? 1 : -1;

      // If values are exactly equal, keep their current order (0).
      return 0;
    };
    // Sort each group independently
    const sortedExisting = [...existing].sort(compare);
    const sortedgdaconsumerstoadd = [...gdaconsumerstoadd].sort(compare); //GDA/Consumers to add rows
    const sortedgdaldstoupdate = [...gdaldatoupdate].sort(compare); //GDA/LDA to update


    // Combine the sorted groups back together with existing rows first
    setTableData([...sortedExisting, ...sortedgdaconsumerstoadd, ...sortedgdaldstoupdate]);

    // Show a message about the current sort status
    setSortMessage(`Sort By: ${label} in ${newDirection === 'asc' ? 'Ascending' : 'Descending'} Order`);
  };

  //for now this data is shown in User ID information box
  const getUserDetails = (userId) => {
    if (userId === 'A510468') {
      return {
        id: 'A510468', name: 'SMARTA DEY', company: 'VOLVO GROUP INDIA PRIVATE LTD', office: '', department: '', telephone: '', email: 'smarta.dey@volvo.com', isUnknown: false
      };
    } else {
      return {
        id: userId, name: '', company: '', office: '', department: '', telephone: '', email: '', isUnknown: true
      };
    }
  };

  //this function handles when a user clicks on user id in resp column
  const handleUserClick = (userId) => {
    const userInfo = getUserDetails(userId);
    setSelectedUserInfo(userInfo);
    setUserDialogOpen(true);
  };

  //helps to perform the same functions by pressing enter key which we can do by clicking on Search button
  const handleEnterKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Get an array of full names for display in your list
  const productAreaFullNames = Object.values(productArea);
  return (
    <>
      {/* clear, title and user manual */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', alignItems: 'center' }}>
        <button className='button-primary' onClick={handleClear}>Clear</button>
        <p className='title'>GDA Local Action</p>
        <button className='button-primary'>User Manual</button>
      </div>

      {/* part id, product area, show p-consumers, message box */}
      <div style={{ display: 'flex', marginTop: '10px', alignItems: 'center', gap: '10px' }}>
        {/* part id */}
        <div>
          <label className='input-label'>Part Id: <span style={{ color: 'red' }}>*</span>
          </label>
          <input type='text' className='input-field' ref={partNumberRef} value={partNumber} onChange={(e) => setPartNumber(e.target.value)}
            onKeyDown={(e) => { handleTabNavigation(e, 'partNumber'); handleEnterKey(e); }} />
          <input type='text' className='input-field' style={{ width: '50px', marginLeft: '10px' }} ref={prefixRef} value={prefix}
            onChange={(e) => setPrefix(e.target.value)} onKeyDown={(e) => { handleTabNavigation(e, 'prefix'); handleEnterKey(e); }} />
        </div>

        {/* product area */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className='input-label'>Product Area : </label>
          <div style={{ display: 'flex', position: 'relative', width: '200px', marginLeft: '10px' }}>
            <div className='productarea-dropdown' tabIndex={0} onClick={() => { setIsDropdownOpen(!isDropdownOpen), setIsGotoDropdownOpen(false) }}
              ref={productAreaRef} onKeyDown={(e) => { handleTabNavigation(e, 'productArea') }} >
              <div className='selected' style={{ fontSize: '13px', fontWeight: 'bold' }}onKeyDown={(e)=>{handleEnterKey(e)}} tabIndex={0} ref={productAreaRef} >{selectedProductArea || ''}</div>
              <span className='dropdown-arrow'>&#9660;</span>
            </div>

            {isDropdownOpen && (
              <ul className='dropdown-options'>

                {productAreaFullNames.map((area, index) => (
                  <li key={index} onClick={() => handleProductAreaSelect(area)}>
                    {area || '\u00A0'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* show p-consumers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className='input-label' style={{ marginRight: '10px' }}>Show P-consumers:</label>
          <input
  className='custom-checkbox'
  type='checkbox'
  ref={showPusersRef}
  checked={showPusers}
  onChange={(e) => setShowPusers(e.target.checked)}
  onKeyDown={(e) => { handleTabNavigation(e, 'showPusers'); handleEnterKey(e); }}
/>
        </div>

        {/* message box */}
        <div className='message-box' style={{ width: '320px' }}>
          <p className={`message-text ${sortMessage ? 'sort-message' : ''}`}>
            {errorMessage || sortMessage || '\u00A0'}
          </p>
        </div>
      </div>

      {/* response fields */}
      {/* name,Part Stage/Version,brand mark */}
      <div style={{ display: 'flex', marginTop: '20px', alignItems: 'center' }}>
        {/* name */}
        <div style={{ display: 'flex' }}>
          <p className='input-label'>Name:</p>
          <p style={{ width: '300px', marginLeft: '10px', marginRight: '10px', fontWeight: '500' }}>{name}</p>
        </div>

        {/* part stage/version */}
        <div style={{ display: 'flex' }}>
          <p className='input-label'>Part Stage/Version:</p>
          <p style={{ width: '200px', marginLeft: '10px', marginRight: '10px', fontWeight: '500' }}>{partStageVersion}</p>
        </div>

        {/* brand mark */}
        <div style={{ display: 'flex' }}>
          <p className='input-label'>Brand Mark:</p>
          <p style={{ width: '200px', marginLeft: '10px', marginRight: '10px', fontWeight: '500' }}>{brandMark}</p>
        </div>

        <div></div>
      </div>

      {/* buttons, goto and showing matches */}
      <div style={{ display: 'flex', marginTop: '20px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        {/* search,update,delete,add gda/consumer */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <button className='button-primary' onClick={handleSearch}>Search</button>
          <button className='button-primary' disabled={!isDeleteEnabled} >Update</button>
          <button className='button-primary' disabled={!isDeleteEnabled} onClick={handleDeleteClick}>Delete</button>
          <button className='button-primary' disabled={selectedCheckboxes.length === 0} onClick={handleGdaAddConsumer}>Add GDA/Consumer</button>
        </div>

        {/* goto */}
        <div >
          <Goto isGotoEnabled={isGotoEnabled} isGotoDropdownOpen={isGotoDropdownOpen} setIsGotoDropdownOpen={setIsGotoDropdownOpen}
            dropdownOpen={setIsDropdownOpen} mode="exclude" items={['MDM WM Part']} />
        </div>


        {/* show matches */}
        {tableData.length !== 0 ? <p className='input-label'>Showing {tableData.length} matches</p> : <p></p>}
      </div>

      {/* gda table */}
      <GdaLocalActionTable data={tableData} selectedCheckboxes={selectedCheckboxes}
        selectedRadio={selectedRadio}
        onCheckboxChange={handleCheckboxSelection}
        onRadioChange={handleRadioSelection}
        onSort={handleSort}
        onUserClick={handleUserClick}
        setSortField={setSortField} />

      {/* Delete message box */}
      {showDeleteDialog && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p style={{ marginBottom: '30px' }}>Do you want to delete the selected Row?</p>
            <div className="modal-actions">
              <button className="button-primary" onClick={confirmDelete}>OK</button>
              <button className="button-primary" onClick={cancelDelete} style={{ fontWeight: 'bold' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* user id info box */}
      {/* {userDialogOpen && selectedUserInfo && (...) means Render the user id info only if userDialogOpen is true AND selectedUserInfo is not null/undefined. */}
      {userDialogOpen && selectedUserInfo && (
        <div className="modal-overlay">
          <div className="modal-box2" style={{ fontWeight: '500' }}>
            <p style={{ textAlign: 'center', fontSize: '16px', marginBottom: '10px' }}><strong>UserID Information</strong></p>

            {/* Error message if user ID is R117XX */}
            {selectedUserInfo.isUnknown && (
              <p style={{ color: 'red', textAlign: 'center', marginTop: '-5px', marginBottom: '10px', fontWeight: '500' }}> USERID NOT KNOWN</p>
            )}
            <p ><strong>User Id:</strong> {selectedUserInfo.id}</p>
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
    </>
  );
}