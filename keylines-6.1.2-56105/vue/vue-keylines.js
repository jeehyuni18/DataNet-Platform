//
//     Vue components KeyLines v6.1.2-56105
//
//     Copyright © 2011-2020 Cambridge Intelligence Limited.
//     All rights reserved.
//

import Vue from 'vue';

KeyLines.promisify();

const template = '<div ref="container" :class="containerClass" :style="styleObject"></div>';

export const KlComponent = Vue.component('kl-component', {
  props: {
    id: {
      type: String,
      required: true
    },
    container: Object,
    containerClass: String,
    styleObject: Object,
    options: Object,
    data: Object,
    animateOnLoad: {
      type: Boolean,
      default: false
    },
    selection: {
      type: Array,
      default: () => []
    }
  },
  template,
  mounted() {
    KeyLines.create({
      id: this.id,
      options: this.options,
      container: this.$refs ? this.$refs.container : null,
      type: this.type
    }).then(component => {
      this.klcreate(component);
    }).catch(console.err);
  },
  beforeDestroy() {
    this.component.destroy();
  },
  methods: {
    onEvent(props) {
      const name = 'kl-' + props.name;
      this.$emit('kl-all', props);
      this.$emit(name, props.event);
    },
    klcreate(component) {
      this.component = component;
      this.component.on('all', this.onEvent);
      this.component.load(this.data)
        .then(() => this.onLoad({ animate: !!this.animateOnLoad }))
        .then(() => {
          component.selection(this.selection);
          this.$emit('kl-ready', component);
        });
    }
  }
});

export const KlChart = Vue.component('kl-chart', {
  extends: KlComponent,
  data: () => ({
    type: 'chart'
  }),
  methods: {
    onLoad(options) {
      return this.component.layout('standard', options);
    }
  }
});

export const KlTimebar = Vue.component('kl-timebar', {
  extends: KlComponent,
  data: () => ({
    type: 'timebar'
  }),
  methods: {
    onLoad(options) {
      const setOptions = this.component.options({ options });
      const setZoom = this.component.zoom('fit');
      return setOptions && setZoom;
    }
  }
});
