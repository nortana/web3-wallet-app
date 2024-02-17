<script setup>
import { ref, defineProps, compile, computed, inject  } from "vue";
import Web3 from "web3";
import ethwallet from "ethereumjs-wallet";
import Tx from "ethereumjs-tx";

const wssGoerliTest = inject('$wssGoerliTest');//注入全局方法

const web3 = new Web3(Web3.givenProvider || wssGoerliTest);

const show = ref(false);
const password = ref("");
const keyStore = ref("");
const fromaddress = ref("");
const toaddress = ref("");
const number = ref(0);

const props = defineProps(["wallet-info"]);

//keyStore.value, password.value
const send = async () => {
  let walletobj;
  try {
    walletobj = await ethwallet.fromVw(keyStore.value, password.value);
  } catch (error) {
    alert("密码错误");
    return false;
  }
  let key = walletobj.getPrivateKey().toString("hex");
  const privatekey = Buffer(key, "hex");

  let nonce = await web3.eth.getTransactionCount(fromaddress.slice(2));

  let gasPrice = await web3.eth.getGasPrice();

  let balance = web3.utils.toWei(number.value);

  let rawTx = {
    from: address.value,
    nonce: nonce,
    gasPrice: gasPrice,
    to: toaddress.value,
    value: balance,
    data: "0x00",
  };

  let gas = await web3.eth.estimateGas(rawTx);
  rawTx.gas = gas;
  var tx = new Tx(rawTx);
  tx.sign(privatekey);
  var serializedTx = tx.serialized();

  web3.eth
    .sendSignedTransaction(serializedTx.toString("hex"))
    .on("transactionHash", (txid) => {
      console.log("");
    });
};

const getPassword = (keyStore, address) => {
  show.value = true;
  keyStore.value = keyStore;
  fromaddress.value = address;
};
const confirmPassword = () => {
  //password.value = "";
  send();
};

const walletInfoAddressFilter = computed(async () => {
  props.walletInfo.forEach(async (item, index) => {
    item.originalAddress = item.address;
    const head = item.address.slice(0, 8);
    const tail = item.address.slice(item.address.length - 8);
    item.address = head + "...." + tail;

    const bresult = await web3.eth.getBalance(adr);
    //根据地址获取余额
    item.balance = web3.utils.fromWei(bresult, "ether");
    item.balance = Number(item.balance).toFixed(6);
  });
  return props.walletInfo;
});
</script>

<template>
  <div>
    <van-cell
      :title="item.address"
      icon="user-o"
      v-for="(item, index) in walletInfoAddressFilter"
      :key="index"
    >
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template #right-icon>
        <van-button
          type="primary"
          size="small"
          @click="getPassword(item.keyStore, item.originalAddress)"
          >{{ toFixed(item.balance,2) }}</van-button
        >
      </template>
    </van-cell>
  </div>
  <van-dialog
    v-model:show="show"
    title="标题"
    show-cancel-button
    @confirm="confirmPassword"
  >
    <van-cell-group inset>
      <van-field
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
      />
      <van-field
        v-model="toaddress"
        label="转入账户"
        placeholder="请输入转入账户"
      />
      <van-field
        v-model="number"
        label="转出金额"
        placeholder="请输入转出金额"
      />
    </van-cell-group>
  </van-dialog>
</template>

<style>
</style>