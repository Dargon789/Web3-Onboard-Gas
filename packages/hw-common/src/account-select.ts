import { firstValueFrom, Subject, take } from 'rxjs'
import AccountSelect from './views/AccountSelect.svelte'
import { accounts$ } from './streams.js'
import { validateSelectAccountOptions } from './validation.js'

import type { SelectAccountOptions, Account } from './types.js'

// eslint-disable-next-line max-len
const accountSelect = async (
  options: SelectAccountOptions
): Promise<Account[]> => {
  // if (options) {
  //   const error = validateSelectAccountOptions(options)
  //
  //   if (error) {
  //     throw error
  //   }
  // }

  const app = mountAccountSelect(options, accounts$)

  accounts$.pipe(take(1)).subscribe(() => {
    app.$destroy()
  })

  return firstValueFrom(accounts$)
}

// eslint-disable-next-line max-len
const mountAccountSelect = (
  selectAccountOptions: SelectAccountOptions,
  accounts$: Subject<Account[]>
) => {
  class AccountSelectEl extends HTMLElement {
    constructor() {
      super()
    }
  }

  if (!customElements.get('account-select')) {
    customElements.define('account-select', AccountSelectEl)
  }

  // add to DOM
  const accountSelectDomElement = document.createElement('account-select')
  const target = accountSelectDomElement.attachShadow({ mode: 'open' })

  accountSelectDomElement.style.all = 'initial'

  target.innerHTML = `
    <style>
      :host {
        /* COLORS */
        --white: white;
        --black: black;
        --primary-100: #a0c7fa;
        --primary-200: #76aaf7;
        --primary-300: #4e8af2;
        --primary-400: #2565e6;
        --primary-500: #004BFF;
        --primary-600: #0031a6;
        --primary-700: #00174d;
        --gray-100: #ebebed;
        --gray-200: #c2c4c9;
        --gray-300: #999ca5;
        --gray-500: #33394b;
        --gray-700: #1a1d26;
        --gray-800: #1A1A1A;
        --danger-500: #ff4f4f;
        --success-100: #d1fae3;
        --success-200: #baf7d5;
        --success-300: #a4f4c6;
        --success-400: #8df2b8;
        --success-500: #3aa683;
        --success-600: #4cd9ac;
        --success-700: #129b4d;

        /* FONTS */
        --font-family-normal: var(--w3o-font-family, 'Plus Jakarta Sans', Inter, sans-serif);
        --font-size-5: 1rem;
        --font-size-6: .875rem;
        --font-size-7: .75rem;
        --font-line-height-1: 24px;

        /* SPACING */
        --margin-4: 1rem;
        --margin-5: 0.5rem;

        /* MODAL POSITION */
        --account-select-modal-z-index: 20;
        --account-select-modal-top: unset;
        --account-select-modal-right: unset;
        --account-select-modal-bottom: unset;
        --account-select-modal-left: unset;

        /* SHADOWS */
        --shadow-1: 0px 4px 12px rgba(0, 0, 0, 0.1);

        /* THEMING */
        --background-color: var(--w3o-background-color, #FFF);
        --foreground-color: var(--w3o-foreground-color);
        --text-color: var(--w3o-text-color, inherit);
        --border-color: var(--w3o-border-color, var(--gray-200));
        --action-color: var(--w3o-action-color, var(--primary-500));
      }
    </style>
  `
  const containerElementQuery = selectAccountOptions.containerElement || 'body'

  const containerElement = document.querySelector(containerElementQuery)

  if (!containerElement) {
    throw new Error(
      `Element with query ${containerElementQuery} does not exist.`
    )
  }

  containerElement.appendChild(accountSelectDomElement)

  const app = new AccountSelect({
    target: target,
    props: {
      selectAccountOptions,
      accounts$
    }
  })

  return app
}

export default accountSelect
