export function phaseTimelineChart(totalPhase, currentPhase) {
  return (
    <div className="flex">
      {[...Array(totalPhase).keys()].map((phaseCount) => (
        <div
          key={phaseCount}
          className={`p-2 
                 min-w-0
                 m-px
                 rounded-xl 
                 flex 
                 flex-grow 
                 items-center 
                 justify-center ${
                   phaseCount < currentPhase
                     ? "bg-orange-600"
                     : "bg-gray-700"
                 }`}
        >
          {/* <p className="truncate text-xs">{phaseCount + 1}</p> */}
        </div>
      ))}
    </div>
  );
}


export function megalopaTimelineChart(currentPhase) {
  let totalPhase
  
  if (currentPhase < 15){
    totalPhase = 15
  } else {
    totalPhase = 18
  }
  
  return (
    <div className="flex">
      {[...Array(totalPhase).keys()].map((phaseCount) => (
        <div
          key={phaseCount}
          className={`p-2 
                 min-w-0
                 m-px
                 rounded-xl 
                 flex 
                 flex-grow 
                 items-center 
                 justify-center ${
                   phaseCount < currentPhase
                     ? "bg-orange-600"
                     : "bg-gray-700"
                 }`}
        >
          {/* <p className="truncate text-xs">{phaseCount + 1}</p> */}
        </div>
      ))}
    </div>
  );
}
