// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

export function windowReload () {
  window.location.reload();
}

export const openInNewTab = (url: string) => {
  return () => {
    window.open(url, '_blank');
  };
};
