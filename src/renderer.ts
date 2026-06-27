import { createApp } from 'vue';
import { createPinia } from 'pinia'
import {createRouter , createMemoryHistory} from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Conversation from './views/Conversation.vue';
import Settings from './views/Settings.vue';
import {useConversationStore} from './stores/conversation'
import i18n from './i18n'

import './index.css'
import 'highlight.js/styles/github-dark.min.css'

const routes = [
  {path : '/' , component: Home},
  {path : '/conversation/:id' , component: Conversation},
  {path : '/settings' , component: Settings},

]

const router = createRouter({
  history:createMemoryHistory(),
  routes
})
router.beforeEach((to) => {
  const store = useConversationStore()
  console.log('path',to.path)
  if (!to.path.startsWith('/conversation/')){
    store.selectedId = -1
  }
})

const pinia = createPinia()
console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite',
);

createApp(App).use(router).use(pinia).use(i18n).mount('#app')