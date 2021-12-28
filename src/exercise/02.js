// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorage(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [value, setValue] = React.useState(() => {
    const localStorageValue = window.localStorage.getItem(key)
    if (localStorageValue) {
      return deserialize(localStorageValue)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const previousKeyRef = React.useRef(key)

  React.useEffect(() => {
    const previousKey = previousKeyRef.current
    if (previousKey !== key) {
      window.localStorage.removeItem(previousKey)
    }
    previousKeyRef.current = key
    window.localStorage.setItem(key, serialize(value))
  }, [key, serialize, value])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorage('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="Giuseppe" />
}

export default App
