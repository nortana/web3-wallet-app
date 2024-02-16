<template>
  <ButtonVue></ButtonVue>
  <account-list :wallet-info="walletInfo"></account-list>
</template>

<script setup>
import AccountListVue from "@/components/AccountList.vue";
import ButtonVue from "@/components/Button.vue";
import { fromEtherCamp } from "ethereumjs-wallet/dist/thirdparty";
import { ref, onMounted } from "vue";
import store2 from "store2";

const walletInfo = ref([]);

onMounted(() => {
  walletInfo.value = store2.get("walletInfo") || [];
  console.log("walletInfo--->",walletInfo)
});
</script>

<style>
body {
  padding: 10px;
}
</style>