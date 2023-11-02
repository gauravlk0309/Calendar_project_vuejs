<template>
  <q-page class="flex flex-center">
    <!--<p>Hello there, {{ userStore.users[id].fullName }}!</p>-->
      <MonthView style="min-width: 800px; min-height: 400px; width: 80vw; height: 100vh;" :entities="entityStore" userType='user'/>
  </q-page>
</template>
<script>
import dashData from 'src/nucleus/dashData.json'
import MonthView from 'components/MonthView.vue'

export default {
  components: {
    MonthView
  },

  setup () {
    var entityStore = dashData


    return {
      entityStore,

    }
  }
}
</script>
<style type="text/css">

</style>
