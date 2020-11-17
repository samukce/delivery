import React from 'react';
import ReactDOM from 'react-dom';
import Checkout from './Checkout';
import * as serviceWorker from './serviceWorker';
import { I18nProvider, Trans } from '@lingui/react';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';

const App = ({ language} ) => {
    const localeMessage = require(`./locales/${language}/messages.js`);

    return (
        <I18nProvider language={language} catalogs={{ [language]: localeMessage }}>
            <div className='container'>
                <h5>{<Trans id='checkout.title'>Checkout</Trans>}</h5>
            </div>
            <div className='divider'/>
            <div className='container'>
                <Checkout />
            </div>

            <NotificationContainer/>
        </I18nProvider>
    );
}

ReactDOM.render(<App language='pt-BR' />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
