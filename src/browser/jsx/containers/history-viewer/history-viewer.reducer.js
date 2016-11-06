import _ from 'lodash';
import Immutable from 'seamless-immutable';
import jupyterHistory from '../../services/jupyter/history';
import mapReducers from '../../services/map-reducers';

/**
 * If any of the history blocks are jupyterResponse types, then they might need to be updated with new content
 * @param {Array} state
 * @param {object} action
 * @returns {Array}
 */
function jupyterResponseDetected(state, action) {
  const responseMsgId = _.get(action, 'payload.result.parent_header.msg_id'),
    blockIndex = _.findIndex(state.blocks, {responseMsgId});

  if (blockIndex > -1) {
    state = state.updateIn(['blocks', blockIndex], container => {
      return jupyterHistory.applyResponse(container, action.payload);
    });
  }

  return state;
}

function contract(state, action) {
  const blockIndex = _.findIndex(state.blocks, {id: action.payload.blockId});

  if (blockIndex > -1) {
    const itemIndex = _.findIndex(state.blocks[blockIndex].items, {id: action.payload.itemId});

    if (itemIndex > -1) {
      state = state.setIn(['blocks', blockIndex, 'items', itemIndex, 'expanded'], false);
    }
  }

  return state;
}

function expand(state, action) {
  const blockIndex = _.findIndex(state.blocks, {id: action.payload.blockId});

  if (blockIndex > -1) {
    const itemIndex = _.findIndex(state.blocks[blockIndex].items, {id: action.payload.itemId});

    if (itemIndex > -1) {
      state = state.setIn(['blocks', blockIndex, 'items', itemIndex, 'expanded'], true);
    }
  }

  return state;
}

export default mapReducers({
  HISTORY_VIEWER_CONTRACT: contract,
  HISTORY_VIEWER_EXPAND: expand,
  JUPYTER_RESPONSE: jupyterResponseDetected
}, {});
