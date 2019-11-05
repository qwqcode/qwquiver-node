<template>
  <div class="site-index">
    <CardCSSCode />
    <ScoreTable />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import axios from '@nuxtjs/axios'
import F, { ScoreData } from '~/common/interfaces/field'
import ScoreTable from '@/components/ScoreTable.vue'
import Card from '@/components/Card.vue'

@Component({
  components: { ScoreTable, CardCSSCode: Card }
})
export default class IndexPage extends Vue {
}
</script>

<style lang="scss">
</style>
