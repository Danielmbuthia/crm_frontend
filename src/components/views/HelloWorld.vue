<template>
  <v-container>
    <!-- Create Button -->
    <v-btn color="primary" @click="openCreateDialog">Create Lead</v-btn>

    <!-- Filter Section -->
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="filters.name"
          label="Filter by Name"
          @input="fetchLeads"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="filters.email"
          label="Filter by Email"
          @input="fetchLeads"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Table of Leads -->
    <v-data-table :items="leads" :headers="headers" item-key="id">
      <template v-slot:item.actions="{ item }">
        <v-icon small @click="editLead(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteLead(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ isCreating ? 'Create Lead' : 'Edit Lead' }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="editedLead.name" label="Name" required />
          <v-text-field v-model="editedLead.email" label="Email" />
          <v-text-field v-model="editedLead.phone" label="Phone" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="isCreating ? createLead() : updateLead()">Save</v-btn>
          <v-btn @click="editDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete this lead?</v-card-text>
        <v-card-actions>
          <v-btn color="red" @click="deleteLeadConfirm">Delete</v-btn>
          <v-btn @click="deleteDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';

export default {
  setup() {
    const leads = ref([]);
    const filters = ref({
      name: '',
      email: ''
    });
    const headers = [
      { title: 'Name', value: 'name' },
      { title: 'Email', value: 'email' },
      { title: 'Phone', value: 'phone' },
      { title: 'Actions', value: 'actions', sortable: false }
    ];

    const editDialog = ref(false);
    const deleteDialog = ref(false);
    const editedLead = ref({});
    const leadToDelete = ref(null);
    const isCreating = ref(false);

    // Fetch leads with applied filters
    const fetchLeads = async () => {
      try {
        let queryParams = '';
        if (filters.value.name) {
          queryParams += `name=${filters.value.name}&`;
        }
        if (filters.value.email) {
          queryParams += `email=${filters.value.email}&`;
        }

        const response = await axios.get(`http://localhost:8000/api/leads/?${queryParams}`);
        leads.value = response.data;
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    // Open Create dialog
    const openCreateDialog = () => {
      isCreating.value = true;
      editedLead.value = { name: '', email: '', phone: '' };
      editDialog.value = true;
    };

    // Edit lead
    const editLead = (lead) => {
      isCreating.value = false;
      editedLead.value = { ...lead };  
      editDialog.value = true;
    };

    // Create lead
    const createLead = async () => {
      try {
        await axios.post('http://localhost:8000/api/leads/', editedLead.value);
        fetchLeads();  // Refresh the list after creating
        editDialog.value = false;
      } catch (error) {
        console.error('Error creating lead:', error);
      }
    };

    // Update lead
    const updateLead = async () => {
      try {
        await axios.put(`http://localhost:8000/api/leads/${editedLead.value.id}/`, editedLead.value);
        fetchLeads();  // Refresh the list after editing
        editDialog.value = false;
      } catch (error) {
        console.error('Error updating lead:', error);
      }
    };

    // Delete lead
    const deleteLead = (lead) => {
      leadToDelete.value = lead;
      deleteDialog.value = true;
    };

    // Confirm lead deletion
    const deleteLeadConfirm = async () => {
      try {
        await axios.delete(`http://localhost:8000/api/leads/${leadToDelete.value.id}/`);
        fetchLeads();  // Refresh the list after deleting
        deleteDialog.value = false;
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    };

    // Fetch leads when the component mounts
    fetchLeads();

    return {
      leads,
      filters,
      headers,
      fetchLeads,
      editDialog,
      deleteDialog,
      editedLead,
      leadToDelete,
      isCreating,
      openCreateDialog,
      editLead,
      createLead,
      updateLead,
      deleteLead,
      deleteLeadConfirm,
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
