<template>
  <v-container>
    <!-- Create Button -->
    <v-btn color="primary" @click="openCreateDialog">Create Reminder</v-btn>

    <!-- Filter Section -->
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="filters.message"
          label="Filter by Content"
          @input="fetchReminders"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="filters.reminder_time"
          label="Filter by Date"
          @input="fetchReminders"
          type="datetime-local"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Table of Reminders -->
    <v-data-table :items="formattedReminders" :headers="headers" item-key="id">
      <template v-slot:item.actions="{ item }">
        <v-icon small @click="editReminder(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteReminder(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ isCreating ? 'Create Reminder' : 'Edit Reminder' }}</span>
        </v-card-title>
        <v-card-text>
          <v-textarea v-model="editedReminder.message" label="Content" />

          <!-- Select Lead -->
          <v-select
            v-model="editedReminder.lead"
            :items="leads"
            item-title="name"
            item-value="id"
            label="Select Lead"
            required
          ></v-select>

          <!-- Reminder Date -->
          <v-text-field
            v-model="editedReminder.reminder_time"
            label="Reminder Date"
            type="datetime-local"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="isCreating ? createReminder() : updateReminder()">Save</v-btn>
          <v-btn @click="editDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete this reminder?</v-card-text>
        <v-card-actions>
          <v-btn color="red" @click="deleteReminderConfirm">Delete</v-btn>
          <v-btn @click="deleteDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
import { ref, computed } from 'vue';

export default {
  setup() {
    const reminders = ref([]);
    const leads = ref([]); 
    const filters = ref({
      message: '',
      reminder_time: ''
    });
    const BASE_API_URL = ref(import.meta.env.VITE_BASE_API_URL)
    const headers = [
      { title: 'Content', value: 'message' },
      { title: 'Date', value: 'reminder_time' },
      { title: 'Lead', value: 'lead_detail.name' },
      { title: 'Actions', value: 'actions', sortable: false }
    ];

    const editDialog = ref(false);
    const deleteDialog = ref(false);
    const editedReminder = ref({});
    const reminderToDelete = ref(null);
    const isCreating = ref(false);

    // Fetch reminders with applied filters
    const fetchReminders = async () => {
      try {
        let queryParams = '';
        if (filters.value.message) {
          queryParams += `message=${filters.value.message}&`;
        }
        if (filters.value.reminder_time) {
          // queryParams += `reminder_time=${filters.value.reminder_time}&`;
          queryParams += `reminder_time__gt=${filters.value.reminder_time}&`;
        }

        const response = await axios.get(`${BASE_API_URL.value}/reminders/?${queryParams}`);
        reminders.value = response.data;
      } catch (error) {
        console.error('Error fetching reminders:', error);
      }
    };

    // Fetch leads to populate the select dropdown
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL.value}/leads/`);
        leads.value = response.data;
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    // Open Create dialog
    const openCreateDialog = () => {
      isCreating.value = true;
      editedReminder.value = { message: '', lead: null, reminder_time: '' };
      editDialog.value = true;
    };

    // Edit reminder
    const editReminder = (reminder) => {
      isCreating.value = false;
      editedReminder.value = { ...reminder }; 
      editDialog.value = true;
    };

    // Create reminder
    const createReminder = async () => {
     
      try {
        await axios.post(`${BASE_API_URL.value}/reminders/`, editedReminder.value);
        fetchReminders();  // Refresh the list after creating
        editDialog.value = false;
      } catch (error) {
        console.error('Error creating reminder:', error);
      }
    };

    // Update reminder
    const updateReminder = async () => {
      try {
        await axios.put(`${BASE_API_URL.value}/reminders/${editedReminder.value.id}/`, editedReminder.value);
        fetchReminders();  // Refresh the list after editing
        editDialog.value = false;
      } catch (error) {
        console.error('Error updating reminder:', error);
      }
    };

    // Delete reminder
    const deleteReminder = (reminder) => {
      reminderToDelete.value = reminder;
      deleteDialog.value = true;
    };

    // Confirm reminder deletion
    const deleteReminderConfirm = async () => {
      try {
        await axios.delete(`${BASE_API_URL.value}/reminders/${reminderToDelete.value.id}/`);
        fetchReminders();  // Refresh the list after deleting
        deleteDialog.value = false;
      } catch (error) {
        console.error('Error deleting reminder:', error);
      }
    };


    const formattedReminders = computed(() => {
      return reminders.value.map(reminder => {
        return {
          ...reminder,
          reminder_time: new Date(reminder.reminder_time).toLocaleString() 
        };
      });
    });


    // Fetch reminders and leads when the component mounts
    fetchReminders();
    fetchLeads();

    return {
      reminders,
      leads,
      filters,
      headers,
      fetchReminders,
      editDialog,
      deleteDialog,
      editedReminder,
      reminderToDelete,
      isCreating,
      openCreateDialog,
      editReminder,
      createReminder,
      updateReminder,
      deleteReminder,
      deleteReminderConfirm,
      formattedReminders
    };
  }
};
</script>

<style scoped>
.v-icon {
  cursor: pointer;
  margin-left: 10px;
}
</style>
