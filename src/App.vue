<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        Non-fungible Tokens
      </div>

      <v-spacer></v-spacer>

      <v-spacer></v-spacer>
      <v-btn
        v-for="link in links"
        :key="link.label"
        color="white"
        text
        x-small
        class="my-2 mx-1 custom-btn"
        :to="link.url"
      >
        {{ link.label }}
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    links: [
      {
        label: 'Home',
        url: '/',
      },
      {
        label: 'About',
        url: '/about',
      },
    ],
  }),
}
</script>
