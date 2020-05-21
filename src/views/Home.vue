<template>
  <v-container>
    <!-- ROW 1: header -->
    <v-row>
      <v-col cols="12">
        <h1>Token Dashboard</h1>
        <p>
          Generate tokens by typing a service name and the amount of tokens that
          you want to generate. Then, drag a token over to the wallet. From
          there, you can drag the token over to the provider box to render
          services and generate a receipt.
        </p>
        <h3>{{ narrative }}</h3>
      </v-col>
    </v-row>

    <!--  ROW 2: token generator -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Token Generator</v-card-title>
          <v-text-field
            label="Service"
            v-model="generateService"
          ></v-text-field>
          <v-text-field label="Amount" v-model="generateAmount"></v-text-field>
          <v-btn @click="generateTokens"> Generate Tokens </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- ROW 3: issued tokens and patient wallet -->
    <v-row>
      <v-col cols="6">
        <v-card>
          <v-card-title>Unissued tokens</v-card-title>
          <Token v-for="token in tokens" :key="token.id" :token="token" />
        </v-card>
      </v-col>

      <v-col cols="6">
        <drop
          class="wallet-drop"
          :class="{ walletover }"
          @dragover="walletover = true"
          @dragleave="walletover = false"
          @drop="handleWalletDrop"
        >
          <v-card>
            <v-card-title>Patient Wallet</v-card-title>
            <Token
              v-for="token in issuedTokens"
              :key="token.id"
              :token="token"
            />
          </v-card>
        </drop>
      </v-col>
    </v-row>

    <!-- ROW 4:  Provider -->
    <v-row>
      <v-col cols="12">
        <v-card
          ><v-card-title>Provider</v-card-title>
          <drop
            class="provider-drop"
            :class="{ providerover }"
            @dragover="providerover = true"
            @dragleave="providerover = false"
            @drop="handleProviderDrop"
          >
            Drag and drop token here to redeem and generate a receipt.
          </drop></v-card
        >
      </v-col>
    </v-row>

    <!-- ROW 5: Receipts -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Receipts</v-card-title>
          <v-card v-for="receipt in receipts" :key="receipt.id">
            <v-card-title>
              {{ receipt.service }}
            </v-card-title>
            <v-card-subtitle>
              {{ receipt.id }}
            </v-card-subtitle>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import Token from '../components/Token.vue'

export default {
  components: {
    Token,
  },
  data() {
    return {
      narrative: 'Start by generating some tokens',
      walletover: false,
      providerover: false,
      generateService: '',
      generateAmount: '',
      tokens: [],
      issuedTokens: [],
      receipts: [],
    }
  },
  methods: {
    generateTokens() {
      this.narrative = `${this.generateAmount} tokens for ${this.generateService} have been generated`
      for (var i = 0; i < this.generateAmount; i++) {
        this.tokens.push({
          id: uuidv4(),
          service: this.generateService,
          owner: 'bank',
        })
      }
      this.generateAmount = ''
      this.generateService = ''
    },
    handleWalletDrop(data) {
      this.walletover = false
      this.narrative = `${data.owner} transferred a token for ${data.service} to Alice.  Next, redeem it at the doctor.`
      console.log('Adding to wallet: ', data)
      this.tokens = this.tokens.filter((tok) => tok.id !== data.id)
      if (this.issuedTokens.includes(data)) {
        console.log('Dont add a duplicate')
        return
      }
      let token = data
      token.owner = 'Alice'
      this.issuedTokens.push(data)
    },
    handleProviderDrop(data) {
      this.providerover = false
      if (data.owner === 'bank') {
        this.narrative = `${data.owner} cannot redeem a token at the doctor.  Issue it to a patient first.`
        return
      }
      this.narrative = `${data.owner} redeemed a token for ${data.service} at the doctor`
      this.issuedTokens = this.issuedTokens.filter((tok) => tok.id !== data.id)
      if (this.receipts.includes(data)) {
        console.log('Dont add a duplicate')
        return
      }
      let token = data
      token.owner = 'Provider'
      this.receipts.push(data)
      console.log('Dropped!', data)
    },
  },
}
</script>

<style lang="scss" scoped>
.v-card {
  padding: 10px;
  margin: 5px;
}
.provider-drop {
  border: 1px dotted blue;
  padding: 25px;
}
.wallet-drop {
  padding: 5px;
}
.wallet-drop.walletover {
  background: lightblue;
}
.provider-drop.providerover {
  background: lightblue;
}
</style>
