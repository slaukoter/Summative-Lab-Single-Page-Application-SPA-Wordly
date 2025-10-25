// When the user submits the search form, run the handleSearch function

document.getElementById('searchForm').addEventListener('submit', handleSearch)

// This function runs when the user presses search

async function handleSearch(event) {

  // Prevent the page from reloading

  event.preventDefault() 

  // Grab the word the user typed into the input box

  const word = document.getElementById('wordInput').value.trim()

  // If the input is empty, show an alert and stop

  if (!word) {
    alert('Please enter a word to search')
    return
  }

  // Go get the data for the word from the dictionary API

  fetchWordData(word)
}

// This function talks to the Free Dictionary API and gets info about the word

async function fetchWordData(word) {
  const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word

  try {

    // Use fetch to get data from the URL

    const response = await fetch(url)

    // If the word is not found, throw an error

    if (!response.ok) {
      throw new Error('Word not found')
    }

    // Convert the data into a JavaScript object we can use

    const data = await response.json()

    // Show the word information on the page

    displayResults(data[0])

  } catch (error) {

    // If something goes wrong (like a bad word), show a message
    
    document.getElementById('results').innerHTML =
      '<p>Sorry, no results found for "<strong>' + word + '</strong>"</p>'
  }
}

// This function updates the web page with the information from the API

function displayResults(entry) {

  // Get all the elements we need to fill in

  const wordEl = document.getElementById('word')
  const phoneticEl = document.getElementById('phonetic')
  const definitionsEl = document.getElementById('definitions')
  const synonymsEl = document.getElementById('synonyms')
  const audioBtn = document.getElementById('audioBtn')

  // Show the word that was searched

  wordEl.textContent = entry.word

  // Show how to pronounce the word if available

  if (entry.phonetics && entry.phonetics.length > 0 && entry.phonetics[0].text) {
    phoneticEl.textContent = entry.phonetics[0].text
  } else {
    phoneticEl.textContent = 'No pronunciation available'
  }

  // Clear out any old definitions from previous searches

  definitionsEl.innerHTML = ''

  // Loop through all meanings and definitions and show them

  if (entry.meanings && entry.meanings.length > 0) {
    entry.meanings.forEach(function(meaning) {
      if (meaning.definitions && meaning.definitions.length > 0) {
        meaning.definitions.forEach(function(def) {
          const li = document.createElement('li')
          li.textContent = def.definition
          definitionsEl.appendChild(li)
        })
      }
    })
  }

  // Collect all synonyms from the meanings

  let allSynonyms = []
  if (entry.meanings && entry.meanings.length > 0) {
    entry.meanings.forEach(function(meaning) {
      if (meaning.definitions && meaning.definitions.length > 0) {
        meaning.definitions.forEach(function(def) {
          if (def.synonyms && def.synonyms.length > 0) {
            allSynonyms = allSynonyms.concat(def.synonyms)
          }
        })
      }
    })
  }

  // Show synonyms or a message if there are none

  if (allSynonyms.length > 0) {
    synonymsEl.textContent = allSynonyms.join(', ')
  } else {
    synonymsEl.textContent = 'No synonyms found'
  }

  // Play the pronunciation sound if the audio is available

  let audioUrl = ''
  if (entry.phonetics && entry.phonetics.length > 0 && entry.phonetics[0].audio) {
    audioUrl = entry.phonetics[0].audio
  }

  // Show or hide the play button based on whether there's audio

  if (audioUrl) {
    audioBtn.style.display = 'inline'
    audioBtn.onclick = function() {
      const audio = new Audio(audioUrl)

      // Play the word sound
      
      audio.play() 
    }
  } else {
    audioBtn.style.display = 'none'
  }
}
