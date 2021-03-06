import Ember from 'ember';
import Cell from 'game-of-life/models/cell';
import computed from 'ember-computed-decorators';

const wrapAround = function(index, length) {
  if (index === -1) {
    return length - 1;
  } else if (index === length) {
    return 0;
  } else {
    return index;
  }
};

export default Ember.Component.extend({
  playing: false,
  widthPreview: 50,
  heightPreview: 50,
  densityPreview: 0.2,
  width: 50,
  height: 50,
  density: 0.2,

  @computed('width', 'height', 'density')
  board(width, height, density) {
    const board = this._setupBoard(width, height, density);
    this._registerNeighbours(board);

    return board;
  },

  actions: {
    step() {
      this._step();
    },

    play() {
      this.set('playing', true);
      this._step(true);
    },

    pause() {
      this.set('playing', false);
      Ember.run.cancel(this.get('runLater'));
    },
  },

  _step(shouldRepeat) {
    const board = this.get('board');
    board.forEach(function(row) {
      row.invoke('step');
    });
    if (shouldRepeat) {
      this.set('runLater', Ember.run.next(this, this._step, true));
    }
  },

  _setupBoard(width, height, density) {
    const board = [];
    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        const alive = Math.random() < density;
        row.pushObject(Cell.create({alive}));
      }
      board.pushObject(row);
    }

    return board;
  },

  _registerNeighbours(board) {
    return board.map(function(row, row_index, board) {
      return row.map(function(cell, cell_index) {
        const neighbours = [
          board[wrapAround(row_index - 1, board.length)][wrapAround(cell_index - 1, row.length)],
          board[wrapAround(row_index - 1, board.length)][wrapAround(cell_index, row.length)],
          board[wrapAround(row_index - 1, board.length)][wrapAround(cell_index + 1, row.length)],
          board[wrapAround(row_index, board.length)][wrapAround(cell_index - 1, row.length)],
          board[wrapAround(row_index, board.length)][wrapAround(cell_index + 1, row.length)],
          board[wrapAround(row_index + 1, board.length)][wrapAround(cell_index - 1, row.length)],
          board[wrapAround(row_index + 1, board.length)][wrapAround(cell_index, row.length)],
          board[wrapAround(row_index + 1, board.length)][wrapAround(cell_index + 1, row.length)]
        ];

        cell.set('neighbours', neighbours);
        return cell;
      });
    });
  },
});
