<template>
  <div id="container">Hello {{ msg }}.</div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Vue",
    };
  },
};
</script>

<style lang="scss" scoped>
#container {
  color: red;
}
</style>
