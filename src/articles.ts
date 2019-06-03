import { fromEvent } from "rxjs";
import { switchMap, retry } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { url } from "./config";

interface Article {
  id: number;
  title: string;
}

const getArticlesButton1El = document.getElementById('button-get-articles-1') as HTMLButtonElement;
const getArticlesButton2El = document.getElementById('button-get-articles-2') as HTMLButtonElement;
const articlesList1El = document.getElementById('list-articles-1') as HTMLSelectElement;
const articlesList2El = document.getElementById('list-articles-2') as HTMLSelectElement;

const updateArticleList = (el: HTMLSelectElement) => (articles: Article[]) => {
  el.innerHTML = articles.map(
    article => `<option value='${article.id}'>${article.title}</option>`
  ).join('');
};

fromEvent(getArticlesButton1El, 'click').pipe(
  switchMap(() => ajax.getJSON<Article[]>(`${url}/articles`)),
  retry(),
).subscribe(updateArticleList(articlesList1El));

fromEvent(getArticlesButton2El, 'click').pipe(
  switchMap(() => ajax.getJSON<Article[]>(`${url}/articles`)),
  retry(),
).subscribe(updateArticleList(articlesList2El));