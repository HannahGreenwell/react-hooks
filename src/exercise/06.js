// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
  fetchPokemon,
} from '../pokemon'

const requestStatus = {
  idle: 'IDLE',
  pending: 'PENDING',
  resolved: 'RESOLVED',
  rejected: 'REJECTED',
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    pokemon: null,
    status: pokemonName ? requestStatus.pending : requestStatus.idle,
    error: null,
  })
  const {pokemon, status, error} = state

  console.log('PokemonInfo render start')

  React.useEffect(() => {
    console.log('PokemonInfo useEffect')
    if (!pokemonName) {
      return
    }
    setState({status: requestStatus.pending})
    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({
          pokemon: pokemonData,
          status: requestStatus.resolved,
        })
      })
      .catch(error => {
        setState({
          error: error,
          status: requestStatus.rejected,
        })
      })
  }, [pokemonName])

  console.log('PokemonInfo render end')

  if (status === requestStatus.idle) {
    return 'Submit a pokemon'
  }
  if (status === requestStatus.pending) {
    return <PokemonInfoFallback name={pokemonName} />
  }
  if (status === requestStatus.resolved) {
    return <PokemonDataView pokemon={pokemon} />
  }
  if (status === requestStatus.rejected) {
    throw error
  }

  throw new Error()
}

function FallbackComponent({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  console.log('App render start')
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={FallbackComponent}
          onReset={() => setPokemonName('')}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App

// class ErrorBoundary extends React.Component {
//   state = {error: null}

//   static getDerivedStateFromError(error) {
//     return {error}
//   }

//   componentDidCatch(error, errorInfo) {
//     // log error here
//   }

//   render() {
//     const {error} = this.state
//     if (error) {
//       return <this.props.FallbackComponent error={error} />
//     }

//     return this.props.children
//   }
// }
