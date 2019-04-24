import './../barecss/css/bare.min.css';

import { Observable, merge, Subject, fromEvent, empty, of, throwError, timer } from 'rxjs';
import { publish, skipWhile, takeWhile, take, tap, map, switchMap, repeatWhen, delay, takeUntil, share, withLatestFrom, retry, retryWhen, filter, throwIfEmpty, delayWhen, shareReplay } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import {memoize} from 'lodash';

const url = 'http://localhost:3000';

//--------

interface Article {
  id: number;
  title: string;
}

type ArticleWithBody = Article & { body: string };

const getArticlesButtonEl = document.getElementById('button-get-articles') as HTMLButtonElement;
const articlesListEl = document.getElementById('list-articles') as HTMLSelectElement;
const bodyParagraphEl = document.getElementById('paragraph-body') as HTMLParagraphElement;

const updateArticleList = (articles: Article[]) => {
  articlesListEl.innerHTML = articles.map(
    article => `<option value='${article.id}'>${article.title}</option>`
  ).join('');
};

const updateArticle = (article: ArticleWithBody) => {
  bodyParagraphEl.innerText = article.body;
}

fromEvent(getArticlesButtonEl, 'click').pipe(
  switchMap(() => ajax.getJSON<Article[]>(`${url}/articles`)),
  retry(),
).subscribe(updateArticleList);

fromEvent(articlesListEl, 'change').pipe(
  switchMap(event => {
    const articleId = (event.target as HTMLSelectElement).value;
    return ajax.getJSON<ArticleWithBody>(`${url}/articles/${articleId}`)
  }),
  retry(),
).subscribe(updateArticle);

//--------

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

//--------

interface AnalyzeTask {
  id: number;
  status: 'inProgress' | 'cancelled' | 'finished';
  result?: 'positive' | 'negative';
}

const inputEl = document.getElementById('input-text') as HTMLTextAreaElement;
const resultsSectionEl = document.getElementById('section-results') as HTMLDivElement;
const analyzeButtonEl = document.getElementById('button-analyze') as HTMLButtonElement;
const cancelButtonEl = document.getElementById('button-cancel') as HTMLButtonElement;

const updateUI = (task: AnalyzeTask) => {
  switch (task.status) {
    case 'inProgress':
      resultsSectionEl.innerHTML = 'Loading...';
      return;
    case 'finished':
      resultsSectionEl.innerHTML = `Result: ${task.result === 'positive' ? '😀' : '☹️'}`;
      return;
    case 'cancelled':
      resultsSectionEl.innerHTML = '';
      return;
  }
}