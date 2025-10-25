import { initializeBridge } from '../pubhelp/assets/js/bridge.js';

initializeBridge({
  appName: 'MJH',
  firebaseUrl: 'https://salatiso-lifecv.web.app',
  loginUrl: 'https://the-hub-lifecv.web.app/login',
  description: 'This is the legacy MJH intranet. Continue in the modern Salatiso app for unified access and secure features.',
  badgeLabel: 'New app',
  crossLinks: [
    { label: 'The Hub', url: 'https://the-hub-lifecv.web.app/', icon: 'fa-solid fa-house', description: 'Home base for your account' },
    { label: 'HRHelp', url: 'https://hrhelp-lifecv.web.app/', icon: 'fa-solid fa-briefcase', description: 'HR tools and docs' }
  ]
});
