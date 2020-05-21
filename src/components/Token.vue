<template>
  <div>
    <drag
      class="drag"
      :image-y-offset="80"
      :image-x-offset="35"
      :transfer-data="token"
      draggable
      ><div slot="image" class="drag-image">
        <h2 class="token-text">{{ token.service }}</h2>
        <img src="../assets/blank_token.png" alt="" />
      </div>

      <v-card width="100%">
        <v-card-title>{{ token.service }}</v-card-title>
        <v-card-subtitle>{{ token.id }}</v-card-subtitle>
        <v-card-subtitle>Owner: {{ token.owner }}</v-card-subtitle>
      </v-card></drag
    >
  </div>
</template>

<script>
export default {
  name: 'Token',
  props: {
    token: Object,
  },
}
</script>

<style lang="scss" scoped>
.v-card {
  padding: 10px;
  margin: 5px;
}
.drag-image {
  color: #000;
  width: 100px;
  word-wrap: break-word;
}
/* Centered token text */
.token-text {
  font-size: 15px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande',
    'Lucida Sans', Arial, sans-serif;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
