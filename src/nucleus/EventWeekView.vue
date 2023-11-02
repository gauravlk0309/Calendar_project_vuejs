<template>
  <div class="subcontent">
    <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    />
    <div>
    <input
      type="text"
      v-model="entityIdInput"
      @keydown.enter="searchByEntityId"
      placeholder="Enter EntityId and press Enter"
    />
  </div>

  <!-- Display details -->
  <div v-if="entityIdDetails">
    <p><b>{{ entityIdDetails }}</b></p>
  </div>

    <div class="row justify-center">
      <div class="row justify-center">
    <!-- Toggle for Created On -->
    <q-toggle
      v-model="showCreatedOn"
      label="Created On"
      color="green"
      @change="updateEvents"
    />

    <!-- Toggle for Verified On -->
    <q-toggle
      v-model="showVerifiedOn"
      label="Verified On"
      color="blue"
      @change="updateEvents"
    />

    <!-- Toggle for Fixed On -->
    <q-toggle
      v-model="showFixedOn"
      label="Fixed On"
      color="orange"
      @change="updateEvents"
    />
  </div>
      <div style="display: flex; width: 100%;">
        <q-calendar-day
          ref="calendar"
          v-model="selectedDate"
          view="week"
          animated
          bordered
          transition-next="slide-left"
          transition-prev="slide-right"
          no-active-date
          :interval-start="3"
          :interval-count="18"
          :interval-height="35"
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-time="onClickTime"
          @click-interval="onClickInterval"
          @click-head-intervals="onClickHeadIntervals"
          @click-head-day="onClickHeadDay"
        >
          <template #head-day-event="{ scope: { timestamp } }">
            <div style="display: flex; justify-content: center; flex-wrap: wrap; padding: 2px;">
              <template
                v-for="event in eventsMap[timestamp.date]"
                :key="event.id"
              >
                <q-badge
                  v-if="!event.time"
                  :class="badgeClasses(event, 'header')"
                  :style="badgeStyles(event, 'header')"
                  style="width: 100%; cursor: pointer; height: 12px; font-size: 10px; margin: 1px;"
                >
                  <span class="title q-calendar__ellipsis">
                    {{ event.title }}
                    <q-tooltip>{{ event.details }}</q-tooltip>
                  </span>
                </q-badge>
                <q-badge
                  v-else
                  :class="badgeClasses(event, 'header')"
                  :style="badgeStyles(event, 'header')"
                  style="margin: 1px; width: 10px; max-width: 10px; height: 10px; max-height: 10px"
                  @click="scrollToEvent(event)"
                >
                  <q-tooltip>{{ event.time + ' - ' + event.details }}</q-tooltip>
                </q-badge>
              </template>
            </div>
          </template>

          <template #day-body="{ scope: { timestamp, timeStartPos, timeDurationHeight } }">
            <template
              v-for="event in getEvents(timestamp.date)"
              :key="event.id"
            >
              <div
                v-if="event.time !== undefined"
                class="my-event"
                :class="badgeClasses(event, 'body')"
                :style="badgeStyles(event, 'body', timeStartPos, timeDurationHeight)"
              >
                <span class="title q-calendar__ellipsis">
                  {{ event.title }}
                  <q-tooltip>{{ event.details }}</q-tooltip>
                </span>
              </div>
            </template>
          </template>
        </q-calendar-day>
      </div>
    </div>
  </div>
</template>
<script>
import {
  QCalendarDay,
  addToDate,
  parseTimestamp,
  isBetweenDates,
  today,
  parsed,
  parseDate,
  parseTime
} from '@quasar/quasar-ui-qcalendar/src/QCalendarDay.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarDay.sass'

import { defineComponent } from 'vue'
import NavigationBar from '../pages/NavigationBar.vue'

// The function below is used to set up our demo data
const CURRENT_DAY = new Date()
function getCurrentDay (day) {
  const newDay = new Date(CURRENT_DAY)
  newDay.setDate(day)
  const tm = parseDate(newDay)
  return tm.date
}

export default defineComponent({
  name: 'WeekSlotDayBody',
  components: {
    NavigationBar,
    QCalendarDay
  },
  data () {
  return {
    selectedDate: today(),
    jsonDataList: [
    {
            EntityId: 90454,
            WorkflowDataTypeName: "RoadDefect",
            WorkflowStepId: "500",
            GeoElementTypeId: 10000,
            Geom: "{\"type\": \"Point\", \"coordinates\": [74.092837, 15.535206]}",
            Detail: {
                Type: "Pothole",
                VerifiedOn: "2023-08-09T05:12:04",
                Length: "3.2",
                FixedOn: "2023-08-08T05:02:19",
                Division: "XXIII",
                CreatedOn: "2023-08-07T11:25:18",
                ConstituencyId: "18",
                Breadth: "3.0",
                SubDivision: "II",
                BilledOn: "",
                Name: "Honda to valpoi road"
            }
        },
        {
            EntityId: 90451,
            WorkflowDataTypeName: "RoadDefect",
            WorkflowStepId: "500",
            GeoElementTypeId: 10000,
            Geom: "{\"type\": \"Point\", \"coordinates\": [74.098247, 15.530565]}",
            Detail: {
                Type: "Pothole",
                VerifiedOn: "2023-08-09T05:12:44",
                Length: "4.1",
                FixedOn: "2023-08-07T14:10:54",
                Division: "XXIII",
                CreatedOn: "2023-08-07T10:59:46",
                ConstituencyId: "18",
                Breadth: "2.7",
                SubDivision: "II",
                BilledOn: "",
                Name: "Honda to valpoi"
            }
        },
        {
            EntityId: 90441,
            WorkflowDataTypeName: "RoadDefect",
            WorkflowStepId: "500",
            GeoElementTypeId: 10000,
            Geom: "{\"type\": \"Point\", \"coordinates\": [74.098756, 15.530176]}",
            Detail: {
                Type: "Pothole",
                VerifiedOn: "2023-08-09T05:13:15",
                Length: "7.1",
                FixedOn: "2023-08-07T14:09:44.",
                Division: "XXIII",
                CreatedOn: "2023-08-07T10:28:15",
                ConstituencyId: "18",
                Breadth: "3.5",
                SubDivision: "II",
                BilledOn: "",
                Name: "Honda to valpoi road"
            }
        },
        {
            EntityId: 89593,
            WorkflowDataTypeName: "RoadDefect",
            WorkflowStepId: "500",
            GeoElementTypeId: 10000,
            Geom: "{\"type\": \"Point\", \"coordinates\": [74.039229, 15.543694]}",
            Detail: {
                Type: "Pothole",
                VerifiedOn: "2023-07-13T08:29:38",
                Length: "2.7",
                FixedOn: "2023-07-13T03:39:00",
                Division: "XXIII",
                CreatedOn: "2023-07-12T11:28:34",
                ConstituencyId: "17",
                Breadth: "3.4",
                SubDivision: "I",
                BilledOn: "",
                Name: "Honda"
            }
        },
        {
            "EntityId": 89581,
            "WorkflowDataTypeName": "RoadDefect",
            "WorkflowStepId": "500",
            "GeoElementTypeId": 10000,
            "Geom": "{\"type\": \"Point\", \"coordinates\": [73.846657, 15.468455]}",
            "Detail": {
                "Type": "Pothole",
                "VerifiedOn": "2023-07-12T14:53:33",
                "Length": "23.3",
                "FixedOn": "2023-07-12T13:21:24",
                "Division": "II",
                "CreatedOn": "2023-07-12T09:17:49",
                "ConstituencyId": "13",
                "Breadth": "2.0",
                "SubDivision": "I",
                "BilledOn": "",
                "Name": "Pot hole"
            }
        },
        {
            "EntityId": 89579,
            "WorkflowDataTypeName": "RoadDefect",
            "WorkflowStepId": "500",
            "GeoElementTypeId": 10000,
            "Geom": "{\"type\": \"Point\", \"coordinates\": [74.044446, 15.547643]}",
            "Detail": {
                "Type": "Pothole",
                "VerifiedOn": "2023-07-19T02:18:46",
                "Length": "2.4",
                "FixedOn": "2023-07-17T14:21:48",
                "Division": "XXIII",
                "CreatedOn": "2023-07-12T09:12:13",
                "ConstituencyId": "17",
                "Breadth": "3.3",
                "SubDivision": "I",
                "BilledOn": "",
                "Name": "Honda"
            }
        },
        {
            "EntityId": 89599,
            "WorkflowDataTypeName": "RoadDefect",
            "WorkflowStepId": "400",
            "GeoElementTypeId": 10000,
            "Geom": "{\"type\": \"Point\", \"coordinates\": [73.911447, 15.558734]}",
            "Detail": {
                "Type": "Pothole",
                "VerifiedOn": "",
                "Length": "7.3",
                "FixedOn": "2023-08-07T13:44:00",
                "Division": "XXIII",
                "CreatedOn": "2023-07-13T04:41:29",
                "ConstituencyId": "16",
                "Breadth": "2.7",
                "SubDivision": "I",
                "BilledOn": "",
                "Name": "Tikazan"
            }
        },
        {
            "EntityId": 89611,
            "WorkflowDataTypeName": "RoadDefect",
            "WorkflowStepId": "500",
            "GeoElementTypeId": 10000,
            "Geom": "{\"type\": \"Point\", \"coordinates\": [73.863037, 15.498481]}",
            "Detail": {
                "Type": "Pothole",
                "VerifiedOn": "2023-07-18T05:58:59",
                "Length": "3.1",
                "FixedOn": "2023-07-17T11:49:40",
                "Division": "II",
                "CreatedOn": "2023-07-13T08:59:48",
                "ConstituencyId": "13",
                "Breadth": "1.4",
                "SubDivision": "I",
                "BilledOn": "",
                "Name": "Chimbel"
            }
        },
        {
            "EntityId": 89638,
            "WorkflowDataTypeName": "RoadDefect",
            "WorkflowStepId": "500",
            "GeoElementTypeId": 10000,
            "Geom": "{\"type\": \"Point\", \"coordinates\": [73.871488, 15.495695]}",
            "Detail": {
                "Type": "Pothole",
                "VerifiedOn": "2023-07-15T06:09:05",
                "Length": "9.6",
                "FixedOn": "2023-07-15T03:21:06",
                "Division": "II",
                "CreatedOn": "2023-07-14T07:10:21",
                "ConstituencyId": "13",
                "Breadth": "3.1",
                "SubDivision": "I",
                "BilledOn": "",
                "Name": "Chimbel"
            }
        },
        {
            "EntityId": 89658,
            "WorkflowDataTypeName": "RoadDefect",
            "WorkflowStepId": "300",
            "GeoElementTypeId": 10000,
            "Geom": "{\"type\": \"Point\", \"coordinates\": [73.817598, 15.589655]}",
            "Detail": {
                "Type": "",
                "VerifiedOn": "",
                "Length": "",
                "FixedOn": "",
                "Division": "XIII",
                "CreatedOn": "2023-07-15T05:08:41",
                "ConstituencyId": "5",
                "Breadth": "",
                "SubDivision": "IV",
                "BilledOn": "",
                "Name": "Mapsa"
            }
        },
        {
            "EntityId": 89659,
            "WorkflowDataTypeName": "RoadDefect",
            "WorkflowStepId": "500",
            "GeoElementTypeId": 10000,
            "Geom": "{\"type\": \"Point\", \"coordinates\": [73.817004, 15.589687]}",
            "Detail": {
                "Type": "Pothole",
                "VerifiedOn": "2023-07-16T15:03:31",
                "Length": "23.4",
                "FixedOn": "2023-07-15T13:01:59",
                "Division": "XIII",
                "CreatedOn": "2023-07-15T05:14:08",
                "ConstituencyId": "5",
                "Breadth": "3.7",
                "SubDivision": "IV",
                "BilledOn": "",
                "Name": "Mapsa"
            }
        },
        {
            "EntityId": 89681,
            "WorkflowDataTypeName": "RoadDefect",
            "WorkflowStepId": "500",
            "GeoElementTypeId": 10000,
            "Geom": "{\"type\": \"Point\", \"coordinates\": [73.891889, 15.455339]}",
            "Detail": {
                "Type": "Pothole",
                "VerifiedOn": "2023-08-03T05:30:12",
                "Length": "7.6",
                "FixedOn": "2023-07-28T11:24:06",
                "Division": "II",
                "CreatedOn": "2023-07-15T10:22:34",
                "ConstituencyId": "14",
                "Breadth": "2.4",
                "SubDivision": "II",
                "BilledOn": "",
                "Name": "Batim road"
            }
        },
        {
            "EntityId": 89682,
            "WorkflowDataTypeName": "RoadDefect",
            "WorkflowStepId": "400",
            "GeoElementTypeId": 10000,
            "Geom": "{\"type\": \"Point\", \"coordinates\": [73.896064, 15.4775]}",
            "Detail": {
                "Type": "Pothole",
                "VerifiedOn": "",
                "Length": "3.0",
                "FixedOn": "2023-08-06T13:59:24",
                "Division": "II",
                "CreatedOn": "2023-07-15T10:36:10",
                "ConstituencyId": "14",
                "Breadth": "4.1",
                "SubDivision": "II",
                "BilledOn": "",
                "Name": "Near transformer moula"
            }
        },
        {
            "EntityId": 89684,
            "WorkflowDataTypeName": "RoadDefect",
            "WorkflowStepId": "400",
            "GeoElementTypeId": 10000,
            "Geom": "{\"type\": \"Point\", \"coordinates\": [73.881722, 15.461275]}",
            "Detail": {
                "Type": "Pothole",
                "VerifiedOn": "",
                "Length": "16.9",
                "FixedOn": "2023-07-28T11:19:32",
                "Division": "II",
                "CreatedOn": "2023-07-15T10:49:33",
                "ConstituencyId": "14",
                "Breadth": "1.5",
                "SubDivision": "II",
                "BilledOn": "",
                "Name": "Near Curca bridge"
            }
        },
        {
            "EntityId": 89685,
            "WorkflowDataTypeName": "RoadDefect",
            "WorkflowStepId": "500",
            "GeoElementTypeId": 10000,
            "Geom": "{\"type\": \"Point\", \"coordinates\": [73.881611, 15.461178]}",
            "Detail": {
                "Type": "Pothole",
                "VerifiedOn": "2023-08-08T07:52:00",
                "Length": "12.7",
                "FixedOn": "2023-07-28T11:16:48",
                "Division": "II",
                "CreatedOn": "2023-07-15T10:50:30",
                "ConstituencyId": "14",
                "Breadth": "2.4",
                "SubDivision": "II",
                "BilledOn": "",
                "Name": "Near Curca"
            }
        },
        {
            "EntityId": 90008,
            "WorkflowDataTypeName": "RoadDefect",
            "WorkflowStepId": "500",
            "GeoElementTypeId": 10000,
            "Geom": "{\"type\": \"Point\", \"coordinates\": [74.098657, 15.529892]}",
            "Detail": {
                "Type": "Pothole",
                "VerifiedOn": "2023-08-09T05:16:44",
                "Length": "3.3",
                "FixedOn": "2023-08-07T14:05:49",
                "Division": "XXIII",
                "CreatedOn": "2023-07-31T07:22:08",
                "ConstituencyId": "18",
                "Breadth": "2.3",
                "SubDivision": "II",
                "BilledOn": "",
                "Name": "Honda to valpoi road"
            }
        },
        {
            "EntityId": 90019,
            "WorkflowDataTypeName": "RoadDefect",
            "WorkflowStepId": "500",
            "GeoElementTypeId": 10000,
            "Geom": "{\"type\": \"Point\", \"coordinates\": [74.038656, 15.476847]}",
            "Detail": {
                "Type": "Pothole",
                "VerifiedOn": "2023-08-03T07:40:34",
                "Length": "5.6",
                "FixedOn": "2023-07-31T15:38:36",
                "Division": "XXIII",
                "CreatedOn": "2023-07-31T11:06:09",
                "ConstituencyId": "17",
                "Breadth": "1.5",
                "SubDivision": "I",
                "BilledOn": "",
                "Name": "Cotambi sanqulim"
            }
        },
        {
            "EntityId": 90062,
            "WorkflowDataTypeName": "RoadDefect",
            "WorkflowStepId": "500",
            "GeoElementTypeId": 10000,
            "Geom": "{\"type\": \"Point\", \"coordinates\": [73.828906, 15.482565]}",
            "Detail": {
                "Type": "Pothole",
                "VerifiedOn": "2023-08-01T06:13:29",
                "Length": "11.3",
                "FixedOn": "2023-08-01T05:48:44",
                "Division": "II",
                "CreatedOn": "2023-07-31T15:05:31",
                "ConstituencyId": "11",
                "Breadth": "3.8",
                "SubDivision": "I",
                "BilledOn": "",
                "Name": "Panjim"
            }
        },
        {
            "EntityId": 90330,
            "WorkflowDataTypeName": "RoadDefect",
            "WorkflowStepId": "300",
            "GeoElementTypeId": 10000,
            "Geom": "{\"type\": \"Point\", \"coordinates\": [73.863356, 15.498408]}",
            "Detail": {
                "Type": "",
                "VerifiedOn": "",
                "Length": "",
                "FixedOn": "",
                "Division": "II",
                "CreatedOn": "2023-08-05T05:50:41",
                "ConstituencyId": "13",
                "Breadth": "",
                "SubDivision": "I",
                "BilledOn": "",
                "Name": "Potholes"
            }
        },
        {
            "EntityId": 90329,
            "WorkflowDataTypeName": "RoadDefect",
            "WorkflowStepId": "300",
            "GeoElementTypeId": 10000,
            "Geom": "{\"type\": \"Point\", \"coordinates\": [73.862856, 15.498573]}",
            "Detail": {
                "Type": "",
                "VerifiedOn": "",
                "Length": "",
                "FixedOn": "",
                "Division": "II",
                "CreatedOn": "2023-08-05T05:49:03",
                "ConstituencyId": "13",
                "Breadth": "",
                "SubDivision": "I",
                "BilledOn": "",
                "Name": "Multiple Potholes on road"
            }
        },
        {
            "EntityId": 90334,
            "WorkflowDataTypeName": "RoadDefect",
            "WorkflowStepId": "300",
            "GeoElementTypeId": 10000,
            "Geom": "{\"type\": \"Point\", \"coordinates\": [73.874707, 15.494006]}",
            "Detail": {
                "Type": "",
                "VerifiedOn": "",
                "Length": "",
                "FixedOn": "",
                "Division": "II",
                "CreatedOn": "2023-08-05T05:59:23",
                "ConstituencyId": "13",
                "Breadth": "",
                "SubDivision": "I",
                "BilledOn": "",
                "Name": "Multiple Potholes on road"
            }
        },
        {
            "EntityId": 90333,
            "WorkflowDataTypeName": "RoadDefect",
            "WorkflowStepId": "300",
            "GeoElementTypeId": 10000,
            "Geom": "{\"type\": \"Point\", \"coordinates\": [73.874693, 15.494598]}",
            "Detail": {
                "Type": "",
                "VerifiedOn": "",
                "Length": "",
                "FixedOn": "",
                "Division": "II",
                "CreatedOn": "2023-08-05T05:57:53",
                "ConstituencyId": "13",
                "Breadth": "",
                "SubDivision": "I",
                "BilledOn": "",
                "Name": "Potholes"
            }
        },
        
        
    ],
    showVerifiedOn: true,
    showFixedOn: true,
    showCreatedOn: true,
    createdOnColor: 'green', 
    verifiedOnColor: 'blue', 
    fixedOnColor: 'orange',
    entityIdInput: '',
    entityIdDetails: '',
  }
},

  computed: {
    // convert the events into a map of lists keyed by date
    eventsMap() {
  const map = {};

  this.jsonDataList.forEach((jsonData) => {
    const createdOn = jsonData.Detail.CreatedOn;
    const verifiedOn = jsonData.Detail.VerifiedOn;
    const fixedOn = jsonData.Detail.FixedOn;

    if (createdOn && this.showCreatedOn) {
      this.addEventToMap(map, jsonData, createdOn, 'createdOnColor');
    }
    if (verifiedOn && this.showVerifiedOn) {
      this.addEventToMap(map, jsonData, verifiedOn, 'verifiedOnColor');
    }
    if (fixedOn && this.showFixedOn) {
      this.addEventToMap(map, jsonData, fixedOn, 'fixedOnColor');
    }
  });

  return map;
},
  },

  methods: {
    searchByEntityId() {
    // Clear previous results
    this.entityIdDetails = '';

    // Find the matching item in the jsonDataList
    const matchingItem = this.jsonDataList.find(
      (item) => item.EntityId.toString() === this.entityIdInput.toString()
    );

    if (matchingItem) {
      const { CreatedOn, FixedOn, VerifiedOn } = matchingItem.Detail;

      if (CreatedOn) {
        this.entityIdDetails += `Created On: ${CreatedOn}\n`;
      }
      if (FixedOn) {
        this.entityIdDetails += `Fixed On: ${FixedOn}\n`;
      }
      if (VerifiedOn) {
        this.entityIdDetails += `Verified On: ${VerifiedOn}\n`;
      }
    } else {
      this.entityIdDetails = 'EntityId not found.';
    }
  },
    addEventToMap(map, jsonData, timestamp, colorKey) {
    const parsedTimestamp = parseTimestamp(timestamp);
    if (parsedTimestamp) {
      const event = {
        id: jsonData.EntityId,
        title: jsonData.EntityId,
        details: jsonData.Detail.Name,
        date: parsedTimestamp.date,
        time: parsedTimestamp.time,
        duration: 25,
        bgcolor: this[colorKey], // Use the color based on the colorKey
        icon: 'fas fa-handshake',
      };

      if (!map[parsedTimestamp.date]) {
        map[parsedTimestamp.date] = [];
      }
      map[parsedTimestamp.date].push(event);
    }
  },
    badgeClasses (event, type) {
      const isHeader = type === 'header'
      return {
        [ `text-white bg-${ event.bgcolor }` ]: true,
        'full-width': !isHeader && (!event.side || event.side === 'full'),
        'left-side': !isHeader && event.side === 'left',
        'right-side': !isHeader && event.side === 'right',
        'rounded-border': true
      }
    },

    badgeStyles (event, type, timeStartPos = undefined, timeDurationHeight = undefined) {
      const s = {}
      if (timeStartPos && timeDurationHeight) {
        s.top = timeStartPos(event.time) + 'px'
        s.height = timeDurationHeight(event.duration) + 'px'
      }
      s[ 'align-items' ] = 'flex-start'
      return s
    },

    getEvents (dt) {
      // get all events for the specified date
      const events = this.eventsMap[ dt ] || []

      if (events.length === 1) {
        events[ 0 ].side = 'full'
      }
      else if (events.length === 2) {
        // this example does no more than 2 events per day
        // check if the two events overlap and if so, select
        // left or right side alignment to prevent overlap
        const startTime = addToDate(parsed(events[ 0 ].date), { minute: parseTime(events[ 0 ].time) })
        const endTime = addToDate(startTime, { minute: events[ 0 ].duration })
        const startTime2 = addToDate(parsed(events[ 1 ].date), { minute: parseTime(events[ 1 ].time) })
        const endTime2 = addToDate(startTime2, { minute: events[ 1 ].duration })
        if (isBetweenDates(startTime2, startTime, endTime, true) || isBetweenDates(endTime2, startTime, endTime, true)) {
          events[ 0 ].side = 'left'
          events[ 1 ].side = 'right'
        }
        else {
          events[ 0 ].side = 'full'
          events[ 1 ].side = 'full'
        }
      }

      return events
    },

    scrollToEvent (event) {
      this.$refs.calendar.scrollToTime(event.time, 350)
    },

    onToday () {
      this.$refs.calendar.moveToToday()
    },
    onPrev () {
      this.$refs.calendar.prev()
    },
    onNext () {
      this.$refs.calendar.next()
    },

    onMoved (data) {
      console.log('onMoved', data)
    },
    onChange (data) {
      console.log('onChange', data)
    },
    onClickDate (data) {
      console.log('onClickDate', data)
    },
    onClickTime (data) {
      console.log('onClickTime', data)
    },
    onClickInterval (data) {
      console.log('onClickInterval', data)
    },
    onClickHeadIntervals (data) {
      console.log('onClickHeadIntervals', data)
    },
    onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    }
  }
})
</script>
<style lang="sass" scoped>
.my-event
  position: absolute
  font-size: 12px
  justify-content: center
  margin: 0 1px
  text-overflow: ellipsis
  overflow: hidden
  cursor: pointer

.title
  position: relative
  display: flex
  justify-content: center
  align-items: center
  height: 100%

.text-white
  color: white

.bg-blue
  background: blue

.bg-green
  background: green

.bg-orange
  background: orange

.bg-red
  background: red

.bg-teal
  background: teal

.bg-grey
  background: grey

.bg-purple
  background: purple

.full-width
  left: 0
  width: calc(100% - 2px)

.left-side
  left: 0
  width: calc(50% - 3px)

.right-side
  left: 50%
  width: calc(50% - 3px)

.rounded-border
  border-radius: 2px
</style>