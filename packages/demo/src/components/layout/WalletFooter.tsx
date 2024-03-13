import {Theme, ThemeProps} from "../../types";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, {useTheme} from 'styled-components';
import CN from "classnames";

type Props = ThemeProps & {
};


const Component: React.FC<Props> = ({ className }: Props) => {
  const navigate = useNavigate();
  const { token } = useTheme() as Theme;
  return (
    <div className={CN(className, '__wallet-footer')}>

    </div>
  );
};

const WalletFooter = styled(Component)<Props>(({ theme: { token } }: Props) => {
  return {
    alignItems: 'flex-end',
    paddingTop: token.sizeLG,
    position: 'fixed',
    width: '100%',
    bottom: 0,
    height: '1vh',
    paddingBottom: token.paddingMD,
    background: token.colorBgDefault,
    opacity: 1,
    zIndex: 1
  };
});

export default WalletFooter;
