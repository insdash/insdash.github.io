function getUserPreference() {
  return localStorage.getItem('theme') || 'system';
}

function saveUserPreference(userPreference) {
  localStorage.setItem('theme', userPreference);
}

function getAppliedMode(userPreference) {
  if (userPreference === 'light-theme') {
    return 'light-theme';
  }
  if (userPreference === 'dark-theme') {
    return 'dark-theme';
  }
  
  // system
  if (matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark-theme';
  }
  return 'light-theme';
}

const colorScheme = document.querySelector('meta[name="color-scheme"]');
function setAppliedMode(theme) {
  document.body.className = theme;
  colorScheme.content = theme;
}

function rotatePreferences(userPreference) {
  if (userPreference === 'system') {
    return 'light-theme'
  }
  if (userPreference === 'light-theme') {
    return 'dark-theme';
  }
  if (userPreference === 'dark-theme') {
    return 'system';
  }
  // for invalid values, just in case
  return 'system';
}



/* init and eventListener for null on safari */
function init() {
  var themeDisplay = document.getElementById('theme');
  var themeToggler = document.getElementById('mode-button');
  themeToggler.onclick = () => {
    const newUserPref = rotatePreferences(userPreference);
    userPreference = newUserPref;
    saveUserPreference(newUserPref);
    themeDisplay.innerText = newUserPref;
    setAppliedMode(getAppliedMode(newUserPref));
  }
  let userPreference = getUserPreference();
  setAppliedMode(getAppliedMode(userPreference));
  themeDisplay.innerText = userPreference;
}

document.addEventListener('readystatechange', function() {
  if (document.readyState === "complete") {
    init();
  }
});



function saveModePreference(modePreference) {
  localStorage.setItem('mode', modePreference);
}


function rotateModePreferences(modePreference) {
  if (modePreference === 'system') {
    return 'light_mode'
  }
  if (modePreference === 'light-theme') {
    return 'dark_mode';
  }
  if (modePreference === 'dark-theme') {
    return 'dark_mode';
  }
  // for invalid values, just in case
  return 'light_mode';
}

/* init and eventListener for null on safari */
function modeInit() {
  var themeDisplay = document.getElementById('mode');
  themeToggler.onclick = () => {
    const newModePref = rotateModePreferences(modePreference);
    modePreference = newModePref;
    saveModePreference(newModePref);
    themeDisplay.innerText = newModePref;
    setAppliedMode(getAppliedMode(newModePref));
  }
  let modePreference = getModePreference();
  setAppliedMode(getAppliedMode(modePreference));
  themeDisplay.innerText = modePreference;
}








