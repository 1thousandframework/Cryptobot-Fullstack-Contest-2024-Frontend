import { createRouter, createWebHistory } from 'vue-router'
import StoreView from "@/views/StoreView.vue";
import GiftsView from "@/views/GiftsView.vue";
import GiftView from "@/views/GiftView.vue";
import ProfileView from "@/views/ProfileView.vue";
import CongratsView from "@/views/CongratsView.vue";
import RecentActions from "@/views/RecentActions.vue";
import LeadersView from '@/views/Leaders.view.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'store',
      component: StoreView
    },
    {
      path: '/gifts',
      name: 'gifts',
      component: GiftsView
    },
    {
      path: '/gift/:id',
      component: GiftView
    },
    {
      path: '/leaderboard',
      component: LeadersView
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/history',
      name: 'history',
      component: RecentActions
    },
    {
      path: '/congrats',
      component: CongratsView,
      props: true,
      name: 'congrats'
    }
  ],
})

export default router
