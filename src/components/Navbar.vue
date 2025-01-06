<template>
    <v-app-bar app>
      <v-toolbar-title>Mini CRM</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleDrawer" class="d-md-none">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-btn to="/" text class="d-none d-md-inline"> <v-icon left>mdi-home</v-icon> Home</v-btn>
      <v-btn to="/leads" text class="d-none d-md-inline"> <v-icon left>mdi-account-multiple</v-icon> Leads</v-btn>
      <v-btn to="/contacts" text class="d-none d-md-inline"> <v-icon left>mdi-contacts</v-icon> Contacts</v-btn>
      <v-btn to="/notes" text class="d-none d-md-inline"> <v-icon left>mdi-note</v-icon> Notes</v-btn>
      <v-btn to="/reminders" text class="d-none d-md-inline"> <v-icon left>mdi-alarm</v-icon> Reminders</v-btn>
    </v-app-bar>
  
    <v-navigation-drawer v-model="drawer" app>
      <v-list class="white">
        <v-list-item to="/" nav>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon> 
          </v-list-item-icon>
          Home
        </v-list-item>
        <v-list-item to="/leads" nav>
          <v-list-item-icon>
            <v-icon>mdi-account-multiple</v-icon> 
          </v-list-item-icon>
          Leads
        </v-list-item>
        <v-list-item to="/contacts" nav>
          <v-list-item-icon>
            <v-icon>mdi-contacts</v-icon> 
          </v-list-item-icon>
          Contacts
        </v-list-item>
        <v-list-item to="/notes" nav>
          <v-list-item-icon>
            <v-icon>mdi-note</v-icon> 
          </v-list-item-icon>
          Notes
        </v-list-item>
        <v-list-item to="/reminders" nav>
          <v-list-item-icon>
            <v-icon>mdi-alarm</v-icon> 
          </v-list-item-icon>
          Reminders
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'Navbar',
    setup() {
      const drawer = ref(false);
  
      const toggleDrawer = () => {
        drawer.value = !drawer.value;
      };
  
      return {
        drawer,
        toggleDrawer,
      };
    },
  };
  </script>
  
  <style scoped>
  </style>