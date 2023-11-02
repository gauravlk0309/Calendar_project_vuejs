<template>
  <div class="flex flex-center q-ma-md">
      <q-card class="my-card">
          <q-card-section>
              <div class="text-h6">JSON to ICS Converter</div>
          </q-card-section>

          <q-separator />

          <q-card-actions vertical>
              <input class="q-ma-md" type="file" @change="handleFileUpload" accept=".json" />
              <q-btn class="q-ma-md" @click="convertToJson" >Convert to ICS</q-btn>
              <a class="q-ma-md" :href="icsFile" download="events.ics" v-if="icsFile">Download ICS</a>
          </q-card-actions>
      </q-card>
  </div>
  <div class="flex flex-center q-ma-md">
      <q-card class="my-card">
          <q-card-section>
              <div class="text-h6">ICS to JSON Converter</div>
          </q-card-section>

          <q-separator />

          <q-card-actions vertical>
              <input class="q-ma-md" type="file" @change="handleFileChange" />

              <div v-if="calendarData">
                  <pre>{{ calendarData }}</pre>
              </div>
              <a class="q-ma-md" :href="downloadLink" download="calendar-events.json">
                  Download JSON
              </a>
          </q-card-actions>
      </q-card>
  </div>
  <div>

  </div>

</template>

<script>
import ICAL from 'ical.js';

export default {
  data() {
    return {
      jsonData: null,
      icsFile: null,
      errorMessage: '',
      calendarData: null,
    };
  },
  computed: {
    downloadLink() {
      if (!this.calendarData) {
        return '';
      }

      const jsonBlob = new Blob([this.calendarData], { type: 'application/json' });
      return URL.createObjectURL(jsonBlob);
    },
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.jsonData = e.target.result;
        };
        reader.readAsText(file);
      }
    },
    convertToJson() {
      try {
        if (!this.jsonData) {
          throw new Error('Please upload a JSON file.');
        }

        const parsedData = JSON.parse(this.jsonData);

        if (!Array.isArray(parsedData)) {
          throw new Error('JSON data must be an array of events.');
        }

        const jcalData = new ICAL.Component(['vcalendar', [], []]);

        parsedData.forEach(event => {
          const jcalEvent = new ICAL.Component('vevent');

          jcalEvent.addPropertyWithValue('summary', event.summary);
          jcalEvent.addPropertyWithValue('dtstart', event.start);
          jcalEvent.addPropertyWithValue('dtend', event.end);
          jcalEvent.addPropertyWithValue('location', event.location);

          jcalData.addSubcomponent(jcalEvent);
        });

        const blob = new Blob([jcalData.toString()], { type: 'text/calendar' });
        this.icsFile = window.URL.createObjectURL(blob);
        this.errorMessage = ''; // Clear any previous error message
      } catch (error) {
        this.errorMessage = error.message;
        this.icsFile = null; // Clear the file if there's an error
        console.error('Conversion error:', error);
      }
    },

    //second card functions starts here
    async handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const text = await this.readFileAsync(file);
        const events = this.parseICS(text);

        this.calendarData = JSON.stringify(events, null, 2);
      } catch (error) {
        console.error('Error parsing ICS file:', error);
      }
    },
    readFileAsync(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          resolve(reader.result);
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsText(file);
      });
    },
    parseICS(icsText) {
  const lines = icsText.replace(/\r/g, '').split('\n'); // Replace '\r' with ''
  const events = [];
  let event = {};

  lines.forEach((line) => {
    if (line.startsWith('BEGIN:VEVENT')) {
      event = {};
    } else if (line.startsWith('END:VEVENT')) {
      events.push(event);
    } else {
      const [key, value] = line.split(':');
      if (key && value) {
        event[key] = value;
      }
    }
  });

  return events;
},
  },
};
</script>

