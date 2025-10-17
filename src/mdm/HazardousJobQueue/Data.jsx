export const productArea = {
    "": "",
    "VOLVO TRUCK & BUS": "VOLVO TRUCK & BUS", 
    "MACK": "MACK", 
    "RENAULT": "RENAULT",
    "UD TRUCKS": "UD TRUCKS", 
    "EICHER TRUCK & BUS": "EICHER TRUCK & BUS",
    "VOLVO CE": "VOLVO CE",
    "VOLVO PENTA": "VOLVO PENTA"
};

export const hazardousJobDatabase = {
    '4130002724|LGG': {
        data: [
            {
                id: '1',
                partId: 'LGG 4130002724',
                description: 'WET BATTERY',
                dangerousCode: '4',
                introDate: '20180709',
                jobDate: '20180709',
                psuNumber: '70912'
            }
        ]
    }
};

// Component options based on the image
export function getComponentOptions() {
    return [
        '',
        '01 - Volvo Construction Equipment',
        '03 - VTC, VTB, RT, MT, UD and ETB',
        '04 - Volvo Penta'
    ];
}

// Consumer options based on the image
export function getConsumerOptions() {
    return [
        '',
        'EU - GENT/ESKILSTUNA - 100 - VCE',
        'EU - GENT - 1002 - VTB',
        'EU - GENT - 1618 - PENTA',
        'SA - CURITIBA - 2720 - VTB',
        'SA - CURITIBA - 2809 - VCE',
        'ASIA - AGEO - 2924 - UD',
        'NA - BYHALIA/COLUMBUS - 4048 - VCE',
        'NA - BYHALIA - 4125 - PENTA',
        'NA - BYHALIA/COLUMBUS - 4173 - VTB',
        'NA - BYHALIA/COLUMBUS - 4306 - MACK',
        'AUS - MINTO - 7835 - VTB',
        'EU - SINGAPORE - 7905 - VCE',
        'ASIA - SHANGHAI - 9430 - UD',
        'ASIA - SINGAPORE - 9431 - UD',
        'SA - CURITIBA - 8431 - PENTA',
        'AUS - MINTO - 5741 - MACK',
        'ASIA - PITHAMPUR - 9443 - ETB',
        'ASIA - DND SHANGHAI - 8446 - UD',
        'EU - MOTHERWELL - 8475 - VCE'
    ];
}

export function getAvailablePrefixes(partNumber) {
    const prefixes = Object.keys(hazardousJobDatabase)
        .filter(key => key.startsWith(`${partNumber}|`))
        .map(key => key.split('|')[1]);
    return prefixes;
}

export function getHazardousJobData(partNumber, prefix, productArea, component, consumer) {
    const key = `${partNumber}|${prefix}`;
    return new Promise((resolve) => {
        let data = hazardousJobDatabase[key]?.data || [];
        
        // Apply filters if needed
        if (productArea) {
            data = data.filter(item => {
                // Since we don't have product area in the data structure, 
                // we'll return all data for now
                return true;
            });
        }
        if (component) {
            data = data.filter(item => {
                // Filter by component if needed
                return true;
            });
        }
        if (consumer) {
            data = data.filter(item => {
                // Filter by consumer if needed
                return true;
            });
        }
        
        setTimeout(() => resolve(data), 300);
    });
}