import React from 'react';
import Checkout from '../Checkout';
import { I18nProvider, Trans } from '@lingui/react';

export default function HomePage() {
  const language = 'pt-BR'
  const localeMessage = require(`../locales/${language}/messages.js`);

  return (
      <I18nProvider language={language} catalogs={{ [language]: localeMessage }}>
          <div className='container'>
              <h5>{<Trans id='checkout.title'>Checkout</Trans>}</h5>
          </div>
          <div className='divider'/>
          <div className='container'>
              <Checkout />
          </div>
      </I18nProvider>
  );
}
