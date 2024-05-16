<template>
  <div>
    <h1>404 - Not Found</h1>
    <p>Sorry, the page you are looking for could not be found.</p>
    <router-link to="/">Go to Home Page</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NotFoundPage',
});
</script>
