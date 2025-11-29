// Copyright 2019-2022 @subwallet/extension-koni-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Icon, SwIconProps } from '@subwallet/react-ui';
import { Question }  from "@phosphor-icons/react";
import React from 'react';

type Props = Omit<SwIconProps, 'type' | 'phosphorIcon' | 'fontawesomeIcon' | 'antDesignIcon'>

const InfoIcon: React.FC<Props> = (props: Props) => {
  return (
    <Icon
      phosphorIcon={Question}
      {...props}
    />
  );
};

export default InfoIcon;
