import SearchLayer from '@/components/layers/SearchLayer.vue'
import ScoreTable from '@/components/ScoreTable.vue'

declare module 'vue/types/vue' {
  interface Vue {
    $searchLayer: SearchLayer
    $scoreTable: ScoreTable|undefined
  }
}
