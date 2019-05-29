import { fromEvent, Subject } from "rxjs";
import { map, switchMap, retryWhen, repeatWhen, delay, takeWhile, withLatestFrom, tap, share } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { url } from "./config";

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

const startAnalysis = (text: string) =>
  ajax.post(`${url}/analyze`, { message: text }).pipe(
    map(ajaxResponse => ajaxResponse.response as AnalyzeTask)
  );

const getTaskStatus = (id: number) =>
    ajax.getJSON<AnalyzeTask>(`${url}/analyze/${id}`);

const cancelTask = (id: number) => 
  ajax.post(`${url}/analyze/${id}/cancel`);

const analyzeButtonClick$ = fromEvent(analyzeButtonEl, 'click');
const cancelButtonClick$ = fromEvent(cancelButtonEl, 'click');
