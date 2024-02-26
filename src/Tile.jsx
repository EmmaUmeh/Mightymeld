export function Tile({ content: Content, flip, state }) {
  switch (state) {
    case "start":
      return (
        <Back
          className="inline-block h-[80px] cursor-pointer flex justify-center items-center rounded-md bg-indigo-300 text-center w-20 bg-blue-300 text-center"
          flip={flip}
        />
      );
    case "flipped":
      return (
        <Front className="flex justify-center text-white inline-block h-[80px] w-20 bg-green-500 cursor-pointer items-center bg-indigo-500 px-2 rounded-md">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Front>
      );
    case "matched":
      return (
        <Matched className="flex justify-center items-center text-center inline-block h-[80px] w-20 text-gray-300">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Matched>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}

function Back({ className, flip }) {
  return (
    <div onClick={flip} className={className}></div>
  );
}

function Front({ className, children }) {
  return <div className={className}>{children}</div>;
}

function Matched({ className, children }) {
  return <div className={className}>{children}</div>;
}
