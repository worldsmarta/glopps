Data.jsx: it simulates a database and provides functions that return data to UI.

logisticsDatabase:
A object where the key is "<partNumber>|<prefix>".
Each entry has:
marketConsumers: array of consumers { id, label, name }
 data: object where each consumer ID maps to an array of rows for the table.


getMarketConsumers(partNumber, prefix): Returns marketConsumers for that part/prefix  .
getLogisticsData(partNumber, prefix, marketConsumer): Returns the table rows for that market consumer.

getAvailablePrefixes(partNumber): Returns all prefixes available for that part number.(this funtion has use when we display the error message saying 
PART PREFIX:<Prefixes>)