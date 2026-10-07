import { createRouter, createWebHistory } from "vue-router";
import TestPage from "@/views/TestPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/views/HomePage.vue"),
    },
    {
      path: "/login",
      component: () => import("@/views/LoginPage.vue"),
    },
    {
      path: "/campaign",
      component: () => import("@/views/CampaignPage.vue"),
    },
    {
      path: "/parties",
      component: () => import("@/views/PartyPage.vue"),
    },
    {
      path: "/rules",
      component: () => import("@/views/RulesPage.vue"),
    },
    {
      path: "/test",
      component: TestPage,
    },
  ],
});

export default router;
