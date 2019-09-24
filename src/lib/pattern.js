export default {

  // UK mobile and landline
  // Accepting only 01-3 for landline or 07 for mobile to exclude many premium numbers'
  phonesUK: '^(((00|\\+)44|0)(1\\d{8,9}|[23]\\d{9}|7([1345789]\\d{8}|624\\d{6})))$',

  // UK postcode
  // Does not match to UK Channel Islands that have their own postcodes (non standard UK)
  postcodeUK: '^((([A-PR-UWYZ][0-9])|([A-PR-UWYZ][0-9][0-9])|([A-PR-UWYZ][A-HK-Y][0-9])|([A-PR-UWYZ][A-HK-Y][0-9][0-9])|([A-PR-UWYZ][0-9][A-HJKSTUW])|([A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\\s?([0-9][ABD-HJLNP-UW-Z]{2})|(GIR)\\s?(0AA))$',

  // Generic first and last name (allow characther)
  name: '[a-zA-Z][a-zA-Z\\- \']*',

  email: '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'

}
