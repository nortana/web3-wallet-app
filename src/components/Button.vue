<script setup>
import { ref } from "vue";
import { showDialog, showNotify } from "vant";
import * as bip39 from "bip39";
import { hdkey } from "ethereumjs-wallet";
import store2 from "store2";
import "vant/es/dialog/style";
import "vant/es/notify/style";

const show = ref(false);
const password = ref("");
const mnemonic = ref("");
const mnemonic2 = ref("");
const showMn = ref(false);
const showMnDialog = ref(false);

const createWallet = () => {
  console.log(100);
  show.value = true;
};

const confirmPassword = () => {
  if (password.value === "") {
    showNotify({ type: "danger", message: "请输入密码" });
  } else {
    const walletInfo = store2.get("walletInfo");
    mnemonic.value = walletInfo
      ? walletInfo[0]["mnemonic"]
      : bip39.generateMnemonic();

    if (walletInfo) {
      confirmMn();
    } else {
      showMn.value = true;
    }
  }
};

const confrimSaveMnemonic = () => {
  showMnDialog.value = true;
};

const confirmMn = async () => {
  //console.log(mnemonic.value)
  // console.log(mnemonic2.value)

  showMn.value = false;
  const storWallet = store2.get("walletInfo") || [];
  if (mnemonic.value !== mnemonic2.value && storWallet.length === 0) {
    return;
  }
  console.log("成功");
  const seed = await bip39.mnemonicToSeed(mnemonic.value);
  const hdwallet = hdkey.fromMasterSeed(seed);

  const addressIndex = storWallet.length === 0 ? 0 : storWallet.length + 1;

  const keyPair = hdwallet.derivePath(`m/44'/60'/0'/0/${addressIndex}`);
  const wallet = keyPair.getWallet();

  const lowerCaseAddress = wallet.getAddressString();
  const checkSumAddress = wallet.getChecksumAddressString();
  const privateKey = wallet.getPrivateKey.toString("hex");
  const keyStore = await wallet.toV3(password.value);

  const walletObj = {
    id: addressIndex,
    address: lowerCaseAddress,
    privateKey,
    keyStore,
    mnemonic: mnemonic.value,
    balance: 0,
  };

  storWallet.push(walletObj);

  store2("walletInfo", storWallet);
};
</script>


<template>
  <van-space>
    <van-button type="primary" @click="createWallet">创建钱包</van-button>
    <van-button type="primary">导入钱包</van-button>
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
      </van-cell-group>
    </van-dialog>
  </van-space>
  <template v-if="showMn">
    <p>{{ mnemonic }}</p>
    <van-button type="primary" size="mini" @click="confrimSaveMnemonic">输入助记词</van-button>
  </template>

  <van-dialog
    v-model:show="showMnDialog"
    title="请输入助记词"
    show-cancel-button
    @confirm="confirmMn"
  >
    <van-cell-group inset>
      <van-field
        v-model="mnemonic2"
        label="助记词"
        placeholder="请输入助记词"
      />
    </van-cell-group>
  </van-dialog>
</template>

<style>
p {
  user-select: all;
}
</style>