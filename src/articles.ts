import { fromEvent } from "rxjs";
import { switchMap, retry } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { url } from "./config";

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
