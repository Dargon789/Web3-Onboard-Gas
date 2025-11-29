import { useMemo } from 'react';

import { isEthereumAddress } from '@polkadot/util-crypto';

export default function useAccountAvatarTheme (address: string): 'polkadot'|'ethereum' {
  return useMemo(
    (): 'polkadot'|'ethereum' => {
      if (address && isEthereumAddress(address)) {
        return 'ethereum';
      }

      return 'polkadot';
    }, [address]);
}
