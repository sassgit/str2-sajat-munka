const countrySelect = document.querySelector('#inputCountry');
const stateSelect = document.querySelector('#inputState');
countrySelect.addEventListener('change', ev => countrySelectChange(ev));

const usaStates = [
  'Alaska',
  'Alabama',
  'Arkansas',
  'American Samoa',
  'Arizona',
  'California',
  'Colorado',
  'Connecticut',
  'District of Columbia',
  'Delaware',
  'Florida',
  'Georgia',
  'Guam',
  'Hawaii',
  'Iowa',
  'Idaho',
  'Illinois',
  'Indiana',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Massachusetts',
  'Maryland',
  'Maine',
  'Michigan',
  'Minnesota',
  'Missouri',
  'Mississippi',
  'Montana',
  'North Carolina',
  'North Dakota',
  'Nebraska',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'Nevada',
  'New York',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Puerto Rico',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Virginia',
  'Virgin Islands',
  'Vermont',
  'Washington',
  'Wisconsin',
  'West Virginia',
  'Wyoming',
];

const hunStates = [
  'Budapest',
  'Bács-Kiskun',
  'Baranya',
  'Békés',
  'Borsod-Abaúj-Zemplén',
  'Csongrád',
  'Fejér',
  'Győr-Moson-Sopron',
  'Hajdú-Bihar',
  'Heves',
  'Jász-Nagykun-Szolnok',
  'Komárom-Esztergom',
  'Nógrád',
  'Pest',
  'Somogy',
  'Szabolcs-Szatmár-Bereg',
  'Tolna',
  'Vas',
  'Veszprém',
  'Zala',
];

const genStateOptions = stateArr => `<option selected>Choose...</option>${stateArr.map( e=> `<option>${e}</option>`).join('')}`;

function countrySelectChange(ev) {
  if (countrySelect.selectedIndex == 1) {
    stateSelect.innerHTML = genStateOptions(usaStates);
  } else if (countrySelect.selectedIndex == 2) {
    stateSelect.innerHTML = genStateOptions(hunStates);
  } else {
    stateSelect.innerHTML = genStateOptions([]);
  }

}