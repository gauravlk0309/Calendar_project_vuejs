<template>
  <div class="q-ma-sm">

    <q-table
      :title="'Table Dashboard'"
      :rows="data"
      :columns="columns"
      row-key="name"
      class="gt-sm"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="CommunicationId" :props="props">{{ props.row.CommunicationId }}</q-td>
          <q-td key="Subject" :props="props">{{ props.row.Subject }}</q-td>
          <q-td key="Action"  :props="props"><q-btn color="primary" size="sm" label="View" @click="redirectToViewCommunicationDetail()" /></q-td>
        </q-tr>
      </template>
    </q-table>
    <div class="lt-md" >
      <div v-if="data.length==0" class="flex flex-center">No Results Found!</div>
      <div>
        <q-card class="q-mb-sm" v-for="(task,index) in data" :key="index">
          <q-card-section>
            <div class="text-h6">{{task.Subject}}</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div v-for="(column,index) in columns" :key="index">
              <q-input v-if="column.name!='Action'" readonly v-model="task[column.name]" :label="column.label" />
              <q-btn v-if="column.name=='Action'" color="primary" class="q-mt-sm full-width " text-color="white" label="View" title="View Task" @click="redirectToViewCommunicationDetail()"/>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
  import { date } from "quasar";
  import serviceHandlerMixin from "src/components/serviceHandlerMixin"
  import dashboardData from "./DashboardData.json"
  export default {
    name: 'viewConsumerCommunicationDashboard',
    data () {
      return {
        data:[],
        columns:[{ name: 'CommunicationId', align: 'left', label: 'Id', field: 'CommunicationId' },
        { name: 'Subject', label: 'Subject',align: 'left', field: 'Subject' },
        { name: 'Action', label: 'View',align: 'center', field: 'Action' }],
        fetchedCommunications:[],
      }
    },
    computed: {},
    methods: {
      redirectToHome: function () {
        this.$router.push('/theHub')
      },
      formatDate(unformatedDate){
        let formattedString = date.formatDate(unformatedDate, 'DD MMM YYYY')
        return formattedString
      },
      redirectToViewCommunicationDetail(){

      },
      fetchCommunications() {
        this.data = []
        var responseData = dashboardData;
        if (responseData.Status === "OK"){
          this.fetchedCommunications = responseData.ResponseJson.Communications
          var self = this
          this.fetchedCommunications.forEach(function(communication){
            var obj = {}
            obj["CommunicationId"]=communication.CommunicationId
            obj["Subject"]=self.truncateString(communication.Detail.Subject)
            obj["Action"]=""
            self.data.push(obj)
          })
        }
      },
      truncateString(string){
        if(string!==undefined && string!==null){
        if(string.length<30){
          return string
        }
        else{
          return string.substring(0,30) + '...'
        }
        }
        else{
          return ""
        }
      },
    },
    mounted() {
      this.$q.loading.hide();
      this.fetchCommunications();
    },
    mixins: [serviceHandlerMixin]
  }
</script>
<style type="text/css">
  .selectStyle{
    min-width: 150px;
  }
  tr:nth-child(even) {
    background-color: #3498db10 !important;
  }
</style>
