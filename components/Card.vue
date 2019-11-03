<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class Card extends Vue {}
</script>

<style lang="scss">
/* card */
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #FFF;
  border: 1px solid transparent;
  border-radius: 2px
}

.card-block {
  flex: 1 1 auto;
  padding: 2.1rem;
}

.card-footer,.card-header {
  padding: 2rem 2.1rem;
  background-color: transparent
}

@media screen and (max-width: 559px) {
  .card-footer,.card-header {
      padding: 20px 15px 0 15px;
  }

  .card-block {
      padding: 20px 15px;
  }
}

.card-link+.card-link {
  margin-left: 2.1rem
}

.card-header-pills,.card-header-tabs {
  margin-right: -1.05rem;
  margin-left: -1.05rem
}

.card>.list-group:first-child .list-group-item:first-child {
  border-top-right-radius: 2px;
  border-top-left-radius: 2px
}

.card>.list-group:last-child .list-group-item:last-child {
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 2px
}

.card-header {
  border-bottom: 1px solid transparent;
  position: relative;
}

.card-header:first-child {
  border-radius: 2px 2px 0 0;
}

.card-footer {
  border-top: 1px solid transparent
}

.card-footer:last-child {
  border-radius: 0 0 2px 2px
}

.card-header-tabs {
  margin-bottom: -2rem;
  border-bottom: 0
}

.card-primary {
  background-color: #2196F3;
  border-color: #2196F3
}

.card-primary .card-footer,.card-primary .card-header {
  background-color: transparent
}

.card-success {
  background-color: #32c787;
  border-color: #32c787
}

.card-success .card-footer,.card-success .card-header {
  background-color: transparent
}

.card-info {
  background-color: #00BCD4;
  border-color: #00BCD4
}

.card-info .card-footer,.card-info .card-header {
  background-color: transparent
}

.card-warning {
  background-color: #ffc107;
  border-color: #ffc107
}

.card-warning .card-footer,.card-warning .card-header {
  background-color: transparent
}

.card-danger {
  background-color: #ff5652;
  border-color: #ff5652
}

.breadcrumb,.card-danger .card-footer,.card-danger .card-header,.card-inverse .card-footer,.card-inverse .card-header,.card-outline-danger,.card-outline-info,.card-outline-primary,.card-outline-secondary,.card-outline-success,.card-outline-warning {
  background-color: transparent
}

.card-outline-primary {
  border-color: #2196F3
}

.card-outline-secondary {
  border-color: #efefef
}

.card-outline-info {
  border-color: #00BCD4
}

.card-outline-success {
  border-color: #32c787
}

.card-outline-warning {
  border-color: #ffc107
}

.card-outline-danger {
  border-color: #ff5652
}

.card-inverse {
  color: rgba(255,255,255,.65)
}

.card-inverse .card-blockquote,.card-inverse .card-footer,.card-inverse .card-header,.card-inverse .card-title {
  color: #fff
}

.card-inverse .card-link:focus,.card-inverse .card-link:hover {
  color: #FFF
}

.card-blockquote {
  padding: 0;
  margin-bottom: 0;
  border-left: 0
}

.card-img {
  border-radius: 2px
}

.card-img-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 0
}

.card-img-top {
  border-top-right-radius: 2px;
  border-top-left-radius: 2px
}

.card-img-bottom {
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 2px
}

.card-footer:not(.card-footer--highlight),.card-header+.card-block {
  padding-top: 0
}

@media (min-width: 576px) {
  .card-deck {
      display:flex;
      flex-flow: row wrap
  }

  .card-deck .card {
      display: flex;
      flex: 1 0 0;
      flex-direction: column
  }

  .card-deck .card:not(:first-child) {
      margin-left: 15px
  }

  .card-deck .card:not(:last-child) {
      margin-right: 15px
  }

  .card-group {
      display: flex;
      flex-flow: row wrap
  }

  .card-group .card {
      flex: 1 0 0
  }

  .card-group .card+.card {
      margin-left: 0;
      border-left: 0
  }

  .card-group .card:first-child {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0
  }

  .card-group .card:first-child .card-img-top {
      border-top-right-radius: 0
  }

  .card-group .card:first-child .card-img-bottom {
      border-bottom-right-radius: 0
  }

  .card-group .card:last-child {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0
  }

  .card-group .card:last-child .card-img-top {
      border-top-left-radius: 0
  }

  .card-group .card:last-child .card-img-bottom {
      border-bottom-left-radius: 0
  }

  .card-group .card:not(:first-child):not(:last-child),.card-group .card:not(:first-child):not(:last-child) .card-img-bottom,.card-group .card:not(:first-child):not(:last-child) .card-img-top {
      border-radius: 0
  }

  .card-columns {
      column-count: 3;
      column-gap: 1.25rem
  }

  .card-columns .card {
      display: inline-block;
      width: 100%;
      margin-bottom: 2rem
  }
}

.card {
  box-shadow: 0 1px 2px rgba(0,0,0,.075);
  margin-bottom: 0;
}

.card-block p:only-child,.card-title,.custom-control {
  margin-bottom: 0
}

.card:not([class*=card-outline-]) {
  border: 0
}

[class*=card-outline-] {
  background-color: #FFF
}

.card-title {
  font-size: 1.25rem;
  font-weight: 400;
  display: inline-block;
}


.card-subtitle {
  color: #9c9c9c;
  display: inline-block;
  font-size: 13px;
  vertical-align: baseline;
  margin-left: 10px;
  border-left: 1px solid #EEE;
  padding-left: 10px;
}

@media screen and (max-width: 559px) {
  .card-title {
      font-size: 13px;
      display: block;
  }

  .card-subtitle {
      font-size: 12px;
      border-left: 0;
      margin-left: 0;
      padding-left: 0;
  }
}


.card-header .btn--action {
  position: absolute;
  right: 25px;
  bottom: -25px
}

.card-header .actions,.card>.actions {
  float: right;
  right: 15px;
  z-index: 2;
  top: 18px;
}

.actions [dropdown] {
  display: inline-block
}

.actions:not(.actions--inverse) .actions__item {
  color: #707070;
}

.actions:not(.actions--inverse) .actions__item:hover {
  color: #2196F3;
}

.actions:not(.actions--inverse) .actions__item.actions__item--active {
  color: #575757
}

.actions__item {
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  transition: color .3s;
  height: 30px;
  display: inline-block;
  font-size: 15px;
  position: relative;
}

.actions__item:not(:last-child) {
  margin-right: 20px;
}

@media screen and (max-width: 559px) {
  .card-header .actions {
      position: absolute;
      bottom: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.76);
      padding: 0 10px 0 15px;
  }

  .actions__item > span {
      display: none;
  }

  .actions__item:not(:last-child) {
      margin-right: 5px;
  }

  .actions:not(.actions--inverse) .actions__item:hover {
      color: #707070;
  }
}

.actions__item>i {
  display: inline-block;
  margin-right: 2px;
  width: 15px;
}

.actions--inverse .actions__item {
  color: rgba(255,255,255,.7)
}

.actions--inverse .actions__item--active,.actions--inverse .actions__item:hover {
  color: #FFF
}

.card-inverse .card-blockquote .blockquote-footer,.card-inverse .card-link,.card-inverse .card-subtitle,.card-inverse .card-text {
  color: rgba(255,255,255,.85)
}

.card-inverse .card-footer,.card-inverse .card-header {
  border-color: transparent
}

.card-link {
  font-size: .98rem;
  color: #333;
  font-weight: 500
}

.card-link:hover {
  text-decoration: none;
  color: #4d4d4d
}

.card-footer--highlight {
  background-color: #f9f9f9
}

.card-block__title {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: .6rem;
  font-weight: 400
}

.card--fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
  /* padding-top: 55px; */
  overflow: auto;
}

.card-block__nav {
  margin-bottom: 1.8rem;
  padding: 0 1px
}

.card-block__nav>a {
  font-weight: 500;
  color: #b0b0b0;
  transition: color .3s
}

.card-block__nav>a+a {
  padding-left: 1rem
}

.card-block__nav>a.active,.card-block__nav>a:hover {
  color: #707070
}
</style>
