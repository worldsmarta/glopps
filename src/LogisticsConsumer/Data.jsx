const logisticsDatabase = {
  '100|VO': {
    marketConsumers: [
      { id: '1002', label: '1002 - Europe - Active - Primary' },
      { id: '31971', label: '31971 - Asia - Inactive - Secondary' },
      { id: '4173', label: '4173 - Americas - Active - Backup' }
    ],
    data: {
      '1002': [
        { id: '1000000001', designation: 'DC Gent', city: 'GE', auto: 'Y', resp: 'R117XX', date: '20250714' },
        { id: '1000000002', designation: 'DC Incheon', city: 'IN', auto: 'N', resp: '', date: '' },
        { id: '1000000024', designation: 'DC Sydney', city: 'SY', auto: '', resp: '', date: '' },
        { id: '1000000030', designation: 'DC Byhalia', city: 'BY', auto: '', resp: '', date: '' },
        { id: '1000000037', designation: 'DC Mexico', city: 'ME', auto: '', resp: '', date: '' },
        { id: '1000000038', designation: 'DC Curitiba', city: 'CU', auto: '', resp: '', date: '' }
      ],
      '31971': [
        { id: '1000000009', designation: 'DC Tokyo', city: 'TK', auto: 'Y', resp: 'R117YY', date: '20250714' },
        { id: '1000000010', designation: 'DC Bangkok', city: 'BK', auto: '', resp: '', date: '' },
        { id: '1000000012', designation: 'DC Delhi', city: 'DL', auto: '', resp: '', date: '' }
      ],
      '4173': [
        { id: '1000000042', designation: 'DC Berlin', city: 'BE', auto: 'N', resp: '', date: '' },
        { id: '1000000043', designation: 'DC Warsaw', city: 'WA', auto: '', resp: '', date: '' }
      ]
    }
  },

  '100|VOE': {
    marketConsumers: [
      { id: '1003', label: '1003 - Europe - Backup - Secondary' },
      { id: '31972', label: '31972 - Asia - Active - Primary' },
      { id: '4174', label: '4174 - Americas - Inactive - Backup' }
    ],
    data: {
      '1003': [
        { id: '1000000004', designation: 'DC Gent', city: 'GE', auto: 'Y', resp: 'R117XX', date: '20250714' },
        { id: '1000000002', designation: 'DC Incheon', city: 'IN', auto: 'N', resp: '', date: '' },
        { id: '1000000024', designation: 'DC Sydney', city: 'SY', auto: '', resp: '', date: '' },
        { id: '1000000030', designation: 'DC Byhalia', city: 'BY', auto: '', resp: '', date: '' },
        { id: '1000000037', designation: 'DC Mexico', city: 'ME', auto: '', resp: '', date: '' },
        { id: '1000000038', designation: 'DC Curitiba', city: 'CU', auto: '', resp: '', date: '' }
      ],
      '31972': [
        { id: '1000000008', designation: 'DC Tokyo', city: 'TK', auto: 'Y', resp: 'R117YY', date: '20250714' },
        { id: '1000000010', designation: 'DC Bangkok', city: 'BK', auto: '', resp: '', date: '' },
        { id: '1000000012', designation: 'DC Delhi', city: 'DL', auto: '', resp: '', date: '' }
      ],
      '4174': [
        { id: '1000000046', designation: 'DC Berlin', city: 'BE', auto: 'N', resp: '', date: '' },
        { id: '1000000043', designation: 'DC Warsaw', city: 'WA', auto: '', resp: '', date: '' }
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
