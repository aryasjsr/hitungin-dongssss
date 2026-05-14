const UNITS = {
  nol: 0,
  satu: 1,
  se: 1,
  dua: 2,
  tiga: 3,
  empat: 4,
  lima: 5,
  enam: 6,
  tujuh: 7,
  delapan: 8,
  sembilan: 9,
};

const SEPARATORS = new Set(['dan', 'lalu', 'kemudian', 'terus', 'berikutnya', 'jeda']);
const SCALE_WORDS = new Set(['belas', 'puluh', 'ratus', 'ribu']);

function isUnit(word) {
  return UNITS[word] !== undefined;
}

function isNumericToken(token) {
  return /^\d+(?:[,.]\d+)?$/.test(token);
}

function consumeBelowHundred(tokens, start) {
  const word = tokens[start];
  const next = tokens[start + 1];

  if (word === 'sepuluh') return { value: 10, nextIndex: start + 1 };
  if (word === 'sebelas') return { value: 11, nextIndex: start + 1 };

  if (!isUnit(word)) return null;

  if (next === 'belas') {
    return { value: UNITS[word] + 10, nextIndex: start + 2 };
  }

  if (next === 'puluh') {
    let value = UNITS[word] * 10;
    let nextIndex = start + 2;
    const possibleUnit = tokens[nextIndex];
    const afterUnit = tokens[nextIndex + 1];

    if (isUnit(possibleUnit) && !SCALE_WORDS.has(afterUnit)) {
      value += UNITS[possibleUnit];
      nextIndex += 1;
    }

    return { value, nextIndex };
  }

  return { value: UNITS[word], nextIndex: start + 1 };
}

function consumeInteger(tokens, start) {
  let i = start;
  let total = 0;
  let consumed = false;

  if (tokens[i] === 'seribu') {
    total += 1000;
    i += 1;
    consumed = true;
  } else {
    const thousands = consumeBelowHundred(tokens, i);
    if (thousands && tokens[thousands.nextIndex] === 'ribu') {
      total += thousands.value * 1000;
      i = thousands.nextIndex + 1;
      consumed = true;
    }
  }

  if (tokens[i] === 'seratus') {
    total += 100;
    i += 1;
    consumed = true;
  } else {
    const hundreds = consumeBelowHundred(tokens, i);
    if (hundreds && tokens[hundreds.nextIndex] === 'ratus') {
      total += hundreds.value * 100;
      i = hundreds.nextIndex + 1;
      consumed = true;
    }
  }

  const belowHundred = consumeBelowHundred(tokens, i);
  if (belowHundred) {
    total += belowHundred.value;
    i = belowHundred.nextIndex;
    consumed = true;
  }

  return consumed ? { value: total, nextIndex: i } : null;
}

function consumeDecimalDigits(tokens, start) {
  const digits = [];
  let i = start;

  while (i < tokens.length) {
    const token = tokens[i];
    const afterToken = tokens[i + 1];

    if (/^\d+$/.test(token)) {
      digits.push(...token.split(''));
      i += 1;
      continue;
    }

    if (isUnit(token) && !SCALE_WORDS.has(afterToken)) {
      digits.push(String(UNITS[token]));
      i += 1;
      continue;
    }

    break;
  }

  return digits.length > 0 ? { digits, nextIndex: i } : null;
}

function consumeNumber(tokens, start) {
  const token = tokens[start];

  if (isNumericToken(token)) {
    return { value: Number(token.replace(',', '.')), nextIndex: start + 1 };
  }

  const integer = consumeInteger(tokens, start);
  if (!integer) return null;

  if (tokens[integer.nextIndex] !== 'koma' && tokens[integer.nextIndex] !== 'titik') {
    return integer;
  }

  const decimal = consumeDecimalDigits(tokens, integer.nextIndex + 1);
  if (!decimal) return integer;

  return {
    value: Number(`${integer.value}.${decimal.digits.join('')}`),
    nextIndex: decimal.nextIndex,
  };
}

export function parseSpeechNumbers(transcript) {
  if (!transcript) return { values: [], invalidTokens: [] };

  const tokens = transcript
    .toLowerCase()
    .replace(/-/g, ' ')
    .match(/\d+(?:[,.]\d+)?|[a-z]+/g) || [];

  const values = [];
  const invalidTokens = [];

  for (let i = 0; i < tokens.length;) {
    if (SEPARATORS.has(tokens[i])) {
      i += 1;
      continue;
    }

    const parsed = consumeNumber(tokens, i);
    if (!parsed || !Number.isFinite(parsed.value)) {
      invalidTokens.push(tokens[i]);
      i += 1;
      continue;
    }

    values.push(parsed.value);
    i = parsed.nextIndex;
  }

  return { values, invalidTokens };
}
