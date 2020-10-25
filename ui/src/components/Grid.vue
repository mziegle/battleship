<template>
  <table>
    <tr>
      <td></td>
      <td class="header" v-for="index in rows.length" v-bind:key="index">{{ charCodeOf(index - 1) }}</td>
    </tr>
    <tr v-for="row in rows" v-bind:key="row.index">
      <td>{{ row.index + 1 }}</td>
      <field
        v-for="field in row.fields"
        v-bind:key="field.y"
        v-bind:field="field"
        v-on:selected="$emit('selected', field.x, field.y)"
        v-on:unselected="$emit('unselected', field.x, field.y)"
        v-on:clicked="$emit('clicked', field.x, field.y)"
      ></field>
    </tr>
  </table>
</template>

<script>
import Field from "./Field";

export default {
  name: "Grid",
  components: {
    Field,
  },
  props: ["grid"],
  methods: {
    charCodeOf(index) {
      return String.fromCharCode("A".charCodeAt(0) + index);
    },
  },
  computed: {
    rows: function() {
      if (this.grid) {
        return this.grid.rows;
      }
      return [];
    }
  }
};
</script>

<style>
table {
  border-collapse: collapse;
  table-layout: fixed;
}
.header {
  width: 50px;
  text-align: center;
}
</style>