<template>
  <v-container>
    <h1 class="text-center">Welcome to Mini CRM</h1>
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-card>
          <v-card-title class="text-h6">Leads</v-card-title>
          <v-card-text>
            Manage your leads effectively and track their progress.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" to="/leads">View Leads</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card>
          <v-card-title class="text-h6">Contacts</v-card-title>
          <v-card-text>
            Keep all your contacts organized in one place.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" to="/contacts">View Contacts</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card>
          <v-card-title class="text-h6">Reminders</v-card-title>
          <v-card-text>
            Set reminders for important follow-ups.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" to="/reminders">View Reminders</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
     
      <v-col cols="12" sm="6" md="4">
        <v-card>
          <v-card-title class="text-h6">Notes</v-card-title>
          <v-card-text>
            Keep your important notes organized and accessible.
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" to="/notes">View Notes</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.text-center {
  text-align: center;
  margin-bottom: 20px;
}
</style>