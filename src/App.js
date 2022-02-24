import logo from './logo.svg';
import './App.css';
import {GoogleLogin} from 'react-google-login'
import { getDefaultNormalizer } from '@testing-library/react';
import { useState } from 'react';
import axios from 'axios';

function App() {
  var gapi = window.gapi

  const responseGoogle = response => {
    console.log(response)
    const {code} = response
    axios.post('http://localhost:4000/api/create-tokens', {code})
    .then(response => {
      console.log(response.data)
    })
    .catch(error => console.log(error.message))
  }

  const responseError = error => {
    console.log(error) 
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(summary, description, location, startDateTime,endDateTime)
    gapi.load('client:auth2', () => {
      console.log('loaded client')

      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })

      gapi.client.load('calendar', 'v3', () => console.log('bam!'))

      gapi.auth2.getAuthInstance().signIn()
      .then(() => {
        
        var event = {
          'summary': summary,
          'location': location,
          'description': description,
          'start': {
            'dateTime': new Date(startDateTime),
            'timeZone': 'America/Los_Angeles'
          },
          'end': {
            'dateTime': new Date(endDateTime),
            'timeZone': 'America/Los_Angeles'
          },
          'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=2'
          ],
          'reminders': {
            'useDefault': false,
            'overrides': [
              {'method': 'email', 'minutes': 24 * 60},
              {'method': 'popup', 'minutes': 10}
            ]
          }
        }

        var request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event,
        })

        request.execute(event => {
          console.log(event)
          window.open(event.htmlLink)
        })

      })
    })
  }

  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [startDateTime, setStartDateTime] = useState('')
  const [endDateTime, setEndDateTime] = useState('')

  var CLIENT_ID = "1098864353355-248iumgub77b6bo97qv2ki9uqr1kihvm.apps.googleusercontent.com"
  var API_KEY = "AIzaSyCCbEpHsuNaz2_zvXG4hWYJSjeq4WvrfHE"
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
  var SCOPES = "https://www.googleapis.com/auth/calendar.events"


  return (
    <div>
      <div className="App">
        <h1>Event Google Calendar</h1>
      </div>
      <div>
      </div>
      <div style={{display: 'flex', paddingLeft: '15px'}}>
        <form onSubmit={handleSubmit}>
          <label htmlFor='summary'>Nama Event</label>
          <br/>
          <input 
            type='text'
            id="summary" 
            value={summary} 
            onChange={e => setSummary(e.target.value)}/>
          <br/>

          <label htmlFor='description'>Deskripsi</label>
          <br/>
          <textarea
            id="description" 
            value={description} 
            onChange={e => setDescription(e.target.value)}/>
          <br/>

          <label htmlFor='location'>Lokasi</label>
          <br/>
          <input 
            type='text'
            id="location" 
            value={location} 
            onChange={e => setLocation(e.target.value)}/>
          <br/>

          <label htmlFor='startDateTime'>Tanggal Mulai</label>
          <br/>
          <input 
            type='datetime-local' 
            id="startDateTime" 
            value={startDateTime} 
            onChange={e => setStartDateTime(e.target.value)}/>
          <br/>

          <label htmlFor='endDateTime'>Tanggal Berakhir</label>
          <br/>
          <input 
            type='datetime-local'
            id="endDateTime" 
            value={endDateTime} 
            onChange={e => setEndDateTime(e.target.value)}/>
          <br/>
          <button type='submit'>Buat Event</button>
        </form>
      </div>
    </div>
  );
}

export default App;
