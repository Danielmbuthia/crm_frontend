<template>
    <v-container>
      <!-- Create Button -->
      <v-btn color="primary" @click="openCreateDialog">Create Note</v-btn>
  
      <!-- Filter Section -->
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="filters.content"
            label="Filter by Content"
            @input="fetchNotes"
          ></v-text-field>
        </v-col>
      </v-row>
  
      <!-- Table of Notes -->
      <v-data-table :items="notes" :headers="headers" item-key="id">
        <template v-slot:item.actions="{ item }">
          <v-icon small @click="editNote(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteNote(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
  
      <!-- Create/Edit Dialog -->
      <v-dialog v-model="editDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ isCreating ? 'Create Note' : 'Edit Note' }}</span>
          </v-card-title>
          <v-card-text>
            <v-textarea v-model="editedNote.content" label="Content" />
  
            <!-- Select Lead -->
            <v-select
              v-model="editedNote.lead"
              :items="leads"
              item-title="name"
              item-value="id"
              label="Select Lead"
              required
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="isCreating ? createNote() : updateNote()">Save</v-btn>
            <v-btn @click="editDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="400px">
        <v-card>
          <v-card-title class="headline">Confirm Deletion</v-card-title>
          <v-card-text>Are you sure you want to delete this note?</v-card-text>
          <v-card-actions>
            <v-btn color="red" @click="deleteNoteConfirm">Delete</v-btn>
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
      const notes = ref([]);
      const leads = ref([]);  // Holds the list of available leads
      const filters = ref({
        content: ''
      });
      const BASE_API_URL = ref(import.meta.env.VITE_BASE_API_URL)
      const headers = [
        { title: 'Content', value: 'content' },
        { title: 'Lead', value: 'lead_detail.name' },
        { title: 'Actions', value: 'actions', sortable: false }
      ];
  
      const editDialog = ref(false);
      const deleteDialog = ref(false);
      const editedNote = ref({});
      const noteToDelete = ref(null);
      const isCreating = ref(false);
  
      // Fetch notes with applied filters
      const fetchNotes = async () => {
        try {
          let queryParams = '';
          if (filters.value.content) {
            queryParams += `content=${filters.value.content}&`;
          }
  
          const response = await axios.get(`${BASE_API_URL.value}/notes/?${queryParams}`);
          notes.value = response.data;
        } catch (error) {
          console.error('Error fetching notes:', error);
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
        editedNote.value = { content: '', lead: null };
        editDialog.value = true;
      };
  
      // Edit note
      const editNote = (note) => {
        isCreating.value = false;
        editedNote.value = { ...note };  // Copy note to avoid direct mutation
        editDialog.value = true;
      };
  
      // Create note
      const createNote = async () => {
        try {
          await axios.post(`${BASE_API_URL.value}/notes/`, editedNote.value);
          fetchNotes();  // Refresh the list after creating
          editDialog.value = false;
        } catch (error) {
          console.error('Error creating note:', error);
        }
      };
  
      // Update note
      const updateNote = async () => {
        try {
          await axios.put(`${BASE_API_URL.value}/notes/${editedNote.value.id}/`, editedNote.value);
          fetchNotes();  // Refresh the list after editing
          editDialog.value = false;
        } catch (error) {
          console.error('Error updating note:', error);
        }
      };
  
      // Delete note
      const deleteNote = (note) => {
        noteToDelete.value = note;
        deleteDialog.value = true;
      };
  
      // Confirm note deletion
      const deleteNoteConfirm = async () => {
        try {
          await axios.delete(`${BASE_API_URL.value}/notes/${noteToDelete.value.id}/`);
          fetchNotes();  // Refresh the list after deleting
          deleteDialog.value = false;
        } catch (error) {
          console.error('Error deleting note:', error);
        }
      };
  
      // Fetch notes and leads when the component mounts
      fetchNotes();
      fetchLeads();
  
      return {
        notes,
        leads,
        filters,
        headers,
        fetchNotes,
        editDialog,
        deleteDialog,
        editedNote,
        noteToDelete,
        isCreating,
        openCreateDialog,
        editNote,
        createNote,
        updateNote,
        deleteNote,
        deleteNoteConfirm,
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
  