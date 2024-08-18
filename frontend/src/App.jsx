import './App.css'
import { Discussion } from './components/Discussion'
import { PollForm } from './components/PollForm'
import { PollList } from './components/PollList'
import { PollDetail } from './components/PollDetail'
import { Header } from './components/Header'

function App() {

  return (
    <div>
      <h1>Realtime Polling App</h1>
      <PollList />
      <PollForm />
      <Discussion />
      <PollDetail />
      <Header />
    </div>
  )
}

export default App
