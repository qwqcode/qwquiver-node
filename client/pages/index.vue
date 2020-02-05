<template>
  <div class="site-index">
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import axios from '@nuxtjs/axios'
import * as ApiT from '~~/server/ApiTypes'
import F, { ScoreData } from '~~/server/Field'
import $ from 'jquery'
import _ from 'lodash'

@Component({})
export default class IndexPage extends Vue {
  mounted () {

  }
}
</script>

<style lang="scss">
</style>
