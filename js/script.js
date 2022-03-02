// Phone Scarch
let phoneData = []

// Input Field
const inputText = (inputBoxId) => {
  const inputField = document.getElementById(inputBoxId)
  const boxText = inputField.value
  inputField.value = ''
  return boxText ? boxText : -1
}

// Show And Hide Elements
const showElement = (elementId) => {
  document.getElementById(elementId).classList.remove('hidden')
}
const hideElement = (elementId) => {
  document.getElementById(elementId).classList.add('hidden')
}

//API
const getfetchUrl = (searchId, search = false) => {
  const baseUrl = 'https://openapi.programming-hero.com/api/phone'
  return (fetchUrl = `${baseUrl}${search ? 's?search=' : '/'}${searchId}`)
}

//Details From API
const fetchPhoneInfo = async (fetchUrl) => {
  try {
    const res = await fetch(fetchUrl)
    const result = await res.json()
    return result.data
  } catch (error) {
    console.log(error)
  }
}

//Phone Details
const displayPhoneDetails = (phone) => {
  const { name, brand, image, releaseDate, mainFeatures, others } = phone
  const { chipSet, displaySize, memory, sensors, storage } = mainFeatures
  const NO_INFO_FOUND = 'No Release Date Found'

  //All Phone Details
  document.getElementById('phone-image').src = image
  document.getElementById('phone-name').innerText = name
  document.getElementById('release-date').innerText = releaseDate
    ? releaseDate
    : NO_INFO_FOUND
  document.getElementById('brand').innerText = brand ? brand : NO_INFO_FOUND
  document.getElementById('chipset').innerText = chipSet
    ? chipSet
    : NO_INFO_FOUND
  document.getElementById('display-size').innerText = displaySize
    ? displaySize
    : NO_INFO_FOUND
  document.getElementById('memory').innerText = memory ? memory : NO_INFO_FOUND
  document.getElementById('storage').innerText = storage
    ? storage
    : NO_INFO_FOUND
  document.getElementById('sensors').innerText =
    sensors?.length > 0 ? sensors?.join(', ') : NO_INFO_FOUND
  const othersContainer = document.getElementById('others')
  othersContainer.innerHTML = `
    <span class="font-bold">Others:</span>
  `
  others
    ? Object.entries(others).forEach(([key, value]) => {
      const h3 = document.createElement('h3')
      h3.innerHTML = `
          <i class="mr-1.5 ${[key.toLowerCase()]}"></i>
            ${key}: <span class='font-bold'>${value ? value : NO_INFO_FOUND
        }</span>
        `
      othersContainer.appendChild(h3)
    })
    : (othersContainer.innerHTML = `
        <h3>Others: <span class='font-bold'>${NO_INFO_FOUND}</span></h3>
    `)

  //Show Spinner
  hideElement('spinner')
  showElement('phone-details')
}

//Phone Details
const searchPhoneDetails = async (phoneId) => {
  window.scrollTo(0, 0)
  showElement('spinner')
  !document.getElementById('phone-details').classList.contains('hidden') &&
    hideElement('phone-details')
  const fetchUrl = getfetchUrl(phoneId)
  const phoneDetails = await fetchPhoneInfo(fetchUrl)
  displayPhoneDetails(phoneDetails)
}

//Phone Search Result
const displayPhoneInfo = (phones, showAll = false) => {
  const cardContainer = document.getElementById('card-container')
  cardContainer.textContent = ''

  //20 search results
  let filteredPhones = []
  filteredPhones = showAll ? phones : phones?.filter((phone, i) => i < 20)
  filteredPhones.forEach((phone) => {
    const { brand, image, phone_name, slug } = phone
    const div = document.createElement('div')
    div.classList.add('card')
    div.innerHTML = `
            <div class='card__img-container'>
                <img src="${image}" alt='Picture of ${phone_name}' />
            </div>
            <h2 class='card__title'>${phone_name}</h2>
            <h4 class='card__brand-name'>${brand}</h4>
            <button class='custom-btn' onclick="searchPhoneDetails('${slug}')">
            View Details</i>
            </button>
        `
    cardContainer.appendChild(div)
  })

  //Hiding spinner
  hideElement('spinner-result')
  showElement('search-result-container')

  //Show All Button
  !showAll && phones.length > 20
    ? showElement('show-all-btn')
    : hideElement('show-all-btn')
}

//Phone Results
const searchPhone = async () => {
  const boxText = inputText('input-field')
  // Error Messege
  if (boxText === -1) {
    document.getElementById(
      'error-msg'
    ).innerText = `"Please Enter Phone Brand Name"`
    return
  }
  document.getElementById('error-msg').innerText = ''

  //Show Spinner
  showElement('spinner-result')
  !document
    .getElementById('search-result-container')
    .classList.contains('hidden') && hideElement('search-result-container')
  !document.getElementById('phone-details').classList.contains('hidden') &&
    hideElement('phone-details')

  //API
  const fetchUrl = getfetchUrl(boxText?.toLowerCase(), true)
  phoneData = await fetchPhoneInfo(fetchUrl)
  const heading = document.getElementById('search-result-header')
  heading.innerText = `${phoneData.length > 0 ? 'Result Found For' : 'No Result Found For'
    } ${boxText}`

  displayPhoneInfo(phoneData)
}

//Display All
const showAllSearchResults = () => {
  displayPhoneInfo(phoneData, true)
}
//Hide All
const hidePhoneDetails = () => {
  hideElement('phone-details')
}
