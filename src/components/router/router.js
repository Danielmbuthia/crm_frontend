import { createRouter, createWebHistory } from "vue-router";
import Contact from "../views/Contact.vue";
import { default as HelloWorld } from "../views/HelloWorld.vue";
import Home from "../views/Home.vue";
import Notes from "../views/notes.vue";
import Reminders from "../views/reminders.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/leads",
    name: "Leads",
    component: HelloWorld,
  },
  {
    path: "/contacts",
    name: "Contacts",
    component: Contact,
  },
  {
    path: "/notes",
    name: "Notes",
    component: Notes,
  },
  {
    path: "/reminders",
    name: "Reminders",
    component: Reminders,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
