<template>
  <td
    class="field"
    @mouseover="$emit('selected', field.x, field.y)"
    @mouseleave="$emit('unselected', field.x, field.y)"
    @click="$emit('clicked', field.x, field.y)"
    v-bind:class="{highlighted: this.field.selected}">
  {{ field.value }}
  </td>
</template>

<script>
export default {
  name: "Field",
  props: [
    'field'
  ],
};
</script>

<style>
.field {
  border: 2px solid black;
  width: 50px;
  height: 50px;
  text-align: center;
}
.highlighted {
  background-color: lightgrey;
}
</style>