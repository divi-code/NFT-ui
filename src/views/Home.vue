<template>
  <v-container>
    <!-- ROW 1: header -->
    <v-row>
      <v-col cols="12">
        <h1 class="display-3 font-weight-thin">Token Dashboard</h1>
      </v-col>
    </v-row>

    <!-- ROW 1.5: narrative -->
    <v-row>
      <v-col>
        <p class="subtitle-1 narrative">Narrative: {{ narrative }}</p>
      </v-col>
    </v-row>

    <!--  ROW 2: token generator -->
    <v-row>
      <v-col></v-col>
      <v-col cols="9" align-self="center">
        <v-card>
          <FlipCard>
            <template v-slot:front>
              <v-card-title class="display-1 font-weight-thin"
                >Generator</v-card-title
              >
              <v-text-field
                label="Service"
                v-model="generateService"
              ></v-text-field>

              <v-slider
                max="50"
                v-model="generateAmount"
                label="Amount"
                thumb-label
              ></v-slider>
            </template>
            <template v-slot:back>
              <img
                src="../assets/moneyprintergobrrr.jpg"
                alt="Money go brrr"
                width="800"
                height="200"
              />
            </template>
          </FlipCard>
          <v-card-actions class="justify-center">
            <v-btn
              :disabled="generateService === '' || generateAmount == 0"
              @click="generateTokens"
            >
              {{ btnLabel }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col></v-col>
    </v-row>

    <!-- ROW 3: issued tokens and patient wallet -->
    <v-row v-if="tokens.length > 0 || issuedTokens.length > 0 || flipped">
      <v-col cols="6">
        <v-card>
          <v-card-title class="display-1 font-weight-thin"
            >Unissued tokens</v-card-title
          >
          <v-card-actions>
            <v-menu v-if="typesOfTokens.size > 1" offset-y>
              <template v-slot:activator="{ on }">
                <v-btn width="50%" v-on="on">
                  Filter
                </v-btn>
              </template>

              <v-list>
                <v-list-item
                  v-for="type in typesOfTokens"
                  :key="type"
                  @click="filter(type)"
                >
                  <v-list-item-title>{{ type }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-btn width="50%" v-if="filtered" @click="clearFilter"
              >Clear</v-btn
            >
          </v-card-actions>
          <div class="scroll">
            <Token
              v-for="token in visibleTokens"
              :key="token.id"
              :token="token"
            />
          </div>
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
            <v-card-title class="display-1 font-weight-thin"
              >Patient Wallet</v-card-title
            >
            <div class="scroll">
              <Token
                v-for="token in issuedTokens"
                :key="token.id"
                :token="token"
              />
            </div>
            <div class="dropbox" v-if="tokens.length > 0 && issuedTokens == 0">
              Drag a token over here
            </div>
          </v-card>
        </drop>
      </v-col>
    </v-row>

    <!-- ROW 4:  Provider -->
    <v-row v-if="issuedTokens.length > 0">
      <v-col cols="12">
        <v-card
          ><v-card-title class="display-1 font-weight-thin"
            >Provider</v-card-title
          >
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
    <v-row v-if="receipts.length > 0">
      <v-col cols="12">
        <v-card>
          <v-card-title class="display-1 font-weight-thin"
            >Receipts</v-card-title
          >
          <v-card
            outlined
            class="receipt"
            v-for="receipt in receipts"
            :key="receipt.id"
          >
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
import FlipCard from '../components/FlipCard.vue'

export default {
  components: {
    Token,
    FlipCard,
  },
  data() {
    //prettier-ignore
    return {
      narrative: 'Start by generating some tokens',
      walletover: false,            // Highlight wallet when activated for drop
      providerover: false,          // Highlight the provider card when activated for drop
      generateService: '',          // Text input for what type of token should be generated
      generateAmount: '',           // Text input for the amount of token that should be generated
      tokens: [],                   // Tokens that have been generated and are held by the bank
      issuedTokens: [],             // Tokens that have been issued and are held by patients
      receipts: [],                 // Record of tokens that have been redeemed
      btnLabel: 'Generate Tokens',  // Button label changes to "BRRR" when coins are being generated
      filtered: false,              // 'Clear' button appears when the list is filtered
      filterBy: '',                 // Type of token to filter by
    }
  },
  computed: {
    flipped() {
      return this.$store.state.flipped
    },
    typesOfTokens() {
      return new Set(this.tokens.map((tok) => tok.service))
    },
    visibleTokens() {
      if (this.filtered) {
        return this.tokens.filter((tok) => tok.service === this.filterBy)
      } else {
        return this.tokens
      }
    },
  },
  methods: {
    clearFilter() {
      console.log('Clear filter')
      this.filtered = false
      this.filteredTokens = this.tokens
    },
    filter(type) {
      console.log('Filter:', type)
      this.filtered = true
      this.filterBy = type
    },
    async generateTokens() {
      this.$store.dispatch('flip')
      this.btnLabel = 'BRRRRR'
      setTimeout(() => {
        for (var i = 0; i < this.generateAmount; i++) {
          this.generateToken()
        }
        this.narrative = `${this.generateAmount} tokens for ${this.generateService} have been generated`
        this.generateAmount = ''
        this.generateService = ''
        this.btnLabel = 'Generate Tokens'
        this.$store.dispatch('flip')
      }, 800)
    },
    generateToken() {
      this.tokens.push({
        id: uuidv4(),
        service: this.generateService,
        owner: 'bank',
      })
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
.narrative {
  margin-left: 30px;
}
.receipt {
  background-color: #e9eff7;
}
.dropbox {
  text-align: center;
  margin: 15px;
  padding: 80px;
  height: 200px;
  border: 2px dotted grey;
  background-color: #e9eff7;
}
.scroll {
  overflow-y: scroll;
  max-height: 400px;
}
.v-card {
  padding: 5px;
  margin: 5px;
}
.provider-drop {
  border: 1px dotted blue;
  padding: 25px;
  margin: 20px;
  margin-top: 10px;
  background-color: #e9eff7;
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
