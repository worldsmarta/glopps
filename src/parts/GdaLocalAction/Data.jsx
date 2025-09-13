
// export const productArea=["","VOLVO TRUCK & BUS", "MACK", "RENAULT", "UD TRUCKS", "EICHER TRUCK & BUS","VOLVO CE","VOLVO PENTA" ];

export const productArea={"":"","VTB":"VOLVO TRUCK & BUS", "MACK":"MACK", "RENAULT":"RENAULT","UD": "UD TRUCKS", "ETB":"EICHER TRUCK & BUS","VCE":"VOLVO CE",
  "PENTA":"VOLVO PENTA" };


// export const productArea=['option1','option2']

export const gdaDatabase={
    '100|VO':{name:'DUMMY',partStageVersion:'P/001',brandMark:'0 - No Branding',
      data:[
      {id:'1',prodarea:'VTB',gda:'EU',designation:'GENT',consumer:'1002',comp:'03',lda:'',IntroDate:'19930607',type:'S',qty:'0',supcode:'',orderfinal:'',userid:'IMS',chgdte:'20111021'},
      {id:'2',prodarea:'VTB',gda:'NA',designation:'BYHALIA/COLUMBUS',consumer:'4173',comp:'03',lda:'',IntroDate:'19930607',type:'S',qty:'0',supcode:'',orderfinal:'',userid:'IMS',chgdte:'20111021'},
      {id:'3',prodarea:'VTB',gda:'AUS',designation:'MINTO',consumer:'7835',comp:'03',lda:'',IntroDate:'',type:'S',qty:'',supcode:'',orderfinal:'',userid:'',chgdte:''},
      {id:'4',prodarea:'VTB',gda:'AUS',designation:'LDA',consumer:'',comp:'03',lda:'',IntroDate:'',type:'',qty:'',supcode:'',orderfinal:'',userid:'',chgdte:''},
      {id:'5',prodarea:'UD',gda:'ASIA',designation:'AGEO',consumer:'2924',comp:'03',lda:'',IntroDate:'',type:'S',qty:'',supcode:'',orderfinal:'',userid:'',chgdte:''},
      {id:'6',prodarea:'MACK',gda:'AUS',designation:'MINTO',consumer:'5741',comp:'03',lda:'',IntroDate:'',type:'S',qty:'',supcode:'',orderfinal:'',userid:'',chgdte:''},
      {id:'7',prodarea:'VTB',gda:'SA',designation:'LDA',consumer:'',comp:'03',lda:'',IntroDate:'',type:'',qty:'',supcode:'',orderfinal:'',userid:'',chgdte:''}

      ]
    },
    '100|VOE':{name:'DUMMY',partStageVersion:'P/001',brandMark:'0 - No Branding'},
    '100|VOP':{name:'DUMMY',partStageVersion:'P/001',brandMark:'0 - No Branding'},

    '1638189|VO':{name:'EXHAUST PRESSURE GOVERNOR',partStageVersion:'P/018',brandMark:'0 - No Branding'}

}

export function getAvailablePrefixes(partNumber) {
  const prefixes = Object.keys(gdaDatabase) .filter(key => key.startsWith(`${partNumber}|`)) .map(key => key.split('|')[1]);
  return prefixes;
}

export function getResponseFieldsData(partNumber,prefix){
  const key = `${partNumber}|${prefix}`;
  return new Promise((resolve) => {
    const result = gdaDatabase[key] || [];
    console.log(result);
    setTimeout(() => resolve(result), 300);
  });
}

const fullNameToAbbr = Object.entries(productArea).reduce((acc, [abbr, fullName]) => {
  acc[fullName] = abbr;
  return acc;
}, {});

export function getGdaData(partNumber, prefix, productArea) {
  const key = `${partNumber}|${prefix}`;
  return new Promise((resolve) => {
    const dt = gdaDatabase[key]?.data || [];

    // If productArea is falsy, return all data
    if (!productArea) {
      setTimeout(() => resolve(dt), 300);
      return;
    }

    // Map full name to abbreviation if needed
    const abbr = fullNameToAbbr[productArea];

    // Filter data based on whether productArea is abbreviation or full name
    const result = abbr
      ? dt.filter(item => item.prodarea === abbr)
      : dt.filter(item => item.prodarea === productArea); // fallback if productArea is already abbreviation

    console.log('productArea:', productArea);
    console.log('Data:', dt);
    console.log('Filtered result:', result);

    setTimeout(() => resolve(result), 300);
  });
}
