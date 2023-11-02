<template>
  <div>
      <div>
          <div class='flex flex-center'>
            <q-btn-group flat>
              <q-btn :label='getMonthAndYear()' disable />
              <q-btn label='Prev' @click='calendar.prev()' />
              <q-btn label='Today' @click='calendar.moveToToday()' />
              <q-btn label='Next' @click='calendar.next()' />
            </q-btn-group>
          </div>
          <div class="flex justify-between q-mb-sm">
            <q-btn flat label="Filter Menu">
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item clickable v-close-popup>
                    <q-item-section>
                      <q-radio v-model="radioOption" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="allItems" label="All Items" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>
                      <q-radio v-model="radioOption" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="rF" label="Fixed" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>
                      <q-radio v-model="radioOption" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="rFnV" label="Fixed and Verified" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>
                      <q-radio v-model="radioOption" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="rFnVnB" label="Fixed, Verified and Billed" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup>
                    <q-item-section>
                      <q-radio v-model="radioOption" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="rnFnV" label="Neither Fixed, nor Verified" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>

            <q-input color="black" counter type="number" filled v-model="searchInput" label="Search by ID" style="width:200px;">
              <template v-slot:append>
                <q-btn round flat icon="search" @click="searchFor(searchInput, entities)" />
              </template>
            </q-input>
          </div>
          <q-separator />
          <div style='overflow: hidden'>
          <q-calendar-month
              ref='calendar'
              v-model='selectedDate'
              view='month'
              :day-height='90'
              locale='en-us'
              animated
              bordered
              short-weekday-label
              short-month-label
              @input='onModelChanged'
              @click-date='getCurrentDayEvents'
              @click-day='getCurrentDayEvents'

          >

        <template #day="{ scope: { timestamp } }" >
          <template v-for="(entity, index) in entities" :key="index">
            <div class="flex flex-center q-mx-sm" v-if="entity.Detail.CreatedOn.substring(0, 10) === timestamp.date && filterEvents(entity.Detail, radioOption)">
              <q-chip clickable @click="fixed = true" :color="chipColour(entity.Detail)" text-color="white" size="90%" class="q-px-sm" :label="[entity.EntityId + ', ' + entity.WorkflowDataTypeName].toString()">
              </q-chip>
            </div>
          </template>
        </template>
        </q-calendar-month>
          </div>
      </div>
      <div class="row q-pa-xs">
        <q-dialog v-model="fixed" >
          <q-card>
            <q-card-section>

              <q-list class="rounded-borders">
                <div class="flex flex-center q-mb-sm"><q-btn flat :label='parseInt(dayClicked.substring(8, 10)) + " " + getMonthAndYear()' disable /></div>
              <div v-for='(entity, index) in entities' :key='index' >
                  <div v-if="dayClicked === entity.Detail.CreatedOn.substring(0, 10) && filterEvents(entity.Detail, radioOption)">
                      <q-expansion-item
                          expand-separator
                          :style="expansionItemColour(entity.Detail)"
                          :label="[entity.EntityId +  ': ' + entity.WorkflowDataTypeName].toString()"
                          :caption="[entity.Detail.Name + ', Constituency: ' + entity.Detail.ConstituencyId + ', Division: ' + entity.Detail.Division + ', Sub-Division: ' + entity.Detail.SubDivision].toString()"
                      >
                      <div class="row">
                        <q-btn flat label="Edit" style="background-color: white" color="primary" v-if="userType === 'admin'" @click="console.log(entity)" />
                        <q-btn flat label="Delete" style="background-color: white" color="red" v-if="userType === 'admin'" @click="console.log(entity)" />
                      </div>
                          <q-card flat bordered class="my-card">
                            <q-card-section>
                              <div class="text-h6">Type: {{ entity.Detail.Type }}</div>
                              <div class="text-subtitle2">Latitude: {{ entity.Geom.substring(34, 42) }}, Longitude: {{ entity.Geom.substring(45, 53) }}</div>
                            </q-card-section>
                            <q-separator inset />
                            <q-card-section>
                              <div class="text-subtitle2">Created: {{ entity.Detail.CreatedOn.substring(0, 10) }}</div>
                              <div class="text-subtitle2">Fixed: {{ entity.Detail.FixedOn.substring(0, 10) }}</div>
                            </q-card-section>
                            <q-separator inset />
                            <q-card-section>
                              <div class="text-subtitle2">Verified: {{ entity.Detail.VerifiedOn.substring(0, 10) }}</div>
                              <div class="text-subtitle2">Billed: {{ entity.Detail.BilledOn.substring(0, 10) }}</div>
                            </q-card-section>
                          </q-card>
                      </q-expansion-item>
                  </div>
              </div>
          </q-list>

            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Close" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
  </div>
  <!--    <br/><br/><br/>
  <div>
    <input type="file"  @change="handleFileChange" />
    <div v-if="calendarData">
      <h2>Calendar Events (JSON)</h2>
      <pre>{{ calendarData }}</pre>
    </div>
  </div>
  <br/><br/><br/>
  <div>
    <button class="bg-primary text-white q-pa-sm" @click="convertToJsonToICS">Convert to ICS</button>
  </div>-->

</template>
<script>
// import ICAL from 'ical.js'
import { today } from '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.js'
import { ref } from 'vue'
import { useQuasar } from 'quasar'

export default {
setup () {
  const monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const selectedDate = ref(today())
  const dayClicked = ref()
  const calendar = ref()
  const fixed = ref(false)
  const radioOption = ref('allItems')
  const searchInput = ref('')
  const $q = useQuasar()

  function chipColour (eDetail) {
    if (eDetail.FixedOn === '' && eDetail.VerifiedOn === '') {
      return 'red' // neither fixed nor verified: red
    } else if (eDetail.VerifiedOn === '') {
      return 'orange' // fixed only: orange
    } else if (eDetail.FixedOn !== '' && eDetail.VerifiedOn !== '') {
      return 'green' // fixed and verified but not billed: green
    } else if (eDetail.FixedOn !== '' && eDetail.VerifiedOn !== '' && eDetail.BilledOn !== '') {
      return 'aqua' // fixed, verified and billed: teal
    } else {
      return 'purple' // for any weird status combinations
    }
  }
  function getWeekEvents (week, weekdays) {
    // console.log('week: ' + week)
    // console.log('weekdays: ' + weekdays)
  }
  function onModelChanged (date) {
    this.events.unshift(`Model changed: ${date}`)
  }
  function getCurrentDayEvents (data) {
    dayClicked.value = data.scope.timestamp.date
    fixed.value = true
  }

  function expansionItemColour (eDetail) {
    if (eDetail.FixedOn === '' && eDetail.VerifiedOn === '') {
      return 'background-color: rgba(255, 38, 0, 0.541)' // neither fixed nor verified: red
    } else if (eDetail.VerifiedOn === '') {
      return 'background-color: rgba(255, 166, 0, 0.548)' // fixed only: orange
    } else if (eDetail.FixedOn !== '' && eDetail.VerifiedOn !== '') {
      return 'background-color: rgba(115, 255, 0, 0.514)' // fixed and veridied, but not billed: green
    } else if (eDetail.FixedOn !== '' && eDetail.VerifiedOn !== '' && eDetail.BilledOn !== '') {
      return 'background-color: rgba(129, 255, 255, 0.87)' // fixed, verified and billed: teal
    } else {
      return 'background-color: rgba(97, 100, 247, 0.87)' // for any weird status combinations
    }
  }

  function filterEvents (eDetail, radioOption) {
    if (radioOption === 'rF') {
      return eDetail.FixedOn !== '' && eDetail.VerifiedOn === '' && eDetail.BilledOn === ''
    }
    if (radioOption === 'rFnV') {
      return eDetail.FixedOn !== '' && eDetail.VerifiedOn !== '' && eDetail.BilledOn === ''
    }
    if (radioOption === 'rFnVnB') {
      return eDetail.FixedOn !== '' && eDetail.VerifiedOn !== '' && eDetail.BilledOn !== ''
    }
    if (radioOption === 'rnFnV') {
      return eDetail.FixedOn === '' && eDetail.VerifiedOn === ''
    }
    if (radioOption === 'allItems') {
      return true
    }
  }

  function getMonthAndYear () {
    return monthArr[parseInt(selectedDate.value.substring(5, 7)) - 1] + ' ' + selectedDate.value.substring(0, 4)
  }

  function searchFor (ID, entities) {
    let reqEntityDate
    let existFlag = false
    entities.forEach((entity) => {
      if (entity.EntityId === parseInt(ID)) {
        radioOption.value = 'allItems'
        const currSelectedMonth = parseInt(selectedDate.value.substring(5, 7))
        const currSelectedYear = parseInt(selectedDate.value.substring(0, 4))
        const requiredMonth = parseInt(entity.Detail.CreatedOn.substring(5, 7))
        const requiredYear = parseInt(entity.Detail.CreatedOn.substring(0, 4))
        const monthDiff = requiredMonth - currSelectedMonth
        const yearDiff = requiredYear - currSelectedYear
        const moveVal = monthDiff + (yearDiff * 12)
        if (moveVal !== 0) {
          calendar.value.move(moveVal)
        }
        reqEntityDate = entity.Detail.CreatedOn.substring(0, 10)
        dayClicked.value = reqEntityDate
        fixed.value = true
        existFlag = true
      }
    })
    if (existFlag === false) {
      setTimeout(() => {
        $q.notify({
          message: 'ID: ' + ID + ' is non-existent',
          type: 'negative',
          position: 'top',
          progress: true,
          actions: [
            { icon: 'close', color: 'white', round: true, handler: () => {} }
          ]
        })
      }, 0)
    }
  }

  async function handleFileChange (event) {
    const file = event.target.files[0]
    if (!file) return

    try {
      const text = await this.readFileAsync(file)
      const events = this.parseICS(text)

      this.calendarData = JSON.stringify(events, null, 2)
    } catch (error) {
      console.error('Error parsing ICS file:', error)
    }
  }

  function readFileAsync (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        resolve(reader.result)
      }

      reader.onerror = (error) => {
        reject(error)
      }

      reader.readAsText(file)
    })
  }

  function parseICS (icsText) {
    const lines = icsText.split('\n')
    const events = []
    let event = {}

    lines.forEach((line) => {
      if (line.startsWith('BEGIN:VEVENT')) {
        event = {}
      } else if (line.startsWith('END:VEVENT')) {
        events.push(event)
      } else {
        const [key, value] = line.split(':')
        if (key && value) {
          event[key] = value
        }
      }
    }
    )

    return events
  }

  function convertToJsonToICS () {
    // Replace this with your JSON data.
    const jsonData = {
      summary: 'Event Summary',
      description: 'Event Description',
      start: '2023-09-05T10:00:00Z',
      end: '2023-09-05T12:00:00Z',
      location: 'Event Location'
    }

    // Create an iCalendar event
    const jcalEvent = new ICAL.Component('vevent')
    jcalEvent.addPropertyWithValue('summary', jsonData.summary)
    jcalEvent.addPropertyWithValue('description', jsonData.description)
    jcalEvent.addPropertyWithValue('dtstart', jsonData.start)
    jcalEvent.addPropertyWithValue('dtend', jsonData.end)
    jcalEvent.addPropertyWithValue('location', jsonData.location)

    // Create an iCalendar calendar and add the event
    const jcalCalendar = new ICAL.Component('vcalendar')
    jcalCalendar.addSubcomponent(jcalEvent)

    // Generate the ICS string
    const icsData = jcalCalendar.toString()

    // Create a download link for the ICS file
    const blob = new Blob([icsData], { type: 'text/calendar' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'event.ics'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return {
    calendar,
    dayClicked,
    selectedDate,
    monthArr,
    fixed,
    radioOption,
    searchInput,

    onModelChanged,
    getCurrentDayEvents,
    getWeekEvents,
    chipColour,
    expansionItemColour,
    filterEvents,
    getMonthAndYear,
    searchFor,

    parseICS,
    readFileAsync,
    handleFileChange,
    convertToJsonToICS,
    calendarData: null
  }
},
props: {
  entities: Object,
  userType: String
}

}
</script>

<style scoped>
</style>
