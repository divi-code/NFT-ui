import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      dark: {
        primary: '#1976D2',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
        black: '#000',
      },
      light: {
        primary: '#0E0F58',
        secondary: '#e9eff7',
        accent: '#4DC6FF',
        error: '#F42A4C',
        success: '#1aa333',
        info: '#2196F3',
        warning: '#FFC107',
      },
    },
  },
})
