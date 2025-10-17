import { useEffect, useRef, useState } from 'react';
import '../../App.css';
import { productArea, getAvailablePrefixes, getHazardousJobData, getComponentOptions, getConsumerOptions } from './Data';
import './HazardousJobQueue.css';
import HazardousJobQueueTable from './HazardousJobQueueTable';
import Goto from '../../Goto';

export default function HazardousJobQueue() {

  const partNumberRef = useRef(null);
  const prefixRef = useRef(null);
  const [partNumber, setPartNumber] = useState('');
  const [prefix, setPrefix] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [sortMessage, setSortMessage] = useState('');
  const [tableData, setTableData] = useState([]);
  const [isGotoEnabled, setIsGotoEnabled] = useState(false);
  const [isGotoDropdownOpen, setIsGotoDropdownOpen] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState(null)
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const productAreaRef = useRef(null);
  const componentRef = useRef(null);
  const consumerRef = useRef(null);
  const [isProductAreaDropdownOpen, setIsProductAreaDropdownOpen] = useState(false);
  const [isComponentDropdownOpen, setIsComponentDropdownOpen] = useState(false);
  const [isConsumerDropdownOpen, setIsConsumerDropdownOpen] = useState(false);
  const [selectedProductArea, setSelectedProductArea] = useState('');
  const [selectedComponent, setSelectedComponent] = useState('');
  const [selectedConsumer, setSelectedConsumer] = useState('');

  useEffect(() => {
    document.title = 'Hazardous Job Queue';
  }, []);

  useEffect(() => {
    if (partNumberRef.current) partNumberRef.current.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container-compact')) {
        setIsProductAreaDropdownOpen(false);
        setIsComponentDropdownOpen(false);
        setIsConsumerDropdownOpen(false);
        setIsGotoDropdownOpen(false);
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
  }, [partNumber, prefix]);

  const handleProductAreaSelect = (area) => {
    setSelectedProductArea(area);
    setIsProductAreaDropdownOpen(false);
  };

  const handleComponentSelect = (component) => {
    setSelectedComponent(component);
    setIsComponentDropdownOpen(false);
  };

  const handleConsumerSelect = (consumer) => {
    setSelectedConsumer(consumer);
    setIsConsumerDropdownOpen(false);
  };

  const handleTabNavigation = (e, current) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      if (current === 'partNumber') {
        prefixRef.current?.focus();
      } else if (current === 'prefix') {
        productAreaRef.current?.focus();
      } else if (current === 'productArea') {
        componentRef.current?.focus();
      } else if (current === 'component') {
        consumerRef.current?.focus();
      } else if (current === 'consumer') {
        if (partNumberRef.current) partNumberRef.current.focus();
      }
    }
  };

  const handleSearch = async () => {
    setErrorMessage('');
    setIsGotoEnabled(true);

    if (!partNumber.trim()) {
      setErrorMessage('Part Id is required');
      partNumberRef.current?.focus();
      return;
    }

    const availablePrefixes = getAvailablePrefixes(partNumber);

    if (availablePrefixes.length === 0) {
      setErrorMessage('PART ID MISSING IN GLOPPS');
      partNumberRef.current?.focus();
      return;
    }

    let currentPrefix = prefix.trim();
    if (!currentPrefix && availablePrefixes.length === 1) {
      currentPrefix = availablePrefixes[0];
      setPrefix(currentPrefix);
    }

    if (!currentPrefix) {
      setErrorMessage(`PART PREFIX: ${availablePrefixes.join(' ')}`);
      if (prefixRef.current) {
        prefixRef.current.focus();
      }
      return;
    }

    if (!availablePrefixes.includes(currentPrefix)) {
      setErrorMessage(`PART PREFIX: ${availablePrefixes.join(' ')}`);
      prefixRef.current?.focus();
      return;
    }

    const tableData = await getHazardousJobData(partNumber, currentPrefix, selectedProductArea, selectedComponent, selectedConsumer);
    setTableData(tableData);
  };

  const handleClear = () => {
    setPartNumber('');
    setPrefix('');
    setSelectedProductArea('');
    setSelectedComponent('');
    setSelectedConsumer('');
    setErrorMessage('');
    setSelectedCheckboxes([]);
    setSelectedRadio(null);
    setTableData([]);
    setIsGotoDropdownOpen(false);
    setIsGotoEnabled(false);
    if (partNumberRef.current) partNumberRef.current.focus();
  };

  const handleCheckboxSelection = (selected) => {
    setSelectedCheckboxes(selected);
    setSelectedRadio(null);
    setSortMessage(" ");
  };

  const handleRadioSelection = (id) => {
    setSelectedRadio(id);
    setSelectedCheckboxes([]);
    setSortMessage(" ");
  };

  const handleSort = (field, label) => {
    const isSameField = sortField === field;
    const newDirection = isSameField && sortDirection === 'asc' ? 'desc' : 'asc';

    setSortField(field);
    setSortDirection(newDirection);

    const compare = (a, b) => {
      const aVal = a[field] ?? '';
      const bVal = b[field] ?? '';

      if (aVal < bVal)
        return newDirection === 'asc' ? -1 : 1;
      if (aVal > bVal)
        return newDirection === 'asc' ? 1 : -1;
      return 0;
    };

    const sorted = [...tableData].sort(compare);
    setTableData(sorted);
    setSortMessage(`Sort By: ${label} in ${newDirection === 'asc' ? 'Ascending' : 'Descending'} Order`);
  };

  const handleEnterKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const productAreaOptions = Object.values(productArea);
  const componentOptions = getComponentOptions();
  const consumerOptions = getConsumerOptions();

  return (
    <div className="screen-container-compact">
      {/* Header */}
      <div className="screen-header-row">
        <button className='button-compact' onClick={handleClear}>Clear</button>
        <p className='screen-title-compact'>Hazardous Job Queue</p>
        <button className='button-compact'>User Manual</button>
      </div>

      {/* Form Row 1: Part ID and Product Area */}
      <div className="screen-form-row-compact">
        <div className="field-container-medium">
          <label className='input-label-compact'>Part Id: <span style={{ color: 'red' }}>*</span></label>
          <div className="part-id-inputs">
            <input 
              type='text' 
              className='input-field-compact' 
              ref={partNumberRef} 
              value={partNumber} 
              onChange={(e) => setPartNumber(e.target.value)}
              onKeyDown={(e) => { handleTabNavigation(e, 'partNumber'); handleEnterKey(e); }} 
            />
            <input 
              type='text' 
              className='input-field-compact prefix-input' 
              ref={prefixRef} 
              value={prefix} 
              onChange={(e) => setPrefix(e.target.value.toUpperCase())}
              onKeyDown={(e) => { handleTabNavigation(e, 'prefix'); handleEnterKey(e); }} 
            />
          </div>
        </div>

        <div className="field-container-large">
          <label className='input-label-compact'>Prod. Area:</label>
          <div className='dropdown-container-compact'>
            <div 
              className='productarea-dropdown-compact' 
              tabIndex={0} 
              onClick={() => { setIsProductAreaDropdownOpen(!isProductAreaDropdownOpen); setIsComponentDropdownOpen(false); setIsConsumerDropdownOpen(false); setIsGotoDropdownOpen(false); }}
              ref={productAreaRef} 
              onKeyDown={(e) => { handleTabNavigation(e, 'productArea'); handleEnterKey(e); }}
            >
              <div className='selected-compact'>
                {selectedProductArea || ''}
              </div>
              <span className='dropdown-arrow-compact'>&#9660;</span>
            </div>

            {isProductAreaDropdownOpen && (
              <ul className='dropdown-options-compact'>
                {productAreaOptions.map((area, index) => (
                  <li key={index} onClick={() => handleProductAreaSelect(area)}>
                    {area || '\u00A0'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className='message-box-compact'>
          <p className={`message-text-compact ${sortMessage ? 'sort-message' : ''}`}>
            {errorMessage || sortMessage || '\u00A0'}
          </p>
        </div>
      </div>

      {/* Form Row 2: Component and Consumer */}
      <div className="screen-form-row-compact">
        <div className="field-container-large">
          <label className='input-label-compact'>Comp:</label>
          <div className='dropdown-container-compact'>
            <div 
              className='productarea-dropdown-compact' 
              tabIndex={0} 
              onClick={() => { setIsComponentDropdownOpen(!isComponentDropdownOpen); setIsProductAreaDropdownOpen(false); setIsConsumerDropdownOpen(false); setIsGotoDropdownOpen(false); }}
              ref={componentRef} 
              onKeyDown={(e) => { handleTabNavigation(e, 'component'); handleEnterKey(e); }}
            >
              <div className='selected-compact'>
                {selectedComponent || ''}
              </div>
              <span className='dropdown-arrow-compact'>&#9660;</span>
            </div>

            {isComponentDropdownOpen && (
              <ul className='dropdown-options-compact'>
                {componentOptions.map((comp, index) => (
                  <li key={index} onClick={() => handleComponentSelect(comp)}>
                    {comp || '\u00A0'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="field-container-xl">
          <label className='input-label-compact'>Consumer:</label>
          <div className='dropdown-container-compact'>
            <div 
              className='productarea-dropdown-compact' 
              tabIndex={0} 
              onClick={() => { setIsConsumerDropdownOpen(!isConsumerDropdownOpen); setIsProductAreaDropdownOpen(false); setIsComponentDropdownOpen(false); setIsGotoDropdownOpen(false); }}
              ref={consumerRef} 
              onKeyDown={(e) => { handleTabNavigation(e, 'consumer'); handleEnterKey(e); }}
            >
              <div className='selected-compact'>
                {selectedConsumer || ''}
              </div>
              <span className='dropdown-arrow-compact'>&#9660;</span>
            </div>

            {isConsumerDropdownOpen && (
              <ul className='dropdown-options-compact consumer-dropdown-options-compact'>
                {consumerOptions.map((consumer, index) => (
                  <li key={index} onClick={() => handleConsumerSelect(consumer)}>
                    {consumer || '\u00A0'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Buttons Row */}
      <div className="screen-buttons-row">
        <div className="screen-buttons-left">
          <button className='button-compact' onClick={handleSearch}>Search</button>
          <button className='button-compact' disabled={selectedCheckboxes.length === 0}>Non Dangerous part</button>
        </div>

        <div className="goto-container">
          <Goto 
            isGotoEnabled={isGotoEnabled} 
            isGotoDropdownOpen={isGotoDropdownOpen} 
            setIsGotoDropdownOpen={setIsGotoDropdownOpen}
            dropdownOpen={() => {setIsProductAreaDropdownOpen(false); setIsComponentDropdownOpen(false); setIsConsumerDropdownOpen(false);}} 
            mode="exclude" 
            items={['Hazardous Job Queue']} 
          />
        </div>

        {tableData.length !== 0 ? <p className='matches-text'>Showing {tableData.length} matches</p> : <p></p>}
      </div>

      {/* Table */}
      <HazardousJobQueueTable 
        data={tableData} 
        selectedCheckboxes={selectedCheckboxes}
        selectedRadio={selectedRadio}
        onCheckboxChange={handleCheckboxSelection}
        onRadioChange={handleRadioSelection}
        onSort={handleSort}
        setSortField={setSortField} 
      />
    </div>
  );
}