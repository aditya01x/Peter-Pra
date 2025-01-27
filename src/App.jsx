import { ReactLenis, useLenis } from 'lenis/react'
import Routing from './utils/Routing';

const App = () => {

  const lenis = useLenis((d) => {
    console.log(d)
  });

  return (
    <ReactLenis root>
      <main className='w-full min-h-screen'>
        <Routing />
      </main>
    </ReactLenis>
  )
}

export default App