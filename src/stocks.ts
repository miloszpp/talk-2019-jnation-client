import { fromEvent } from "rxjs";
import { map, switchMap, retry } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { url } from "./config";

interface PriceResult {
  price: number;
  timestamp: number;
}

const getPriceButtonEl = document.getElementById('button-get-price') as HTMLButtonElement;
const priceInputEl = document.getElementById('input-stock-symbol') as HTMLInputElement;
const priceSectionEl = document.getElementById('section-price') as HTMLDivElement;

fromEvent(getPriceButtonEl, 'click').pipe(
  map(() => priceInputEl.value),
  switchMap(symbol => 
    ajax.getJSON<PriceResult>(`${url}/stocks/${symbol}`)
  ),
  retry(),
).subscribe(
  result => priceSectionEl.innerHTML = `Price: ${result.price}`,
);
