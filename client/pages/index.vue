<template>
  <div class="site-index">
    <ScoreTable />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import axios from '@nuxtjs/axios'
import F, { ScoreData } from '~~/server/Field'
import ScoreTable from '@/components/ScoreTable.vue'

@Component({
  components: { ScoreTable }
})
export default class IndexPage extends Vue {
}
</script>

<style lang="scss">
</style>
