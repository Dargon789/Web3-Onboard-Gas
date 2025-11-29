import type { Chain } from '@subwallet-connect/common'
import { onDestroy, onMount, beforeUpdate, afterUpdate } from 'svelte'
import { Observable, Subject, defer, BehaviorSubject } from 'rxjs'
import {
  take,
  takeUntil,
  withLatestFrom,
  pluck,
  shareReplay
} from 'rxjs/operators'


import { resetStore } from './store/actions.js'
import { state } from './store/index.js'

import type { WalletState, ConnectOptions, ModalQrConnect } from './types.js'
import type { EthereumTransactionData } from 'bnc-sdk'


export const reset$ = new Subject<void>()
export const disconnectWallet$ = new Subject<Pick<WalletState, 'label' | 'type'>>()

export const qrModalConnect$ = new BehaviorSubject<ModalQrConnect>({
  isOpen: false
});

export const uriConnect$ = new BehaviorSubject<string>('')

export const connectWallet$ = new BehaviorSubject<{
  autoSelect?: ConnectOptions['autoSelect']
  actionRequired?: string
  inProgress: boolean
}>({ inProgress: false, actionRequired: '' })

export const switchChainModal$ = new BehaviorSubject<null | {
  chain: Chain
}>(null)

export const wallets$ = (
    state.select('wallets') as Observable<WalletState[]>
).pipe(shareReplay(1))

// reset logic
reset$.pipe(withLatestFrom(wallets$), pluck('1')).subscribe(wallets => {
  // disconnect all wallets
  wallets.forEach(({ label, type }) => {
    disconnectWallet$.next({ label, type })
  })

  resetStore()
})

// keep transactions for all notifications for replacement actions
export const transactions$ = new BehaviorSubject<EthereumTransactionData[]>([])

export function updateTransaction(tx: EthereumTransactionData): void {
  const currentTransactions = transactions$.getValue()

  const txIndex = currentTransactions.findIndex(({ hash }) => hash === tx.hash)

  if (txIndex !== -1) {
    const updatedTransactions = currentTransactions.map((val, i) =>
        i === txIndex ? tx : val
    )

    transactions$.next(updatedTransactions)
  } else {
    transactions$.next([...currentTransactions, tx])
  }
}

export function removeTransaction(hash: string): void {
  const currentTransactions = transactions$.getValue()
  transactions$.next(currentTransactions.filter(tx => tx.hash !== hash))
}

export const onMount$ = defer(() => {
  const subject = new Subject<void>()
  onMount(() => {
    subject.next()
  })
  return subject.asObservable().pipe(take(1))
})

export const onDestroy$ = defer(() => {
  const subject = new Subject<void>()
  onDestroy(() => {
    subject.next()
  })
  return subject.asObservable().pipe(take(1))
})

export const afterUpdate$ = defer(() => {
  const subject = new Subject<void>()
  afterUpdate(() => {
    subject.next()
  })
  return subject.asObservable().pipe(takeUntil(onDestroy$))
})

export const beforeUpdate$ = defer(() => {
  const subject = new Subject<void>()
  beforeUpdate(() => {
    subject.next()
  })
  return subject.asObservable().pipe(takeUntil(onDestroy$))
})
