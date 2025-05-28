export default function Loader() {
  return (
     <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="flex space-x-2">
        <div 
          className="w-4 h-4 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full"
          style={{
            animation: 'wave 1s ease-in-out infinite',
          }}
        ></div>
        <div 
          className="w-4 h-4 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full"
          style={{
            animation: 'wave 1s ease-in-out infinite',
            animationDelay: '0.1s',
          }}
        ></div>
        <div 
          className="w-4 h-4 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full"
          style={{
            animation: 'wave 1s ease-in-out infinite',
            animationDelay: '0.2s',
          }}
        ></div>
      </div>
      <style>
        {`
          @keyframes wave {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
          }
        `}
      </style>
    </div>
  )
}