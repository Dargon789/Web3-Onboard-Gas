<script lang="ts">
  import { weiToEth } from '@subwallet-connect/common'
  import type { Account, AccountsList } from '../types.js'

  export let accountsListObject: AccountsList | undefined

  export let handleAddAccount : ( length: number ) => void;
  export let lengthAccountSelectedDefault : number
  export let accountSelected: Account[] = []
  export let showEmptyAddresses: boolean

  $: accounts = showEmptyAddresses
    ? accountsListObject && accountsListObject.all
    : accountsListObject && accountsListObject.filtered

  $: accountsSelectedLength = lengthAccountSelectedDefault
  const handleSelectedRow = (accountClicked: Account) => {
    const accountExits = accountSelected.findIndex(
            ({ address }) => address === accountClicked.address);
    if(accountExits >= 0){
      accountSelected.splice(accountExits, 1);
    }else{
      accountSelected.push(accountClicked)
    }

    accountsSelectedLength = accountSelected.length;
    handleAddAccount(accountSelected.length)
  }
</script>

<style>
  table {
    border-spacing: 0px;
  }

  table::-webkit-scrollbar {
    width: 0
  }

  table::-webkit-scrollbar-track {
    background-color: transparent
  }

  table::-webkit-scrollbar-thumb {
    background-color: transparent
  }

  table thead {
    box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.1);
    background: var(--account-select-background-color, var(--foreground-color));
  }

  th,
  td {
    text-align: left;
    padding: 0.4rem 0.5rem;
  }

  td {
    font-size: var(
      --account-select-font-size-6,
      var(--onboard-font-size-6, var(--font-size-6))
    );
    line-height: var(
      --account-select-font-line-height-1,
      var(--onboard-font-line-height-1, var(--font-line-height-1))
    );
  }

  tbody tr {
    box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.1);
  }

  tbody tr:hover {
    background: var(
      --account-select-primary-100,
      var(--onboard-primary-100, var(--primary-100))
    );
    color: var(--account-select-text-color, var(--onboard-black, var(--black)));
  }

  .address-table {
    min-height: 4.5rem;
    max-height: 14rem;
    overflow: auto;
  }

  .selected-row,
  .selected-row:hover {
    background: var(
      --account-select-primary-500,
      var(--onboard-primary-500, var(--primary-500))
    );
    color: var(
      --account-select-primary-100,
      var(--onboard-primary-100, var(--primary-100))
    );
  }

  .asset-td {
    font-weight: bold;
  }
  .w-100 {
    width: 100%;
  }

  .pointer {
    cursor: pointer;
  }

  @media all and (min-width: 768px) {
    .address-table {
      max-height: 27rem;
    }

    td {
      font-size: var(
        --account-select-font-size-5,
        var(--onboard-font-size-5, var(--font-size-5))
      );
    }

    th,
    td {
      padding: 0.5rem 0.5rem;
    }
  }
</style>

<div class="address-table">
  <table class="w-100">
    <colgroup>
      <col style="width: 50%;" />
      <col style="width: 28%;" />
      <col style="width: 22%;" />
    </colgroup>
    <thead class="">
      <tr>
        <th>Address</th>
        <th>DPATH</th>
        <th>Asset</th>
      </tr>
    </thead>
    <tbody>
      {#if accounts && accounts.length}
        {#each accounts as account}
          <tr
            class="pointer"
            class:selected-row={accountsSelectedLength > 0 &&
              !!accountSelected
              .find(({ address }) => address === account.address ) }
            on:click={() => handleSelectedRow(account)}
          >
            <td style="font-family:'Courier New', Courier, monospace;"
              >{account.address}</td
            >
            <td>{account.derivationPath}</td>
            {#if account.balance.value.toString() !== '0'}
            <td class="asset-td"
              >{weiToEth(account.balance.value.toString())}
              {account.balance.asset}</td
            >
              {/if}
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>
