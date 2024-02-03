// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import web3Onboard from './web3-onboard'
import { Web3OnboardProvider } from '@subwallet_connect/react'

import { App } from './App';
import reportWebVitals from './reportWebVitals';

require('antd/dist/reset.css');
require('./index.scss');

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
root.render(
    <Web3OnboardProvider web3Onboard={web3Onboard}>
        <App />
    </Web3OnboardProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
