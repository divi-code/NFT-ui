<template>
  <v-container>
    <div class="body">
      <h1 class="display-3 font-weight-thin">About</h1>
      <p>
        The purpose of this app is to explore the functionality and design of
        nonfungible tokens.
      </p>
      <p>The general workflow is as follows:</p>

      <div>
        <ul>
          <li>The bank generates tokens for a given service</li>
          <li>The bank issues tokens to a patient</li>
          <li>The patient brings a token to the provider to redeem it</li>
          <li>A receipt is generated</li>
        </ul>
      </div>
      <p>
        The issued tokens can be filtered by type of token.
      </p>
    </div>
  </v-container>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.body {
  background-color: white;
  margin: 15px;
  height: 700px;
  padding: 40px;
  border: 1px solid lightgrey;
}
div {
  font-family: Verdana, Tahoma, sans-serif;
}
p {
  margin: 20px;
}
li {
  margin-left: 80px;
}
</style>
