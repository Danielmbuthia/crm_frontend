<template>
  <v-container>
    <!-- Create Button -->
    <v-btn color="primary" @click="openCreateDialog">Create Contact</v-btn>

    <!-- Filter Section -->
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="filters.name"
          label="Filter by Name"
          @input="fetchContacts"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="filters.email"
          label="Filter by Email"
          @input="fetchContacts"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="filters.phone"
          label="Filter by Phone"
          @input="fetchContacts"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Table of Contacts -->
    <v-data-table :items="contacts" :headers="headers" item-key="id">
      <template v-slot:item.actions="{ item }">
        <v-icon small @click="editContact(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteContact(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ isCreating ? 'Create Contact' : 'Edit Contact' }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="editedContact.name" label="Name" />
          <v-text-field v-model="editedContact.email" label="Email" />
          <v-text-field v-model="editedContact.phone" label="Phone" />

          <!-- Select Lead -->
          <v-select
            v-model="editedContact.lead"
            :items="leads"
            item-title="name"
            item-value="id"
            label="Select Lead"
            required
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="isCreating ? createContact() : updateContact()">Save</v-btn>
          <v-btn @click="editDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline">Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete this contact?</v-card-text>
        <v-card-actions>
          <v-btn color="red" @click="deleteContactConfirm">Delete</v-btn>
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
    const contacts = ref([]);
    const leads = ref([]);  
    const filters = ref({
      name: '',
      email: '',
      phone: ''
    });
    const headers = [
      { title: 'Name', value: 'name'},
      { title: 'Email', value: 'email' },
      { title: 'Phone', value: 'phone' },
      { title: 'Lead', value: 'lead_detail.name' }, 
      { title: 'Actions', value: 'actions', sortable: false }
    ];

    const editDialog = ref(false);
    const deleteDialog = ref(false);
    const editedContact = ref({});
    const contactToDelete = ref(null);
    const isCreating = ref(false);

    // Fetch contacts with applied filters
    const fetchContacts = async () => {
      try {
        let queryParams = '';
        if (filters.value.name) {
          queryParams += `name=${filters.value.name}&`;
        }
        if (filters.value.email) {
          queryParams += `email=${filters.value.email}&`;
        }
        if (filters.value.phone) {
          queryParams += `phone=${filters.value.phone}&`;
        }

        const response = await axios.get(`http://localhost:8000/api/contacts/?${queryParams}`);
        contacts.value = response.data;
        console.log(contacts.value);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    // Fetch leads to populate the select dropdown
    const fetchLeads = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/leads/');
        leads.value = response.data;
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    // Open Create dialog
    const openCreateDialog = () => {
      isCreating.value = true;
      editedContact.value = { name: '', email: '', phone: '', lead: null };
      editDialog.value = true;
    };

    // Edit contact
    const editContact = (contact) => {
      isCreating.value = false;
      editedContact.value = { ...contact };  // Copy contact to avoid direct mutation
      editDialog.value = true;
    };

    // Create contact
    const createContact = async () => {
      try {
        await axios.post('http://localhost:8000/api/contacts/', editedContact.value);
        fetchContacts();  // Refresh the list after creating
        editDialog.value = false;
      } catch (error) {
        console.error('Error creating contact:', error);
      }
    };

    // Update contact
    const updateContact = async () => {
      try {
        await axios.put(`http://localhost:8000/api/contacts/${editedContact.value.id}/`, editedContact.value);
        fetchContacts();  // Refresh the list after editing
        editDialog.value = false;
      } catch (error) {
        console.error('Error updating contact:', error);
      }
    };

    // Delete contact
    const deleteContact = (contact) => {
      contactToDelete.value = contact;
      deleteDialog.value = true;
    };

    // Confirm contact deletion
    const deleteContactConfirm = async () => {
      try {
        await axios.delete(`http://localhost:8000/api/contacts/${contactToDelete.value.id}/`);
        fetchContacts();  // Refresh the list after deleting
        deleteDialog.value = false;
      } catch (error) {
        console.error('Error deleting contact:', error);
      }
    };

    // Fetch contacts and leads when the component mounts
    fetchContacts();
    fetchLeads();

    return {
      contacts,
      leads,
      filters,
      headers,
      fetchContacts,
      editDialog,
      deleteDialog,
      editedContact,
      contactToDelete,
      isCreating,
      openCreateDialog,
      editContact,
      createContact,
      updateContact,
      deleteContact,
      deleteContactConfirm,
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