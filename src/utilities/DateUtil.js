export function _getMinutesOnQueue(utcDate) {
  var today = new Date();
  var utcDateToCompare = new Date(utcDate);
  var diffMs = today - utcDateToCompare;

  var diffDays = Math.floor(diffMs / 86400000);
  if (diffDays >= 1) {
    return `${ diffDays }d`;
  }

  var diffHrs = Math.floor((diffMs % 86400000) / 3600000);
  var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
  if (diffHrs >= 1) {
    return `${ diffHrs }h ${ diffMins }min`;
  }

  return `${ diffMins }min`;
}

export function _getLocalDate(utcDate) {
  var localDate = new Date(utcDate);
  return localDate.toLocaleString();
}