import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";

window.onload = async () => {
  console.log('i am on github')
  const el = document.querySelector('body');
  if (el) {
    el.insertAdjacentHTML(
      'afterend',
      '<div id="app">hello</div>',
    );
    const app = createApp(App).use(createPinia());
    app.mount('#app');
  }
}
