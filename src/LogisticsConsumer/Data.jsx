const logisticsDatabase = {
  '100|VO': {
    marketConsumers: [
      { id: '1002', label: '1002 - VTB - EU - GENT', name:'DUMMY' },
      { id: '31971', label: '31971 - RENAULT - EU - LYON', name:'DUMMY' },
      { id: '4173', label: '4173 - VTB - NA - BYHALIA/COLUMBUS', name:'DUMMY' }
    ],
    data: {
      '1002': [
        { id: '1000000001', designation: 'DC Gent', city: 'GE', auto: 'Y', resp: 'R117XX', date: '20250714' },
        { id: '1000000002', designation: 'DC Incheon', city: 'IN', auto: '', resp: '', date: '' },
        { id: '1000000024', designation: 'DC Sydney', city: 'SY', auto: '', resp: '', date: '' },
        { id: '1000000030', designation: 'DC Byhalia', city: 'BY', auto: '', resp: '', date: '' },
        { id: '1000000037', designation: 'DC Mexico', city: 'ME', auto: '', resp: '', date: '' },
        { id: '1000000038', designation: 'DC Curitiba', city: 'CU', auto: '', resp: '', date: '' }
      ],
      '31971': [
        { id: '1000000014', designation: 'DC Lyon', city: 'LY', auto: 'Y', resp: 'R17XX', date: '20250714' },
      ],
      '4173': [
         { id: '1000000001', designation: 'DC Gent', city: 'GE', auto: 'Y', resp: 'R117XX', date: '20250714' },
        { id: '1000000024', designation: 'DC Sydney', city: 'SY', auto: '', resp: '', date: '' },
        { id: '1000000030', designation: 'DC Byhalia', city: 'BY', auto: '', resp: '', date: '' },
        { id: '1000000037', designation: 'DC Mexico', city: 'ME', auto: '', resp: '', date: '' },
        { id: '1000000038', designation: 'DC Curitiba', city: 'CU', auto: '', resp: '', date: '' }
      ]
    }
  },

  '100|VOP': {
    marketConsumers: [
      { id: '1618', label: '1618 - PENTA - EU - GENT' , name:'DUMMY'},
      { id: '4125', label: '4125 - PENTA - NA - BYHALIA', name:'DUMMY' }
    ],
    data: {
      '1618': [
        { id: '1000000001', designation: 'DC Gent', city: 'GE', auto: 'Y', resp: 'R117XX', date: '20250714' },
        { id: '1000000002', designation: 'DC Incheon', city: 'IN', auto: '', resp: '', date: '' },
        { id: '1000000024', designation: 'DC Sydney', city: 'SY', auto: '', resp: '', date: '' },
        { id: '1000000030', designation: 'DC Byhalia', city: 'BY', auto: '', resp: '', date: '' },
        { id: '1000000037', designation: 'DC Mexico', city: 'ME', auto: '', resp: '', date: '' },
        { id: '1000000038', designation: 'DC Curitiba', city: 'CU', auto: '', resp: '', date: '' }
      ],
      '4125': [
        { id: '1000000030', designation: 'DC Byhalia', city: 'BY', auto: 'Y', resp: 'R117XX', date: '20250714' },
        { id: '1000000002', designation: 'DC Incheon', city: 'IN', auto: '', resp: '', date: '' },
        { id: '1000000024', designation: 'DC Sydney', city: 'SY', auto: '', resp: '', date: '' },
        { id: '1000000001', designation: 'DC Gent', city: 'GE', auto: '', resp: '', date: '' },
        { id: '1000000037', designation: 'DC Mexico', city: 'ME', auto: '', resp: '', date: '' },
        { id: '1000000038', designation: 'DC Curitiba', city: 'CU', auto: '', resp: '', date: '' }
      ],
      
    }
  },

  '1638189|VO':{
    marketConsumers:[
      { id: '1002', label: '1002 - VTB - EU - GENT',name:'EXHAUST PRESSURE GOVERNOR' }
    ],

    data:{
      '1002':[
         { id: '1000000001', designation: 'DC Gent', city: 'GE', auto: 'Y', resp: 'R117XX', date: '20250714' },
        { id: '1000000002', designation: 'DC Incheon', city: 'IN', auto: '', resp: '', date: '' },
        { id: '1000000024', designation: 'DC Sydney', city: 'SY', auto: '', resp: '', date: '' },
        { id: '1000000030', designation: 'DC Byhalia', city: 'BY', auto: '', resp: '', date: '' },
        { id: '1000000037', designation: 'DC Mexico', city: 'ME', auto: '', resp: '', date: '' },
        { id: '1000000038', designation: 'DC Curitiba', city: 'CU', auto: '', resp: '', date: '' }
      ]
    }
  }
};

/* ✅ Existing functions */
export function getMarketConsumers(partNumber, prefix) {
  const key = `${partNumber}|${prefix}`;
  return new Promise((resolve) => {
    const result = logisticsDatabase[key]?.marketConsumers || [];
    setTimeout(() => resolve(result), 300);
  });
}

export function getLogisticsData(partNumber, prefix, marketConsumer) {
  const key = `${partNumber}|${prefix}`;
  return new Promise((resolve) => {
    const result = logisticsDatabase[key]?.data?.[marketConsumer] || [];
    setTimeout(() => resolve(result), 300);
  });
}

/* ✅ New helper to fetch available prefixes for a given part number */
export function getAvailablePrefixes(partNumber) {
  const prefixes = Object.keys(logisticsDatabase)
    .filter(key => key.startsWith(`${partNumber}|`))
    .map(key => key.split('|')[1]);
  return prefixes;
}
