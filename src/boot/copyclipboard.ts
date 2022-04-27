import { boot } from 'quasar/wrappers';
import copyText from '@meforma/vue-copy-to-clipboard';


export default boot(async ({ app }) => {
  // something to do
  app.use(copyText);
})
