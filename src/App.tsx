import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          AI Calendar Planner - Test
        </h1>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Click the button below to test if interactions work:
          </p>
          
          <button 
            onClick={() => setCount(count + 1)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Click me! Count: {count}
          </button>
          
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p className="text-sm text-gray-700">
              If you can see this count changing when you click the button, 
              then React interactions are working properly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;