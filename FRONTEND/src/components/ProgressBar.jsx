const ProgressBar = ({ progress }) => (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div 
        className="h-full bg-[rgba(67,24,255,0.85)] transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
  

  export default ProgressBar;