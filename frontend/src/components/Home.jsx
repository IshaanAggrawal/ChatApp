import {useSelector } from 'react-redux';
import Nochat from '../shared/Nochat';
import Chat from '../shared/Chat';
import Sidebar from '../shared/Sidebar';
function Home() {
  const {selectedUser}=useSelector(store=>store.chat);
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <Nochat /> : <Chat />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
