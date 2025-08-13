import { useState, useEffect, useRef } from 'react';
import './LogisticsConsumer.css';
import LogisticsConsumerTable from './LogisticsConsumerTable';
import { getMarketConsumers, getLogisticsData, getAvailablePrefixes } from './Data';
import { Link } from 'react-router';

export default function LogisticsConsumer() {

  //To make the tab name show "MDM Logistics Consumer" when you open this page.
  useEffect(() => {
    document.title = "MDM Logistics Consumer";
  }, []);

  const [partNumber, setPartNumber] = useState('');
  const [prefix, setPrefix] = useState('');
  const [marketOptions, setMarketOptions] = useState([]);
  const [selectedMarketConsumer, setSelectedMarketConsumer] = useState('');

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
  const partIdRef = useRef(null);
  const prefixRef = useRef(null);
  const marketConsumerRef = useRef(null);
  const [isNameTruncated, setIsNameTruncated] = useState(false);
  const [isDesignationTruncated, setIsDesignationTruncated] = useState(false);
  const [sortMessage, setSortMessage] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [isGotoEnabled, setIsGotoEnabled] = useState(false);


  //the cursor is already in the Part Id box when the page opens — the user can start typing immediately.
  useEffect(() => {
    if (partInputRef.current) partInputRef.current.focus();
  }, []);

  useEffect(() => {
    // Reset everything when partNumber or prefix changes([partNumber,prefix] is dependency array)
    setSelectedMarketConsumer('');
    setMarketOptions([]);
    setMarketConsumerDetails({ id: '', gda: '', productArea: '', designation: '', name: '' });
    setTableData([]);
    setSelectedCheckboxes([]);
    setSelectedRadio(null);
    setErrorMessage('');
    setSortMessage('');
  }, [partNumber, prefix]);
  


  //If the user clicks anywhere outside the Market Consumer dropdown or the Go To menu, those menus should close.
  useEffect(() => {
    const handleClickOutside = (event) => {
      // !event.target.closest('.marketconsumer-dropdown') means:The click was not inside Market Consumer dropdown.Same logic for .goto-dropdown.
      if (!event.target.closest('.marketconsumer-dropdown') || !event.target.closest('.goto-dropdown')) {
        // console.log("marketconsumer-dropdown",event.target.closest('.marketconsumer-dropdown'))
        // console.log("goto-dropdown",event.target.closest('.goto-dropdown'))

        setIsMarketDropdownOpen(false);
        setIsGotoDropdownOpen(false);
      }
    };
    //Every time there’s a click anywhere in the page, run handleClickOutside
    document.addEventListener('click', handleClickOutside);
  }, []);


  // Detect text overflow for tooltip dynamically(for name and designation response fields)
  useEffect(() => {
    if (nameRef.current) {
      setIsNameTruncated(nameRef.current.scrollWidth > nameRef.current.clientWidth);
    }
    if (designationRef.current) {
      setIsDesignationTruncated(designationRef.current.scrollWidth > designationRef.current.clientWidth);
    }
  }, [marketConsumerDetails]);

  // TAB navigation handler
  const handleTabNavigation = (e, current) => {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      if (current === "partId") {
        prefixRef.current?.focus();
      } else if (current === "prefix") {
        marketConsumerRef.current?.focus();
      } else if (current === "marketConsumer") {
        partIdRef.current?.focus(); // Loop back to Part ID
      }
    }
  };

  //search
  const handleSearch = async () => {
    //We start fresh every search — no old errors should show.
    setErrorMessage('');
    setIsGotoEnabled(true);
    // Focus the first Part Id box(Part number) after search
    if (partInputRef.current) {
      partInputRef.current.focus();
    }
    //If partNumber is empty or only spaces and we click Search, show error and return.
    if (!partNumber.trim()) {
      setErrorMessage('Part Id is required');
      return;
    }


    //Prefix Handling
    // Get all prefixes for entered part number (if we enter partno. and click on search then this will get all the prefixes corresponding to the part number)
    const availablePrefixes = getAvailablePrefixes(partNumber);

    //if the partNumber does not exist then there will be no corresponding prefix for that
    if (availablePrefixes.length === 0) {
      setErrorMessage('PART ID MISSING IN GLOPPS');
      clearTableAndOptions();
      return;
    }

    // Auto-fill prefix if only one prefix exists (if for partNumber only one prefix exists and the user has not typed in prefix and hit search 
    // then auto fill of prefix will be done)
    let currentPrefix = prefix.trim(); //currentPrefix will have "" if no prefix entered in the input field
    //!currentPrefix will br true when currentPrefix is "" and the length of availablePrefix for the partNo is checked if its 1 then we get that one availablePrefix and 
    // set the value to setPrefix
    if (!currentPrefix && availablePrefixes.length === 1) {
      currentPrefix = availablePrefixes[0]; //availablePrefixes is an array that is why [0] to get the value and store in currentPrefix
      setPrefix(currentPrefix);//set the prefix value
    }
    // Show available prefixes if user didn't enter prefix and there is more than one availablePrefixes(length>1)
    if (!currentPrefix) {
      setErrorMessage(`PART PREFIX: ${availablePrefixes.join(' ')}`);
      // clearTableAndOptions();
      return;
    }


    // Fetch market consumers using the partNumber and currentPrefix
    const consumers = await getMarketConsumers(partNumber, currentPrefix);

    //no market consumer exists
    if (!consumers || consumers.length === 0) {
      setErrorMessage('PART ID MISSING IN GLOPPS');
      // clearTableAndOptions();
      return;
    }


    // Populate dropdown (if market consumers exist)
    setMarketOptions([{ id: '', label: '' }, ...consumers]);
    //here {id:'',label:''} is used to add blank space in dropdown and ...consumers is used to add the rest of the market consumers in the dropdown

    // If no market consumer is selected yet then show message(trim is used to avoid leading and trailing whitespaces)
    if (!selectedMarketConsumer.trim()) {
      setErrorMessage('Select MARKET CONSUMER');
      return;
    }


    // Extract consumer details
    const selectedObj = consumers.find(c => c.label === selectedMarketConsumer);
    //here we find the object in consumers whose label exactly matches the currently selectedMarketConsumer.
    const nameValue = selectedObj?.name || ''; //name field of the selected market consumer
    const parts = selectedMarketConsumer.split(' - ');

    setMarketConsumerDetails({
      id: parts[0] || '',
      productArea: parts[1] || '',
      gda: parts[2] || '',
      designation: parts[3] || '',
      name: nameValue
    });

    // setIsGotoEnabled(true);
    // Fetch logistics table data
    const consumerId = parts[0];
    const data = await getLogisticsData(partNumber, currentPrefix, consumerId);
    setSelectedCheckboxes([]);
    setSelectedRadio(null);
    setTableData(data);


  };

  //clearing all the data in the screen
  const clearTableAndOptions = () => {
    setMarketOptions([]);
    setMarketConsumerDetails({ id: '', gda: '', productArea: '', designation: '', name: '' });
    setTableData([]);
  };

  //when we select an option for marketconsumer dropdown 
  const handleMarketConsumerClick = (label) => {
    setSelectedMarketConsumer(label);
    setIsMarketDropdownOpen(false);
    setErrorMessage('');
    setSelectedCheckboxes([]);
    setSelectedRadio(null);
    setTableData([]);
    setSortField(null);
    setSortMessage('');
    setMarketConsumerDetails({ id: '', gda: '', productArea: '', designation: '', name: '' });

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

  //when we select the checkbox/checkboxes and we click on Add Consumer button , the rows(consumers) have autoflag set to N,date is today date
  //  for now resp value is A510468 for all consumers added
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
    const updated = tableData.map(row => row.id === deleteTarget ? { ...row, auto: '', resp: '', date: '' } : row);
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


  //when we click clear button
  const handleClear = () => {
    setPartNumber('');
    setPrefix('');
    clearTableAndOptions();
    setSelectedMarketConsumer('');
    setSelectedCheckboxes([]);
    setSelectedRadio(null);
    setErrorMessage('');
    setSortField('');
    setSortMessage('');
    setIsGotoEnabled(false);

    if (partInputRef.current) partInputRef.current.focus();
  };

  //when the delete button will be enabled
  //Searches through tableData Finds the row object where the id matches the selected radio’s ID (selectedRadio) Returns that full row object (selectedRadioConsumer)
  const selectedRadioConsumer = tableData.find(c => c.id === selectedRadio);
  const isDeleteEnabled = selectedRadioConsumer?.auto === 'N';//then check if autoflag is N for that selected row with radio button (if yes then delete button enable)



  //this handles the sort based on columns
  const handleSort = (field, label) => {
    const isSameField = sortField === field;   // Check if we're sorting by the same column again
    const newDirection = isSameField && sortDirection === 'asc' ? 'desc' : 'asc';
    // Toggle sort direction: if same column and currently ascending, switch to descending; otherwise ascending

    setSortField(field);          // Update the current sort field(column)
    setSortDirection(newDirection);  // Update the sort direction

    // const sorted = [...tableData];  // Make a copy of the table data so we don't mutate the original directly

    // Separate rows into two groups:
    // - 'existing' rows where autoflag is 'Y' or 'N'
    // - 'to add' rows where autoflag is empty string ''
    //const existing = sorted.filter(row => row.auto === 'Y' || row.auto === 'N');
    //const toAdd = sorted.filter(row => row.auto === '');
    const existing = tableData.filter(row => row.auto === 'Y' || row.auto === 'N');
    const toAdd = tableData.filter(row => row.auto === '');

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
    const sortedToAdd = [...toAdd].sort(compare); //Logistics Consumer to Add rows

    // Combine the sorted groups back together with existing rows first
    setTableData([...sortedExisting, ...sortedToAdd]);

    // Show a message about the current sort status
    setSortMessage(`Sort By: ${label} in ${newDirection === 'asc' ? 'Ascending' : 'Descending'} Order`);
  };


  //for now this data is shown in User ID information box
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

  return (
    // form-container class is very important
    <div className="background">
      <div className="center-content">

        {/* Header */}
        <div className="form-container" style={{ justifyContent: 'space-between' }}>
          <Link to="/"><button className="button-primary">Home</button></Link>
          <p className="title">MDM Logistics Consumer</p>
          <button className="button-primary">User Manual</button>
        </div>

        {/* Error message / Sort message */}
        <div className="error-banner form-container">
          {/* If errorMessage is true (a non-empty string, not null/undefined/false):Show the errorMessage.
          Else, if sortMessage is true:Show it inside a <span> with black bold text.
          Else (both are false):Show <span className="error-placeholder">.</span> — probably a placeholder so the space stays consistent even if there’s no message. */}
          {errorMessage ? errorMessage : sortMessage ? <span style={{ color: 'black', fontWeight: 'bold' }}>{sortMessage}</span> :
            <span className="error-placeholder">.</span>
          }
        </div>


        {/* Input Fields */}
        <div className="form-container">
          <div className="form-row">
            {/* part id */}
            <label className="input-label">Part Id:</label>
            <input type="text" className="input-field" ref={(el) => { partInputRef.current = el; partIdRef.current = el; }} value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)} onKeyDown={(e) => { handleTabNavigation(e, "partId"); handleEnterKey(e) }} />

            <input type="text" className="input-field" style={{ width: '50px', marginRight: '30px' }} value={prefix} onChange={(e) => setPrefix(e.target.value.toUpperCase())}
              ref={prefixRef} onKeyDown={(e) => { handleTabNavigation(e, "prefix"); handleEnterKey(e) }} />


            {/* market consumer dropdown */}
            <label className="input-label">Market Consumer:</label>
            {/* Always has "marketconsumer-dropdown".Adds "active" only if isMarketDropdownOpen is true. */}

            {/* setIsMarketDropdownOpen(prev => !prev); used to open and close the dropdown */}

            {/* e.stopPropagation(): e.stopPropagation() (where e represents an Event object) is a method used to prevent the further propagation of an event through 
            the DOM (Document Object Model) tree. when i removed the e.stoppropagation() just to see what is its use i saw that when i enter 100 VO and click on search 
            when i click on market consumer dropdown it does not show  */}

            {/* if setIsGotoDropdownOpen(false ) is removed then if goto is open and we click on the marketconsumer dropdown then then the goto dropdown will 
          still remain open and show on top of market consumer dropdown */}

            {/* tabindex{0} is to make market consumer focusable */}

            <div className={`marketconsumer-dropdown ${isMarketDropdownOpen ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); setIsMarketDropdownOpen(prev => !prev); setIsGotoDropdownOpen(false); }} ref={marketConsumerRef}
              onKeyDown={(e) => { handleTabNavigation(e, "marketConsumer"); handleEnterKey(e) }} tabIndex={0} >
              {/* selectedmarketconsumer value we get from handleMarketConsumerClick function */}
              <div className="selected">{selectedMarketConsumer}<span className="dropdown-arrow">▼</span></div>

              {/* isMarketDropdownOpen && marketOptions.length > 0 && ( ... )The dropdown list <ul> is shown only if the dropdown is open and 
              there are market options available.Inside the <ul className="dropdown-options">, it maps over marketOptions to render each option as a <li>.

              Each <li> has an onClick handler which:Calls e.stopPropagation() again to prevent the click from bubbling.
              if e.stopPropagation() removed then on clicking the option from dropdown the dropdown does not close

              Calls handleMarketConsumerClick(opt.label) — this will update the selected market consumer and close the dropdown.
              The option text is rendered as opt.label or a non-breaking space ('\u00A0') if empty, to keep layout consistent. */}

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

        {/* Response fields */}
        <div className="form-container" style={{fontSize: '14px', fontWeight: 'bold', display: 'flex', flexDirection: 'row',marginTop: '10px', marginBottom: '10px', 
        alignItems: 'center', justifyContent: 'flex-start'}}>

          {/* title={isNameTruncated ? marketConsumerDetails.name : ''} this will show the tooltip only if the name is truncated otherwise not */}
          <p style={{ margin: 0, whiteSpace: 'nowrap' }}>Name:</p>
          <p ref={nameRef} style={{flex: '1 1 200px', maxWidth: '300px', marginLeft: '5px', marginRight: '10px', fontWeight: '500', height: '34px', lineHeight: '34px', 
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={isNameTruncated ? marketConsumerDetails.name : ''}>
            {marketConsumerDetails.name}
          </p>

          <p style={{ margin: 0, whiteSpace: 'nowrap' }}>Market Consumer ID:</p>
          <p style={{ width: '40px', flexShrink: 0, marginLeft: '5px', marginRight: '10px', fontWeight: '500', lineHeight: '34px' }}> {marketConsumerDetails.id}</p>

          <p style={{ margin: 0, whiteSpace: 'nowrap' }}>Product Area:</p>
          <p style={{ width: '60px', flexShrink: 0, marginLeft: '5px', marginRight: '20px', fontWeight: '500', lineHeight: '34px' }}>{marketConsumerDetails.productArea}
          </p>

          <p style={{ margin: 0, whiteSpace: 'nowrap' }}>GDA:</p>
          <p style={{ width: '20px', flexShrink: 0, marginLeft: '5px', marginRight: '10px', fontWeight: '500', lineHeight: '34px' }}>{marketConsumerDetails.gda}</p>

          <p style={{ margin: 0, whiteSpace: 'nowrap' }}>Designation:</p>
          <p ref={designationRef} style={{flex: '1 1 100px', maxWidth: '100px', marginLeft: '5px', marginRight: '10px',fontWeight: '500', height: '34px', 
          lineHeight: '34px', overflow: 'hidden',textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}title={isDesignationTruncated ? marketConsumerDetails.designation : ''}>
            {marketConsumerDetails.designation}
          </p>
        </div>


        {/* Action Buttons */}
        <div className="form-container" style={{ justifyContent: 'space-between', marginTop: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <button className="button-primary" onClick={handleSearch}>Search</button>
            <button className="button-primary" style={{ margin: '0px 20px' }} disabled={selectedCheckboxes.length === 0} onClick={handleAddConsumer}>Add Consumer</button>
            <button className="button-primary" disabled={!isDeleteEnabled} onClick={handleDeleteClick}>Delete</button>
          </div>

          <div className={`goto-dropdown ${isGotoDropdownOpen ? 'active' : ''}`} onClick={(e) => {e.stopPropagation();setIsGotoDropdownOpen(prev => !prev);
            setIsMarketDropdownOpen(false);}}>
            <div  className="goto-button" style={{ width: isGotoEnabled ? '220px' : '100px' }}>
              <span>Go To</span>
              <span className="goto-arrow">▼</span>
            </div>
            {isGotoDropdownOpen && (
              <ul className="goto-options" style={{ width: isGotoEnabled ? '220px' : '100px' }}>
                {/* if goto is enabled then the options will be shown otherwise only Go To: will be shown */}
                {isGotoEnabled ? (
                  <>
                    <li>Global Part Info</li>
                    <li>GDA Local Action</li>
                  </>
                ) : (
                  <li>Go To:</li>
                )}
              </ul>
            )}
          </div>


          <button className="button-primary" onClick={handleClear}>Clear</button>
        </div>

        {/* Logistic consumer Table */}
        {/* Passing props to a child component(in this case the child component is LogisticsConsumerTable ) */}
        <LogisticsConsumerTable  data={tableData} selectedCheckboxes={selectedCheckboxes} selectedRadio={selectedRadio} onCheckboxChange={handleCheckboxSelection}
          onRadioChange={handleRadioSelection} onSort={handleSort} onUserClick={handleUserClick} setSortField={setSortField}/>

        {/* Delete message box */}
        {showDeleteDialog && (
          <div className="modal-overlay">
            <div className="modal-box">
              <p style={{marginBottom:'30px'}}>Do you want to delete the selected Row?</p>
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
