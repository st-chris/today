import { TodoDoneFilterPipe } from './todo-done-filter.pipe';

describe('TodoDoneFilterPipe', () => {
  const items = [
    {
      text: 'item a',
      color: '#febc82',
      done: false,
    },
    {
      text: 'item b',
      color: '#fecb02',
      done: false,
    },
    {
      text: 'item c',
      color: '#02c8f5',
      done: false,
    },
    {
      text: 'item d',
      color: '#fecb02',
      done: false,
    },
    {
      text: 'item e',
      color: '#ff5503',
      done: true,
    },
    {
      text: 'item f',
      color: '#fecb02',
      done: true,
    },
  ];

  it('create an instance', () => {
    const pipe = new TodoDoneFilterPipe();
    expect(pipe).toBeTruthy();
  });

  it('filters done todo items', () => {
    const pipe = new TodoDoneFilterPipe();
    expect(pipe.transform(items).length).toBe(4);
  });
});
