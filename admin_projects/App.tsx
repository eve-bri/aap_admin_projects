import  {Navigator} from './src/navigation/Navigator';

import {decode, encode} from 'base-64'; 
if (!global.btoa) { global.btoa = encode; } if (!global.atob) { global.atob = decode; }

export default function App() {
  return (
    <Navigator/>
  );
}
