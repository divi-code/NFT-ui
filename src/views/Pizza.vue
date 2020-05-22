<template>
  <div>
    <span v-show="0">
      {{ info }}
    </span>
    <img
      src="../assets/pizza.png"
      alt="bitcoin pizza"
      width="25%"
      height="25%"
    />
    <div>
      <p>
        On May 22, 2010, Laszlo Hanyecz bought 2 pizzas for 10,000 BTC.
      </p>
      <p>Today, that is equivalent to ${{ prettyPizza }} USD.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Pizza',
  data() {
    return {
      info: {
        data: {
          USD: 0,
        },
      },
    }
  },
  created() {
    axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then((response) => (this.info = response))
  },
  methods: {
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
  },
  computed: {
    price() {
      return this.info.data.bpi.USD.rate
    },
    pizzaPrice() {
      let p = parseFloat(this.price.replace(/,/g, '')).toFixed(2)
      return (p * 10000).toFixed(2)
    },
    prettyPizza() {
      return this.numberWithCommas(this.pizzaPrice)
    },
  },
}
</script>

<style lang="scss" scoped>
div {
  margin: 30px;
  text-align: center;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
    'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-size: 30px;
}
</style>
