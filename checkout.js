import { siteConfig } from './site-config.js';
let adapter = null;
// Future adapter must request a server-created checkout session. No merchant secret belongs here.
export function setCheckoutAdapter(handler) {
  if (typeof handler !== 'function') throw new TypeError('Checkout adapter must be a function');
  adapter = handler;
}
export async function requestPurchase(trigger) {
  const detail = { productId: siteConfig.productId, source: trigger.dataset.source || 'landing' };
  if (!adapter) {
    document.getElementById('purchase-dialog').showModal();
    return;
  }
  trigger.disabled = true;
  try { await adapter(detail); }
  catch { document.getElementById('purchase-dialog').showModal(); }
  finally { trigger.disabled = false; }
}
