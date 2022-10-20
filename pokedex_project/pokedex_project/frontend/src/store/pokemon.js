import { LOAD_ITEMS, REMOVE_ITEM, ADD_ITEM } from './items';

const LOAD = 'pokemon/LOAD';
const LOAD_TYPES = 'pokemon/LOAD_TYPES';
const ADD_ONE = 'pokemon/ADD_ONE';
const CREATE_ONE = 'pokemon/CREATE_ONE';

//NORMAL ACTION CREATORS
const load = list => ({
  type: LOAD,
  list
});

const loadTypes = types => ({
  type: LOAD_TYPES,
  types
});

const addOnePokemon = pokemon => ({
  type: ADD_ONE,
  pokemon
});

//THUNK ACTION CREATORS
export const getOnePokemon = (id) => dispatch => {
  return fetch(`/api/pokemon/${id}`)
  .then(res => res.json())
  .then(data => {

    dispatch(addOnePokemon(data))
  })
} 

export const getPokemon = () => async dispatch => {
  const response = await fetch(`/api/pokemon`);
  if (response.ok) {
    const list = await response.json();

    dispatch(load(list));
  }
};

export const getPokemonTypes = () => async dispatch => {
  const response = await fetch(`/api/pokemon/types`);
  if (response.ok) {
    const types = await response.json();
    dispatch(loadTypes(types));
  }
};

export const createPokemonRequest = (pokemon) => async dispatch => {
  console.log(pokemon)
  const response = await fetch('/api/pokemon', {
                                                                method: "POST",
                                                                body: JSON.stringify(pokemon), 
                                                                headers: {
                                                                  'Content-Type': 'application/json',
                                                                  'Accept': 'application/json'
                                                                }
                                                                                        })
  if(response.ok){
    const data = await response.json()
    console.log(data)
    dispatch(addOnePokemon(data))       
    return data
  }                                                       
    // .then(res => {
    //   console.log(res)
    //   res.json()
    // })
    // .then(data => {
    //   console.log(data)
    //   dispatch(addOnePokemon(data))
    //   return data
    // })
}

export const editPokemonRequest = (pokemon) => dispatch => {
  return fetch(`/api/pokemon/${pokemon.id}`, {
    method: "PUT",
    body: JSON.stringify(pokemon),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      return dispatch(addOnePokemon(data));
      // return data;
    })
}

const initialState = {
  list: [],
  types: []
};

const sortList = (list) => {
  return list.sort((pokemonA, pokemonB) => {
    return pokemonA.number - pokemonB.number;
  }).map((pokemon) => pokemon.id);
};



//reducer ------
const pokemonReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD: 
      const allPokemon = {};
      action.list.forEach(pokemon => {
        allPokemon[pokemon.id] = pokemon;
      });
      return {
        ...allPokemon,
        ...state,
        list: sortList(action.list)
      };
    case LOAD_TYPES: 
      return {
        ...state,
        types: action.types
      };
    case ADD_ONE: 
      if (!state[action.pokemon.id]) {
        const newState = {
          ...state,
          [action.pokemon.id]: action.pokemon
        };
        const pokemonList = newState.list.map(id => newState[id]);
        pokemonList.push(action.pokemon);
        newState.list = sortList(pokemonList);
        return newState;
      }
      return {
        ...state,
        [action.pokemon.id]: {
          ...state[action.pokemon.id],
          ...action.pokemon
        }
      };
    case LOAD_ITEMS: 
      return {
        ...state,
        [action.pokemonId]: {
          ...state[action.pokemonId],
          items: action.items.map(item => item.id)
        }
      };
    case REMOVE_ITEM:
      return {
        ...state,
        [action.pokemonId]: {
          ...state[action.pokemonId],
          items: state[action.pokemonId].items.filter(
            (itemId) => itemId !== action.itemId
          )
        }
      };
    case ADD_ITEM:
      console.log(action.item);
      return {
        ...state,
        [action.item.pokemonId]: {
          ...state[action.item.pokemonId],
          items: [...state[action.item.pokemonId].items, action.item.id]
        }
      };

    case CREATE_ONE:
      console.log(action.pokemon)
      return state;
    
    default:
      return state;
  }
}

export default pokemonReducer;