import { IVAR, IMEMBER, IEXPR } from './instruction';
import contains from './contains';

export default function getSymbols(tokens, symbols, options) {
  options = options || {};
  var withMembers = !!options.withMembers;
  var prevVar = null;

  for (var i = 0; i < tokens.length; i++) {
    var item = tokens[i];
    if (item.type === IVAR && !contains(symbols, item.value)) {
      if (prevVar !== null || !withMembers) {
        symbols.push(item.value);
      } else {
        prevVar = item.value;
      }
    } else if (item.type === IMEMBER && withMembers && prevVar !== null) {
      prevVar += '.' + item.value;
    } else if (item.type === IEXPR) {
      getSymbols(item.value, symbols, options);
    } else if (prevVar !== null) {
      if (!contains(symbols, prevVar)) {
        symbols.push(prevVar);
      }
      prevVar = null;
    }
  }
}
