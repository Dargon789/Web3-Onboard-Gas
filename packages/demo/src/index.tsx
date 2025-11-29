// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import web3Onboard from './web3-onboard'
import { Web3OnboardProvider } from '@subwallet-connect/react'

import { App } from './App';
import reportWebVitals from './reportWebVitals';

require('antd/dist/reset.css');
require('./index.scss');

import { createRoot } from 'react-dom/client';
import {ScreenContextProvider} from "./context/ScreenContext";
import { ThemeProvider } from "./context/ThemeContext";
import {ModalContextProvider} from "@subwallet/react-ui";

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
  <ScreenContextProvider>
    <ThemeProvider>
      <Web3OnboardProvider web3Onboard={web3Onboard}>
        <ModalContextProvider>
          <App />
        </ModalContextProvider>
      </Web3OnboardProvider>
    </ThemeProvider>
  </ScreenContextProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
